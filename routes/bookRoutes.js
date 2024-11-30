const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/createBook', bookController.createBook); // X
router.get('/', bookController.getAllBooks); // X
router.get('/:id', bookController.findBookById); // X
router.put('/update/:id', bookController.updateBook); // X
router.delete('/delete/:id', bookController.deleteBook); // X
router.get('/book/by-genres', bookController.getBooksByGenres); // Fetch books by genre list X

module.exports = router;
