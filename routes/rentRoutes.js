const express = require('express');
const router = express.Router();
const rentsController = require('../controllers/rentsController');
const rentDetailsController = require('../controllers/rentDetailController');

// Routes for Rent
router.post('/rents', rentsController.createRent); // Create a new rent
router.get('/rents', rentsController.getAllRents); // Get all rents
router.get('/rents/user/:userId', rentsController.getRentsByUserId); // Get all rents by user ID
router.get('/rents/book/:bookId', rentsController.getRentsByBookId); // Get all rents by book ID
router.put('/rents/:rentId', rentsController.updateRent); // Update a rent
router.get('/rents/genres/most-rented', rentsController.getMostRentedGenresAllTime); // Most rented genres all time
router.get('/rents/genres/most-rented/time', rentsController.getMostRentedGenresByPeriod); // Most rented genres in a time period
router.get('/rents/genres/user/:userId', rentsController.getRentsByUserId); // Most common genres rented by user
// routes/rent.js
router.get('/rents/top-books', rentsController.getTopRentedBooksAllTime); // Top rented books of all time
router.get('/rents/top-books/month', rentsController.getTopRentedBooksLastMonth); // Top rented books of the last month

// Routes for RentDetails (if any additional routes are needed)
router.get('/rent-details/:rentId', rentDetailsController.getRentDetailsByRentId); // Get rent details by rent ID

module.exports = router;