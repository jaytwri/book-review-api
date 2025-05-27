const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;

    if (!title || !author || !genre) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const book = await Book.create({
      title,
      author,
      genre
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
};


exports.getAllBooks = async (req, res) => {
    try {
      const { page = 1, limit = 10, author, genre } = req.query;
  
      const filters = {};
      if (author) filters.author = new RegExp(author, 'i'); // case-insensitive
      if (genre) filters.genre = new RegExp(genre, 'i');
  
      const books = await Book.find(filters)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
  
      const total = await Book.countDocuments(filters);
  
      res.json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        data: books
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch books', error: err.message });
    }
  };

exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;

    const filters = {};
    if (author) filters.author = new RegExp(author, 'i'); // case-insensitive search
    if (genre) filters.genre = new RegExp(genre, 'i');

    const books = await Book.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(filters);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      data: books,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;

    // Find book without reviews
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Fetch reviews for this book with pagination
    const reviews = await Review.find({ book: id })
      .populate('user', 'name') // include user name only
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ book: id });

    res.status(200).json({
      _id: book._id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      averageRating: book.averageRating,
      totalReviews,
      page: parseInt(page),
      limit: parseInt(limit),
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book details', error: err.message });
  }
};

exports.searchBooks = async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }
  
      // Case-insensitive regex search
      const regex = new RegExp(q, 'i');
  
      const books = await Book.find({
        $or: [{ title: regex }, { author: regex }]
      });
  
      res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ message: 'Search failed', error: err.message });
    }
  };
  

  