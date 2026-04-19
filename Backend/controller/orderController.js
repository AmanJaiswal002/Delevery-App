const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { getIO } = require("../socket/socket");

// POST /api/orders — Place order
const placeOrder = async (req, res) => {
    try {
        const { deliveryAddress } = req.body;
        if (!deliveryAddress) return res.status(400).json({ message: "Delivery address is required" });

        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let totalAmount = 0;
        const orderItems = cart.items.map((item) => {
            const price = item.productId.price;
            totalAmount += price * item.quantity;
            return { productId: item.productId._id, quantity: item.quantity, price };
        });

        const order = new Order({
            userId: req.user._id,
            items: orderItems,
            totalAmount,
            deliveryAddress,
        });
        await order.save();

        // Clear cart after order placed
        cart.items = [];
        await cart.save();

        // Emit socket event
        try {
            getIO().emit("orderPlaced", { orderId: order._id, userId: req.user._id });
        } catch (e) {}

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/user — Customer's own orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).populate("items.productId").sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/seller — Orders with seller's products
const getSellerOrders = async (req, res) => {
    try {
        const sellerProducts = await Product.find({ sellerId: req.user._id }).select("_id");
        const sellerProductIds = sellerProducts.map((p) => p._id);

        const orders = await Order.find({ "items.productId": { $in: sellerProductIds } })
            .populate("items.productId")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/orders/admin — All orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("items.productId")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/orders/:id/status — Update order status (seller)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["placed", "shipped", "delivered"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Emit socket event based on status to specific user
        try {
            const io = getIO();
            const payload = { orderId: order._id, status, message: `Your order has been ${status}!` };
            
            if (status === "shipped") io.to(order.userId.toString()).emit("orderUpdate", payload);
            if (status === "delivered") io.to(order.userId.toString()).emit("orderUpdate", payload);
        } catch (e) {
            console.error("Socket error:", e);
        }

        res.status(200).json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getUserOrders, getSellerOrders, getAllOrders, updateOrderStatus };
