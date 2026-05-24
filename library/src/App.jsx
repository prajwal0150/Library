import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Home from './pages/home';
import Aboutus from './pages/aboutus';
import Contact from './pages/Contact';

import Profile from './pages/Borrower/Profile';


import { AuthProvider } from './context/AuthContext';
import BorrowRecord from './pages/Librarian/BorrowRecord';
import Books from './pages/Borrower/Books';
import LibrarianDashboard from './pages/Librarian/Dashboard';
import BorrowDashboard from './pages/Borrower/Dashboard';


const App = () => {
  const getHomeRoute = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      return storedUser?.role === 'librarian'
        ? '/home/librarian/dashboard'
        : '/home/borrower/dashboard';
    } catch {
      return '/';
    }
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

       
        <Route path="/home" element={<Home />}>
          <Route index element={<Navigate to={getHomeRoute()} replace />} />
          <Route path="/home/borrower/dashboard" element={<BorrowDashboard allowedRoles={['borrower']} />} />
          <Route path="/home/borrower/bookDetail/" element={<Books allowedRoles={['borrower']} />} />
          <Route path="/home/borrower/profile" element={<Profile />} />
          <Route path="/home/librarian/dashboard" element={<LibrarianDashboard allowedRoles={['librarian']} />} />
          <Route path="/home/librarian/borrowRecords" element={<BorrowRecord allowedRoles={['librarian']} />} />
          <Route path="/home/aboutus" element={<Aboutus />} />
          <Route path="/home/contact" element={<Contact />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
