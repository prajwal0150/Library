import bookModel from '../model/Book.js';


export async function Addbook(req, res) {
    const { title, author, isbn, quantity } = req.body;
    if (!title || !author || !isbn || !quantity) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // if (!/^\d{10}|\d{13}$/.test(isbn)) {
    //     return res.status(400).json({ message: 'Invalid ISBN format (must be 10 or 13 digits).' });
    // }
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be positive.' });
    }
    try {
        const existBook = await bookModel.findOne({ isbn });
        if (existBook) {
            return res.status(400).json({ message: 'ISBN already exists.' });
        }
        const book = new bookModel({
            title,
            author,
            isbn,
            quantity,
            available: quantity
        });
        await book.save();
        return res.status(201).json({ message: 'Book added successfully.', book });
    } catch (error) {
        console.error('AddBook Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


export async function getAllBooks(req, res) {
    try {
        const books = await bookModel.find();
        return res.status(200).json({ message: 'Books found.', books });
    } catch (error) {
        console.error('GetAllBooks Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


export async function getBookById(req, res) {
    try {
        const id = req.params.id;
        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        return res.status(200).json({ message: 'Book found.', book });
    } catch (error) {
        console.error('GetBookById Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


export async function BookUpdate(req, res) {
    const { title, author, isbn, quantity } = req.body;
    if (!title || !author || !isbn || !quantity) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // if (!/^\d{10}|\d{13}$/.test(isbn)) {
    //     return res.status(400).json({ message: 'Invalid ISBN format (must be 10 or 13 digits).' });
    // }
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be positive.' });
    }
    try {
        const id = req.params.id;
        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        const existingBook = await bookModel.findOne({ isbn, _id: { $ne: id } });
        if (existingBook) {
            return res.status(400).json({ message: 'ISBN already in use by another book.' });
        }
        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.quantity = quantity;
        book.available = quantity; 
        await book.save();
        return res.status(200).json({ message: 'Book updated successfully.', book });
    } catch (error) {
        console.error('BookUpdate Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


export async function deleteBook(req, res) {
    try {
        const id = req.params.id;
        const book = await bookModel.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        await book.deleteOne();
        return res.status(200).json({ message: 'Book deleted successfully.' });
    } catch (error) {
        console.error('DeleteBook Error:', error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}