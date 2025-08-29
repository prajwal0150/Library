import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['borrower', 'librarian'], default: 'borrower' },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const userModel = model('User', userSchema);
export default userModel;
