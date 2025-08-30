import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getAuthToken = () => user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const fetchBorrowedBooks = async () => {
      try {
        const res = await axios.get(
          "https://library-1-e1mi.onrender.com/borrow/records",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const borrowed = (res.data.borrows || []).filter(b => b && b.bookId);
        setBorrowedBooks(borrowed);

        console.log("Borrowed books fetched:", borrowed);
      } catch (error) {
        console.error("Error fetching borrowed books:", error.response || error);
      }
    };

    fetchBorrowedBooks();
  }, [user]);

  const handleReturn = async (borrowId) => {
    if (!borrowId) return;

    try {
      const res = await axios.post(
        "https://library-1-e1mi.onrender.com/borrow/return",
        { borrowId },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );

      alert(res.data.message || "Book returned successfully!");

      setBorrowedBooks(prev =>
        prev.map(b => b._id === borrowId ? { ...b, status: "returned", bookId: { ...b.bookId, available: b.bookId.available + 1 } } : b)
      );
    } catch (error) {
      console.error("Return error:", error.response || error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  if (user?.role === "librarian") {
    return (
      <span className="flex ml-100 justify-center items-center text-center text-red-500">
        Access Denied. It is for borrowers only.
      </span>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-serif  mb-6 text-center">My Borrowed Books</h1>

      {borrowedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {borrowedBooks.map((book) => (
            <div
              key={book._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{book.bookId?.title || "N/A"}</h2>
              <p className="text-gray-600 mt-1">
                Author: {book.bookId?.author || "N/A"}
              </p>
              <p className="text-gray-600 mt-1">Borrow ID: {book._id}</p>
              <p className="text-gray-600 mt-1">
                Borrow Date: {new Date(book.borrowDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-1">
                Available: {book.bookId?.available ?? 0}
              </p>

              {book.status !== "returned" && (
                <button
                  onClick={() => handleReturn(book._id)}
                  className="mt-4 w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Return
                </button>
              )}

              {book.status === "returned" && (
                <span className="mt-4 inline-block w-full text-center text-green-600 font-semibold">
                  Returned
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You have not borrowed any books.
        </p>
      )}
    </div>
  );
};

export default Books;
