import bookModel from "../model/Book.js";
import borrowModel from "../model/Borrow.js";
export async function borrowBook(req, res) {
  const { bookId } = req.body;
  const userId = req.user.id;

  try {
    const book = await bookModel.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.available <= 0) return res.status(400).json({ message: "No copies available" });


    const borrowRecord = await borrowModel.create({
      bookId: book._id,
      userId,
      status: "borrowed",
      borrowDate: new Date()
    });

    book.available -= 1;
    await book.save();

    res.status(200).json({ message: "Book borrowed successfully", borrow: borrowRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function bookReturn(req, res) {
  const { borrowId } = req.body;
  try {
    const borrowRecord = await borrowModel.findById(borrowId);
    if (!borrowRecord) return res.status(404).json({ message: "Borrow record not found" });

    if (borrowRecord.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (borrowRecord.returnDate) return res.status(400).json({ message: "Book already returned" });

    borrowRecord.returnDate = new Date();
    borrowRecord.status = "returned";
    await borrowRecord.save();

 
    const book = await bookModel.findById(borrowRecord.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.status(200).json({ message: "Book returned successfully", borrow: borrowRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function borrowRecord(req, res) {
  try {
    const borrows = await borrowModel
      .find()
      .populate('userId', 'name email')
      .populate('bookId', 'title author');
    return res.status(200).json({ message: 'Borrow records fetched successfully.', borrows });
  } catch (error) {
    console.error('BorrowRecord Error:', error.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}