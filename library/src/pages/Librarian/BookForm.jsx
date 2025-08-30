import { useState, useEffect } from "react";
import axios from "axios";

export default function BookForm({ setBooks, editBook, setEditBook, setModalForm }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editBook) {
      setTitle(editBook.title || "");
      setAuthor(editBook.author || "");
      setIsbn(editBook.isbn || "");
      setQuantity(editBook.quantity || 1);
      setErrors({});
    } else {
      setTitle("");
      setAuthor("");
      setIsbn("");
      setQuantity(1);
      setErrors({});
    }
  }, [editBook]);

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (!author) newErrors.author = "Author is required";
    if (!isbn) newErrors.isbn = "ISBN is required";
    if (!quantity || quantity < 1) newErrors.quantity = "Quantity must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addBook = async (bookData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:5000/book/addBook", bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

  const updateBook = async (bookId, bookData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:5000/book/updateBook/${bookId}`,
      bookData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const bookData = { title, author, isbn, quantity };
    try {
      if (editBook) {
        const updatedBook = await updateBook(editBook._id, bookData);
        setBooks((prev) =>
          prev.map((b) => (b._id === editBook._id ? updatedBook : b))
        );
        alert("Book updated successfully!");
      } else {
        const newBook = await addBook(bookData);
        setBooks((prev) => [...prev, newBook]);
        alert("Book added successfully!");
      }

      // Clear form and close modal
      setTitle("");
      setAuthor("");
      setIsbn("");
      setQuantity(1);
      setErrors({});
      setEditBook(null);
      setModalForm(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-7 sm:p-5">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {editBook ? "Edit Book" : "Add New Book"}
        </h2>
        <p className="text-sm text-gray-500">Fill in the book details below</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-0.5 text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-0.5">{errors.title}</p>}
          </div>

          <div className="flex-1">
            <label className="block mb-0.5 text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none ${
                errors.author ? "border-red-500" : ""
              }`}
            />
            {errors.author && <p className="text-red-500 text-sm mt-0.5">{errors.author}</p>}
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-0.5 text-gray-700">ISBN</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className={`w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none ${
                errors.isbn ? "border-red-500" : ""
              }`}
            />
            {errors.isbn && <p className="text-red-500 text-sm mt-0.5">{errors.isbn}</p>}
          </div>

          <div className="flex-1">
            <label className="block mb-0.5 text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`w-full px-2 py-1 border rounded-md focus:ring-1 focus:ring-blue-400 focus:outline-none ${
                errors.quantity ? "border-red-500" : ""
              }`}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-0.5">{errors.quantity}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {editBook ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
}
