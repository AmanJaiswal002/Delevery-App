const Cart = require("../models/Cart");
const Product = require("../models/Product");

// POST /api/cart/add
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ message: "productId and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [{ productId, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
        if (!cart) return res.status(200).json({ items: [] });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/cart/remove
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart };
