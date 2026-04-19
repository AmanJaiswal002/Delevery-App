const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// GET /api/admin/users — Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/admin/block-user/:id — Toggle isBlocked
const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).json({
            message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
            isBlocked: user.isBlocked,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/admin/product/:id — Delete any product
const adminDeleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/admin/analytics — General analytics
const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find({ paymentStatus: "paid" });
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

        res.status(200).json({ totalUsers, totalOrders, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, toggleBlockUser, adminDeleteProduct, getAnalytics };
