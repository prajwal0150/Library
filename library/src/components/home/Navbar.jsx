import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaArrowRightFromBracket,
  FaBook,
  FaBookOpen,
  FaCircle,
  FaClockRotateLeft,
  FaEnvelope,
  FaHouse,
  FaLayerGroup,
  FaCircleUser,
} from "react-icons/fa6";
import api from "../../lib/api";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarStats, setSidebarStats] = useState({
    activeLoans: 0,
    dueSoon: 0,
    totalBorrowed: 0,
    availableCopies: 0,
  });

  useEffect(() => {
    const loadSidebarStats = async () => {
      const token = user?.token || localStorage.getItem("token");

      if (!token || !user) {
        return;
      }

      try {
        const [booksResponse, borrowsResponse] = await Promise.all([
          api.get("/book/getAllBooks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/borrow/records", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const books = Array.isArray(booksResponse.data)
          ? booksResponse.data
          : booksResponse.data.books || [];
        const borrows = borrowsResponse.data.borrows || [];
        const activeBorrows = borrows.filter((borrow) => borrow && !borrow.returnDate && borrow.status !== "returned");
        const dueSoon = activeBorrows.filter((borrow) => {
          const borrowDate = new Date(borrow.borrowDate || borrow.createdAt || Date.now());
          const dueDate = new Date(borrowDate);
          dueDate.setDate(dueDate.getDate() + 14);
          const daysRemaining = Math.ceil((dueDate - Date.now()) / (1000 * 60 * 60 * 24));
          return daysRemaining <= 3;
        });

        setSidebarStats({
          activeLoans: activeBorrows.length,
          dueSoon: dueSoon.length,
          totalBorrowed: borrows.length,
          availableCopies: books.reduce((total, book) => total + (Number(book.available) || 0), 0),
        });
      } catch (error) {
        console.error("Error loading sidebar stats:", error);
      }
    };

    loadSidebarStats();
  }, [user]);

  if (!user) {
    return null;
  }

  const memberCode = String(user?._id || user?.email || "member")
    .replace(/[^a-z0-9]/gi, "")
    .slice(-4)
    .toUpperCase();
  const initials = (user?.name || "User")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const navItems = [
    { to: "/home/borrower/dashboard", label: "Dashboard", icon: FaHouse },
    { to: "/home/borrower/bookDetail", label: "Browse Books", icon: FaBookOpen },
    { to: "/home/borrower/profile", label: "My Profile", icon: FaCircleUser },
    { to: "/home/aboutus", label: "About Us", icon: FaLayerGroup },
    { to: "/home/contact", label: "Contact Us", icon: FaEnvelope },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-[300px] shrink-0 flex-col border-r border-white/10 bg-[#070b12] text-slate-100">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30">
            <FaBookOpen className="text-xl" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">LibraryOS</p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Management System</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_60px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-500 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name || "Borrower"}</p>
              <p className="text-xs text-slate-400">
                {user?.role === "librarian" ? "Librarian" : `Member #${memberCode || "0000"}`}
              </p>
            </div>
            <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.85)]" />
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Menu
        </p>

        <div className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_10px_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="text-base" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">My Account</p>
            <FaClockRotateLeft className="text-slate-500" />
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Active Loans</span>
              <span className="font-semibold text-white">{sidebarStats.activeLoans}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Due Soon</span>
              <span className="font-semibold text-amber-300">{sidebarStats.dueSoon}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Total Borrowed</span>
              <span className="font-semibold text-white">{sidebarStats.totalBorrowed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Available Copies</span>
              <span className="font-semibold text-emerald-300">{sidebarStats.availableCopies}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
        >
          <FaArrowRightFromBracket />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
