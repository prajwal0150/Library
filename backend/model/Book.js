import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const bookSchema = new Schema(
  {
    title: { type: String, required: true },  // fixed spelling from "tittle"
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    quantity: { type: Number, min: 1 },
    available: { type: Number, min: 0 }
  },
  { timestamps: true }
);

const bookModel = model('Book', bookSchema);
export default bookModel;
