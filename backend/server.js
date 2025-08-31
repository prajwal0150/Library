import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { authToken, checkRole } from "./middleware/auth.js";
import { Addbook, BookUpdate, deleteBook, getAllBooks, getBookById } from "./controller/books.controller.js";
import { Loginuser, Register } from "./controller/auth.controller.js";
import { bookReturn, borrowBook, borrowRecord } from "./controller/borrow.controller.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT||5000;
const allowedOrigins = [
  "http://localhost:5173",           
  "http://localhost:8081",             
  "https://library-2-aa70.onrender.com" 
];

app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 
      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error("CORS policy does not allow access from this origin."),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true, 
  })
);

app.get("/", authToken, (req, res) => {
  res.status(200).json({ message: "Token verified successfully!" });
});


app.post("/auth/login", Loginuser);
app.post("/auth/register", Register);
app.post("/book/addBook",authToken, Addbook);
app.get("/book/getAllBooks", authToken, getAllBooks);
app.get("/book/getBook/:id", authToken, getBookById);
app.delete("/book/delete/:id", authToken, checkRole(["librarian"]), deleteBook);
app.put("/book/updateBook/:id",authToken,checkRole(["librarian"]),BookUpdate)


app.post("/borrow/take", authToken, borrowBook);
app.post("/borrow/return", authToken, bookReturn);
app.get("/borrow/records", authToken,  borrowRecord)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server is running at port:", PORT);
    });
  })
  .catch((err) => {
    console.log("❌ Error connecting to MongoDB:", err);
  });
