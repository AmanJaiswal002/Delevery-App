const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
const createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in rupees
        if (!amount) return res.status(400).json({ message: "Amount is required" });

        const options = {
            amount: amount * 100, // Razorpay expects paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/payment/verify
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Update order payment status
        const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus: "paid", paymentId: razorpay_payment_id },
            { new: true }
        );

        res.status(200).json({ message: "Payment verified successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentOrder, verifyPayment };
