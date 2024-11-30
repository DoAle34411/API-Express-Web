const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/createBook', bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.findBookById);
router.put('/update/:id', bookController.updateBook);
router.delete('/delete/:id', bookController.deleteBook);
router.get('/book/by-genres', bookController.getBooksByGenres); // Fetch books by genre list

module.exports = router;
