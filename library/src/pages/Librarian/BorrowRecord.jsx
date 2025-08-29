import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BorrowRecord = () => {
  const [borrows, setBorrows] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
 

  useEffect(() => {
    if (!user || user.role !== 'librarian') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchBorrows = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/borrow/records`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBorrows(Array.isArray(res.data.borrows) ? res.data.borrows : []);
    } catch (err) {
      console.error("Error fetching borrow records:", err);
      setBorrows([]);
    }
  };

  useEffect(() => {
    if (user?.role === 'librarian') {
      fetchBorrows();
    }
  }, [user]);

  if (!user) {
    return <div className="p-6">Loading user info...</div>;
  }

  return (
    <div className="p-6 min-h-screen w-[83vw] bg-gray-100 ">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Borrow Records</h2>
        <table className="w-full text-left text-sm text-gray-700 border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">Book Title</th>
              <th className="px-4 py-2">Borrow Date</th>
              <th className="px-4 py-2">Return Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {borrows.length > 0 ? (
              borrows.map((borrow) => (
                <tr key={borrow._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{borrow.userId?.name || 'Unknown'}</td>
                  <td className="px-4 py-2">{borrow.bookId?.title || 'Unknown'}</td>
                  <td className="px-4 py-2">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {borrow.returnDate
                      ? new Date(borrow.returnDate).toLocaleDateString()
                      : 'Not returned'}
                  </td>
                  <td className="px-4 py-2">
                    {borrow.status || 'Borrowed'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No borrow records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowRecord;