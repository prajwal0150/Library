import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const borrowSchema = new Schema({
  borrowDate: { type: Date, required: true, default: Date.now },
  returnDate: { type: Date },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'borrowed' }
}, { timestamps: true });

const Borrow = model('Borrow', borrowSchema);

export default Borrow;
