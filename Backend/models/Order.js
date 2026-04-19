const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    paymentId: { type: String, default: "" },
    orderStatus: { type: String, enum: ["placed", "shipped", "delivered"], default: "placed" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
