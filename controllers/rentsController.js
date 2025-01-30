const Rent = require('../models/Rent');
const Book = require('../models/Book');
const User = require('../models/Users');
 
const checkAuthorization = (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (authorization !== 'HeSaidSheSaidBu11$!t') {
    return res.status(403).json({ message: 'Forbidden: Invalid authorization header' });
  }
  next();
};
 
/**
* Rent Builder - Encapsulates Rent Creation Logic
*/
class RentBuilder {
  constructor(user_id) {
    this.user_id = user_id;
    this.books = [];
  }
 
  async addBook(book_id, amountRented) {
    const book = await Book.findById(book_id);
    if (!book || book.amountAvailable < amountRented) {
      throw new Error(`Not enough copies available for book ${book_id}.`);
    }
 
    // Update book availability
    book.amountAvailable -= amountRented;
    book.amountRented += amountRented;
    await book.save();
 
    this.books.push({ id_Book: book_id, amount_rented: amountRented });
    return this;
  }
 
  async build() {
    return new Rent({ user_id: this.user_id, books: this.books });
  }
}
 
/**
* Create Rent API - Uses RentBuilder for better organization
*/
exports.createRent = async (req, res) => {
  const { user_id, books } = req.body;
 
  try {
    const user = await User.findById(user_id);
    if (user.multa > 0) {
      return res.status(400).json({ message: "User has pending multa. Cannot create rent." });
    }
 
    const rentBuilder = new RentBuilder(user_id);
    for (const { book_id, amountRented } of books) {
      await rentBuilder.addBook(book_id, amountRented);
    }
 
    const newRent = await rentBuilder.build();
    await newRent.save();
 
    res.status(201).json({ rent: newRent });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
 
/**
* Update Rent API - Restores book availability when rent is returned
*/
exports.updateRent = [checkAuthorization, async (req, res) => {
  try {
    const rent = await Rent.findOne({ rent_id: req.params.rent_id });
    if (!rent) return res.status(404).json({ message: "Rent not found" });
 
    rent.return_date = new Date();
 
    if (rent.return_date > rent.max_end_date) {
      rent.late = true;
      const user = await User.findById(rent.user_id);
      user.multa = (user.multa || 0) + 20;
      await user.save();
    }
 
    for (const { id_Book, amount_rented } of rent.books) {
      await Book.findByIdAndUpdate(
        id_Book,
        { $inc: { amountAvailable: amount_rented, amountRented: -amount_rented } },
        { new: true }
      );
    }
 
    await rent.save();
    res.json(rent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}];
 
/**
* Fetch All Rents API
*/
exports.getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find().populate('books.id_Book');
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
/**
* Fetch Rents by User API
*/
exports.getRentsByUserId = async (req, res) => {
  try {
    const rents = await Rent.find({ user_id: req.params.user_id }).populate('books.id_Book');
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
/**
* Fetch Rents by Book API
*/
exports.getRentsByBookId = async (req, res) => {
  try {
    const rents = await Rent.find({ "books.id_Book": req.params.book_id });
 
    if (!rents.length) {
      return res.status(404).json({ message: "No rents found for the given book ID." });
    }
 
    let totalAmountRented = 0;
    rents.forEach(rent => {
      const book = rent.books.find(book => book.id_Book === req.params.book_id);
      if (book) {
        totalAmountRented += book.amount_rented;
      }
    });
 
    res.json({ book_id: req.params.book_id, totalAmountRented });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
/**
* Fetch Most Rented Genres API
*/
exports.getMostRentedGenresAllTime = async (req, res) => {
  try {
    const rents = await Rent.find();
    const genreCounts = {};
 
    for (const rent of rents) {
      for (const { id_Book, amount_rented } of rent.books) {
        const book = await Book.findById(id_Book);
        if (book) {
          genreCounts[book.genre] = (genreCounts[book.genre] || 0) + amount_rented;
        }
      }
    }
 
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
/**
* Fetch Most Rented Genres By Period API
*/
exports.getMostRentedGenresByPeriod = async (req, res) => {
  const { startDate, endDate } = req.body;
 
  try {
    const rents = await Rent.find({
      start_date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    }).populate('books.id_Book');
 
    const genreCounts = {};
    rents.forEach(rent => {
      rent.books.forEach(book => {
        const bookDetails = book.id_Book;
        genreCounts[bookDetails.genre] = (genreCounts[bookDetails.genre] || 0) + book.amount_rented;
      });
    });
 
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
/**
* Fetch Most Common Genres by User API
*/
exports.getMostCommonGenresByUserId = async (req, res) => {
  const userId = req.params.user_id;
 
  try {
    const rents = await Rent.find({ user_id: userId }).populate('books.id_Book');
 
    const genreCounts = {};
    rents.forEach(rent => {
      rent.books.forEach(book => {
        const bookDetails = book.id_Book;
        genreCounts[bookDetails.genre] = (genreCounts[bookDetails.genre] || 0) + book.amount_rented;
      });
    });
 
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};