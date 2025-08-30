import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BorrowDashboard = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getAuthToken = () => user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/book/getAllBooks",
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        );

        const booksData = Array.isArray(res.data) ? res.data : res.data.books || [];
        setBooks(booksData);

      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      await axios.post(
        "http://localhost:5000/borrow/take",
        { bookId },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      alert("Book borrowed successfully!");
      setBooks((prev) =>
        prev.map((b) =>
          b._id === bookId ? { ...b, available: b.available - 1 } : b
        )
      );
      if (selectedBook && selectedBook._id === bookId) {
        setSelectedBook({ ...selectedBook, available: selectedBook.available - 1 });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 min-h-screen w-[83vw] bg-gray-100">
      <h1 className="text-3xl font-serif  mb-6 text-center">Library Dashboard</h1>

      {!selectedBook ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book._id}
                className="border rounded-lg p-4 shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p className="text-gray-600 mt-1">Author: {book.author}</p>
                <p className="text-gray-600 mt-1">Available: {book.available}</p>

                <button
                  onClick={() => setSelectedBook(book)}
                  className="mt-4 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No books found.
            </p>
          )}
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={() => setSelectedBook(null)}
            className="mb-4 text-sm text-blue-600 underline"
          >
            ← Back to all books
          </button>

          <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
          <p className="text-gray-700 mt-2">Author: {selectedBook.author}</p>
          <p className="text-gray-700 mt-1">ISBN: {selectedBook.isbn}</p>
          <p className="text-gray-700 mt-1">Available: {selectedBook.available}</p>

          <button
            onClick={() => handleBorrow(selectedBook._id)}
            disabled={selectedBook.available < 1}
            className="mt-4 w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Borrow
          </button>
        </div>
      )}
    </div>
  );
};

export default BorrowDashboard;
