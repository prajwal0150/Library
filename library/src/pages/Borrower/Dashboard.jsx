import React, { useEffect, useMemo, useState, useContext } from "react";
import api from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBookOpen,
  FaChevronRight,
  FaCircle,
  FaFilter,
  FaMagnifyingGlass,
  FaSpinner,
  FaStar,
  FaTag,
  FaXmark,
} from "react-icons/fa6";

const CATEGORY_RULES = [
  { label: "Technology", keywords: ["code", "clean", "program", "tech", "computer", "software", "algorithm", "startup"] },
  { label: "Business", keywords: ["startup", "business", "leadership", "strategy", "economics", "lean"] },
  { label: "History", keywords: ["history", "human", "civilization", "sapiens"] },
  { label: "Sci-Fi", keywords: ["dune", "galaxy", "space", "future", "science"] },
  { label: "Classic", keywords: ["romeo", "juliet", "alchemist", "moby", "pride", "emma"] },
  { label: "Self-Help", keywords: ["habits", "deep work", "productivity", "mindset", "atomic"] },
  { label: "Fiction", keywords: ["fiction", "novel", "story", "journey"] },
];

const COVER_THEMES = [
  "from-slate-900 via-slate-800 to-slate-700",
  "from-blue-950 via-sky-900 to-slate-900",
  "from-amber-900 via-orange-800 to-rose-900",
  "from-emerald-900 via-teal-800 to-slate-900",
  "from-violet-950 via-indigo-900 to-slate-900",
  "from-stone-900 via-zinc-800 to-neutral-900",
];

const BorrowDashboard = () => {
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [savingBookId, setSavingBookId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getAuthToken = () => user?.token || localStorage.getItem("token");

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
    }
  }, [navigate, user]);

  const normalize = (value) => String(value || "").toLowerCase();

  const getCategory = (book) => {
    const source = normalize(`${book.title} ${book.author} ${book.isbn}`);
    const match = CATEGORY_RULES.find((category) =>
      category.keywords.some((keyword) => source.includes(keyword))
    );
    return match?.label || "General";
  };

  const getTheme = (book) => {
    const seed = normalize(book.title)
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0);
    return COVER_THEMES[seed % COVER_THEMES.length];
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDashboardData = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading(true);
    try {
      const [booksResponse, borrowsResponse] = await Promise.all([
        api.get("/book/getAllBooks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/borrow/records", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const booksData = Array.isArray(booksResponse.data)
        ? booksResponse.data
        : booksResponse.data.books || [];
      const borrowsData = borrowsResponse.data.borrows || [];

      setBooks(booksData);
      setBorrowRecords(borrowsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [user]);

  const activeBorrow = useMemo(
    () => borrowRecords.find((record) => record && !record.returnDate && record.status !== "returned"),
    [borrowRecords]
  );

  const activeBorrowMeta = useMemo(() => {
    if (!activeBorrow?.bookId) {
      return null;
    }

    const borrowDate = new Date(activeBorrow.borrowDate || activeBorrow.createdAt || Date.now());
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);
    const elapsedDays = Math.max(0, Math.floor((Date.now() - borrowDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const progress = Math.min(100, Math.max(0, Math.round((elapsedDays / 14) * 100)));

    return { borrowDate, dueDate, elapsedDays, daysRemaining, progress };
  }, [activeBorrow]);

  const totalBooks = books.length;
  const filteredBooks = books.filter((book) => {
    const category = getCategory(book);
    const matchesSearch = [book.title, book.author, book.isbn]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    const matchesCategory = selectedCategory === "All" || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(books.map((book) => getCategory(book)))];

  const stats = [
    { label: "Available Books", value: books.reduce((total, book) => total + (Number(book.available) || 0), 0), accent: "text-emerald-400" },
    { label: "Active Loans", value: borrowRecords.filter((record) => record && !record.returnDate && record.status !== "returned").length, accent: "text-blue-400" },
    { label: "Due Soon", value: borrowRecords.filter((record) => {
      if (!record || record.returnDate || record.status === "returned") return false;
      const borrowDate = new Date(record.borrowDate || record.createdAt || Date.now());
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 14);
      const daysRemaining = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysRemaining <= 3;
    }).length, accent: "text-amber-300" },
    { label: "Total Borrowed", value: borrowRecords.length, accent: "text-slate-100" },
  ];

  const handleBorrow = async (bookId) => {
    setSavingBookId(bookId);
    try {
      await api.post(
        "/borrow/take",
        { bookId },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      await getDashboardData();
      setSelectedBook(null);
      alert("Book borrowed successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setSavingBookId(null);
    }
  };

  const openBookDetails = (book) => {
    setSelectedBook({
      ...book,
      category: getCategory(book),
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090d14] text-slate-100">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <FaSpinner className="animate-spin text-blue-400" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100">
      <div className="mx-auto max-w-[1600px] px-4 py-4 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Wednesday, June 14, 2025</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">Library Dashboard</h1>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#0e1420] px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.18)] sm:w-[320px]">
              <FaMagnifyingGlass className="text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, author, ISBN..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-[#0e1420] p-3 text-slate-300 transition hover:bg-white/5 hover:text-white">
              <FaBell />
              <span className="sr-only">Notifications</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0e1420] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white">
              <FaFilter />
              Filter
            </button>
          </div>
        </div>

        {activeBorrow && activeBorrowMeta && (
          <section className="mb-6 rounded-[1.5rem] border border-blue-500/35 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(17,24,39,0.86))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/6 text-blue-300 ring-1 ring-blue-500/25">
                  <FaBookOpen className="text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Currently Borrowing: "{activeBorrow.bookId?.title || "Unknown Book"}" by {activeBorrow.bookId?.author || "Unknown Author"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Due: {formatDate(activeBorrowMeta.dueDate)} - {activeBorrowMeta.daysRemaining} days remaining
                  </p>
                </div>
              </div>

              <div className="min-w-[220px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Time elapsed</span>
                  <span>{activeBorrowMeta.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${activeBorrowMeta.progress}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/home/borrower/bookDetail")}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/15 px-4 py-2.5 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/25"
                >
                  <FaChevronRight className="rotate-180" />
                  Manage Borrowing
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Available Books</h2>
            <p className="mt-1 text-sm text-slate-400">
              Showing {filteredBooks.length} of {totalBooks} books
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-500 text-white shadow-[0_12px_32px_rgba(59,130,246,0.28)]"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_50px_rgba(0,0,0,0.2)]"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{stat.label}</p>
              <p className={`mt-3 text-3xl font-semibold ${stat.accent}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filteredBooks.map((book) => {
              const category = getCategory(book);
              const theme = getTheme(book);
              const available = Number(book.available) || 0;
              const totalQuantity = Number(book.quantity) || available;

              return (
                <article
                  key={book._id}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111827] shadow-[0_22px_70px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-blue-500/25 hover:shadow-[0_32px_90px_rgba(0,0,0,0.4)]"
                >
                  <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${theme}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.65))]" />
                    <div className="absolute left-3 top-3 rounded-full bg-[#0f172a]/70 px-3 py-1 text-[11px] font-semibold text-blue-200 ring-1 ring-blue-400/20">
                      {category}
                    </div>
                    <div className="absolute inset-x-4 bottom-4">
                      <p className="max-w-[85%] text-2xl font-semibold leading-tight text-white drop-shadow-sm">
                        {book.title}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                        <FaStar className="text-amber-300" />
                        Borrower favorite
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{book.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{book.author}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FaCircle className={`text-[9px] ${available > 0 ? "text-emerald-400" : "text-red-400"}`} />
                        <span>
                          Available: <span className="font-semibold text-white">{available} copies</span>
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{totalQuantity} total</span>
                    </div>

                    <button
                      onClick={() => openBookDetails(book)}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-10 text-center text-slate-400">
            No books match your search or filter.
          </div>
        )}
      </div>

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1624] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              onClick={() => setSelectedBook(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <FaXmark />
            </button>

            <div className={`h-56 bg-gradient-to-br ${getTheme(selectedBook)}`}>
              <div className="flex h-full flex-col justify-end bg-[linear-gradient(180deg,rgba(15,23,42,0.15),rgba(15,23,42,0.88))] p-6">
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold text-blue-200 ring-1 ring-white/10">
                  <FaTag />
                  {selectedBook.category}
                </div>
                <h3 className="max-w-xl text-3xl font-semibold tracking-tight text-white">
                  {selectedBook.title}
                </h3>
                <p className="mt-2 text-slate-300">{selectedBook.author}</p>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">ISBN</p>
                    <p className="mt-2 font-medium text-white">{selectedBook.isbn}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Quantity</p>
                    <p className="mt-2 font-medium text-white">{selectedBook.quantity ?? selectedBook.available}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Available</p>
                    <p className="mt-2 font-medium text-white">{selectedBook.available}</p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-slate-400">
                  This layout is designed to mirror the reference dashboard: bold cover art, dense stats, and a fast borrow flow without losing the action on the book itself.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Borrow status</span>
                  <span className={selectedBook.available > 0 ? "text-emerald-300" : "text-red-300"}>
                    {selectedBook.available > 0 ? "Available" : "Unavailable"}
                  </span>
                </div>
                <button
                  onClick={() => handleBorrow(selectedBook._id)}
                  disabled={selectedBook.available < 1 || savingBookId === selectedBook._id}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {savingBookId === selectedBook._id ? <FaSpinner className="animate-spin" /> : <FaBookOpen />}
                  {selectedBook.available > 0 ? "Borrow Book" : "No Copies Available"}
                </button>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowDashboard;
