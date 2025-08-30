import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BookForm from './BookForm';
import { FaEdit, FaTrash, FaPlus, FaRegFileAlt } from 'react-icons/fa';

export default function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [modalForm, setModalForm] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'librarian') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('hhttps://library-1-e1mi.onrender.com/book/getAllBooks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(Array.isArray(res.data.books) ? res.data.books : []);
    } catch (err) {
      console.error('Error fetching books:', err);
      setBooks([]);
    }
  };

  useEffect(() => {
    if (user?.role === 'librarian') fetchBooks();
  }, [user]);

  useEffect(() => {
    const handleBookReturn = (event) => {
      const returnedBook = event.detail; 
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === returnedBook._id
            ? { ...book, quantity: returnedBook.quantity, available: returnedBook.available }
            : book
        )
      );
    };

    window.addEventListener("bookReturned", handleBookReturn);
    return () => {
      window.removeEventListener("bookReturned", handleBookReturn);
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Do you want to delete the book?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://library-1-e1mi.onrender.com/book/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks((prev) => prev.filter((book) => book._id !== id));
      alert('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Something went wrong while deleting the book');
    }
  };

  if (!user) {
    return <div className="p-6">Loading user info...</div>;
  }

  return (
    <div className="p-6 min-h-screen w-[83vw] bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Librarian Dashboard</h2>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => {
                setEditBook(null);
                setModalForm(true);
              }}
            >
              <FaPlus /> Add Book
            </button>
            <button
              className="flex items-center gap-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              onClick={() => navigate('/home/librarian/borrowRecords')}
            >
              <FaRegFileAlt /> View Borrow Records
            </button>
          </div>
        </div>

        <table className="w-full text-left text-sm text-gray-700 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">ISBN</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(books && books.length > 0 ? books : []).map((book) => (
              <tr key={book._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{book.title}</td>
                <td className="px-4 py-2">{book.author}</td>
                <td className="px-4 py-2">{book.isbn}</td>
                <td className="px-4 py-2">{book.quantity}</td>
                <td className="px-4 py-2">{book.available}</td>
                <td className="px-4 py-2 flex gap-3">
                  <FaEdit
                    title="Edit Book"
                    className="cursor-pointer text-green-500 hover:text-green-700"
                    onClick={() => {
                      setEditBook(book);
                      setModalForm(true);
                    }}
                  />
                  <FaTrash
                    title="Delete Book"
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(book._id)}
                  />
                </td>
              </tr>
            ))}
            {(!books || books.length === 0) && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalForm && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setModalForm(false)}
            >
              ✕
            </button>
            <BookForm
              setBooks={setBooks}
              editBook={editBook}
              setEditBook={setEditBook}
              setModalForm={setModalForm}
              refreshBooks={fetchBooks}
            />
          </div>
        </div>
      )}
    </div>
  );
}
