const Book = require('../models/Book');

// Create Book
exports.createBook = async (req, res) => {
  const { name, editorial, edition, status, author, genre, pages, amountAvailable, amountTotal, synopsis, bookImage } = req.body;
  
  try {
    const newBook = new Book({
      name,
      editorial,
      edition,
      status,
      author,
      genre,
      pages,
      amountAvailable,
      amountTotal,
      amountRented: 0,
      synopsis,
      bookImage: bookImage || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
    });
    
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Read Book by ID
exports.findBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Books
exports.getAllBooks = async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // controllers/booksController.js
exports.getBooksByGenres = async (req, res) => {
  const genres = req.query.genres.split(',');
  try {
    const books = await Book.find({ genre: { $in: genres } });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
