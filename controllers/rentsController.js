const Rent = require('../models/Rent');
const Book = require('../models/Book');
const User = require('../models/Users');

exports.createRent = async (req, res) => {
  const { user_id, books } = req.body;

  try {
    const user = await User.findById(user_id);

    // Check for "multa" condition
    if (user.multa > 0) {
      return res.status(400).json({ message: "User has pending multa. Cannot create rent." });
    }
    const newBooks = [];
    for (const { book_id, amountRented } of books) {
      const book = await Book.findById(book_id);

      if (!book || book.amountAvailable < amountRented) {
        return res.status(400).json({ message: `Not enough copies available for book ${book_id}.` });
      }
      book.amountAvailable -= amountRented;
      book.amountRented += amountRented;
      await book.save();
      let id_Book = book_id
      let amount_rented = amountRented
      newBooks.push({ id_Book, amount_rented });
    }
    const newRent = new Rent({ user_id, books: newBooks });
    await newRent.save();

    res.status(201).json({ rent: newRent });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

exports.updateRent = async (req, res) => {
  try {
    const rent = await Rent.findOne({rent_id: req.params.rent_id});
    if (!rent) return res.status(404).json({ message: "Rent not found" });
    // Update return_date and check for lateness
    rent.return_date = new Date();
    if (rent.return_date > rent.max_end_date) {
      rent.late = true;

      const user = await User.findById(rent.user_id);
      user.multa = (user.multa || 0) + 20;
      await user.save();
    }
    // Restore availability for each book in the rent
    for (const { id_Book, amount_rented  } of rent.books) {
      console.log(id_Book)
      await Book.findByIdAndUpdate(
        id_Book,
        {
          $inc: {
            amountAvailable: amount_rented , // Increment availability
            amountRented: -amount_rented ,  // Decrement rented count
          },
        },
        { new: true } // Return the updated document (optional for debugging/logging)
      );
    }

    await rent.save();
    res.json(rent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find().populate('books.id_Book');
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRentsByUserId = async (req, res) => {
  try {
    const rents = await Rent.find({user_id: req.params.user_id} ).populate('books.id_Book');
    res.json(rents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRentsByBookId = async (req, res) => {
  try {
    const rents = await Rent.find({ "books.id_Book": req.params.book_id });

    if (!rents.length) {
      return res.status(404).json({ message: "No rents found for the given book ID." });
    }

    // Calculate the total amount rented for the specific book
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

exports.getMostRentedGenresAllTime = async (req, res) => {
  try {
    const rents = await Rent.find(); // Get all rents
    const genreCounts = {};

    for (const rent of rents) {
      for (const { id_Book, amount_rented } of rent.books) {
        const book = await Book.findById(id_Book); // Find the book to get its genre
        if (book) {
          if (!genreCounts[book.genre]) {
            genreCounts[book.genre] = 0;
          }
          genreCounts[book.genre] += amount_rented; // Add the amount rented
        }
      }
    }

    // Sort genres by total rentals in descending order
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMostRentedGenresByPeriod = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    const rents = await Rent.find({ start_date: { $gte: new Date(startDate), $lte: new Date(endDate) } }).populate('books.id_Book');

    const genreCounts = {};
    rents.forEach(rent => {
      rent.books.forEach(book => {
        const bookDetails = book.id_Book; // Populated book details
        if (!genreCounts[bookDetails.genre]) {
          genreCounts[bookDetails.genre] = 0;
        }
        genreCounts[bookDetails.genre] += book.amount_rented;
      });
    });

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMostCommonGenresByUserId = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const rents = await Rent.find({ user_id: userId }).populate('books.id_Book');

    const genreCounts = {};
    rents.forEach(rent => {
      rent.books.forEach(book => {
        const bookDetails = book.id_Book; // Populated book details
        if (!genreCounts[bookDetails.genre]) {
          genreCounts[bookDetails.genre] = 0;
        }
        genreCounts[bookDetails.genre] += book.amount_rented;
      });
    });

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    res.json(sortedGenres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopRentedBooksAllTime = async (req, res) => {
  try {
    const books = await Book.find().sort({ amountRented: -1 }).limit(6);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopRentedBooksLastMonth = async (req, res) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  try {
    const recentRents = await Rent.find({ start_date: { $gte: oneMonthAgo } }).populate('books.id_Book');
    const bookCounts = {};

    recentRents.forEach(rent => {
      rent.books.forEach(book => {
        const bookId = book.id_Book.toString();
        if (!bookCounts[bookId]) {
          bookCounts[bookId] = { book: book.id_Book, count: 0 };
        }
        bookCounts[bookId].count += book.amount_rented;
      });
    });

    const topBooks = Object.values(bookCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(entry => entry.book);

    res.json(topBooks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
