const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const bookId = req.params.id;
    const userId = req.user._id;

    // Check if review already exists for this user-book combo
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      comment,
      rating,
      book: bookId,
      user: userId
    });

    // Add review to book
    const book = await Book.findById(bookId);
    book.reviews.push(review._id);

    // Update average rating
    const allReviews = await Review.find({ book: bookId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    book.averageRating = avgRating;

    await book.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    await review.save();

    // Update book's average rating
    const allReviews = await Review.find({ book: review.book });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    const book = await Book.findById(review.book);
    book.averageRating = avgRating;
    await book.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update review', error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(id);

    // Remove from book's review list
    const book = await Book.findById(review.book);
    book.reviews = book.reviews.filter(rid => rid.toString() !== id);
    
    // Update average rating
    const allReviews = await Review.find({ book: review.book });
    const avgRating = allReviews.length
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;

    book.averageRating = avgRating;
    await book.save();

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};
