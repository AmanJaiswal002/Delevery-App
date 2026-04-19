const Review = require("../models/Review");
const Product = require("../models/Product");

// POST /api/reviews — Add review
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        if (!productId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const review = new Review({
            userId: req.user._id,
            productId,
            rating,
            comment,
        });
        await review.save();

        // Recalculate average rating on the product
        const reviews = await Review.find({ productId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/reviews/:productId — Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addReview, getProductReviews };
