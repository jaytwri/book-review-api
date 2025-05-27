const express = require('express');
const router = express.Router();
const { createBook, getAllBooks, getBookById, searchBooks} = require('../controllers/bookController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createBook);
router.get('/search', searchBooks);
router.get('/', getAllBooks);
router.get('/:id', getBookById);


module.exports = router;
