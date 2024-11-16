const Rent = require('../models/Rent');
const Book = require('../models/Book');
const User = require('../models/Users');
const RentDetail = require('../models/rentDetail');

exports.createRent = async (req, res) => {
  const { user_id, books } = req.body;

  try {
    const user = await User.findById(user_id);

    // Check for "multa" condition
    if (user.multa && user.multa > 0) {
      return res.status(400).json({ message: "User has pending multa. Cannot create rent." });
    }

    // Check book availability and create rent details
    const rentDetails = [];
    const newRent = new Rent({ user_id });
    await newRent.save();

    for (const { book_id, amountRented } of books) {
      const book = await Book.findById(book_id);

      if (!book || book.amountAvailable < amountRented) {
        return res.status(400).json({ message: `Not enough copies available for book ${book_id}.` });
      }

      book.amountAvailable -= amountRented;
      book.amountRented += amountRented;
      await book.save();

      const newRentDetail = new RentDetail({
        Id_rent: newRent._id,
        Id_Book: book_id,
        Amount_rented: amountRented
      });
      await newRentDetail.save();
      rentDetails.push(newRentDetail);
    }

    res.status(201).json({ rent: newRent, rentDetails });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Update Rent - returns and checks for late returns
exports.updateRent = async (req, res) => {
  try {
    const rent = await Rent.findById(req.params.rent_id);
    if (!rent) return res.status(404).json({ message: "Rent not found" });

    // Update return_date and check for lateness
    rent.return_date = new Date();
    if (rent.return_date > rent.max_end_date) {
      rent.late = true;

      // Update user's "multa"
      const user = await User.findById(rent.user_id);
      user.multa = (user.multa || 0) + 20;
      await user.save();
    }

    await rent.save();
    res.json(rent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Rents
exports.getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find();
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Rents by User ID
exports.getRentsByUserId = async (req, res) => {
  try {
    const rents = await Rent.find({ user_id: req.params.user_id });
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Rents by Book ID
exports.getRentsByBookId = async (req, res) => {
  try {
    const rents = await Rent.find({ "details.Id_Book": req.params.book_id });
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Most Rented Genres of All Time
exports.getMostRentedGenresAllTime = async (req, res) => {
  try {
    const allBooks = await Book.find();
    const genreCounts = {};

    for (const book of allBooks) {
      if (!genreCounts[book.genre]) {
        genreCounts[book.genre] = 0;
      }
      genreCounts[book.genre] += book.amountRented;
    }

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Most Rented Genres by Time Period
exports.getMostRentedGenresByPeriod = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const rents = await Rent.find({ start_date: { $gte: new Date(startDate), $lte: new Date(endDate) } }).populate('books.book_id');

    const genreCounts = {};
    rents.forEach(rent => {
      rent.books.forEach(book => {
        if (!genreCounts[book.genre]) {
          genreCounts[book.genre] = 0;
        }
        genreCounts[book.genre] += book.amountRented;
      });
    });

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Most Common Rented Genres by User ID
exports.getMostCommonGenresByUserId = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const rents = await Rent.find({ user_id: userId }).populate('books.book_id');

    const genreCounts = {};
    rents.forEach(rent => {
      rent.books.forEach(book => {
        if (!genreCounts[book.genre]) {
          genreCounts[book.genre] = 0;
        }
        genreCounts[book.genre] += book.amountRented;
      });
    });

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};