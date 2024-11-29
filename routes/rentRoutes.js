const express = require('express');
const router = express.Router();
const rentsController = require('../controllers/rentsController');

// Routes for Rent
router.post('/rents', rentsController.createRent); // Create a new rent
router.get('/rents', rentsController.getAllRents); // Get all rents
router.get('/rents/user/:user_id', rentsController.getRentsByUserId); // Get all rents by user ID
router.get('/rents/book/:book_id', rentsController.getRentsByBookId); // Get all rents by book ID
router.put('/rents/:rent_id', rentsController.updateRent); // Update a rent
router.get('/rents/genres/most-rented', rentsController.getMostRentedGenresAllTime); // Most rented genres all time
router.get('/rents/genres/most-rented/time', rentsController.getMostRentedGenresByPeriod); // Most rented genres in a time period
router.get('/rents/genres/user/:user_id', rentsController.getMostCommonGenresByUserId); // Most common genres rented by user
router.get('/rents/top-books', rentsController.getTopRentedBooksAllTime); // Top rented books of all time
router.get('/rents/top-books/month', rentsController.getTopRentedBooksLastMonth); // Top rented books of the last month

module.exports = router;