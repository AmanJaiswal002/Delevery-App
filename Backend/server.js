require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./configure/db");
const { initSocket } = require("./socket/socket");

// Routes
const path = require("path");
const authRoute = require("./route/authRoute");
const productRoutes = require("./route/productRoutes");
const cartRoutes = require("./route/cartRoutes");
const orderRoutes = require("./route/orderRoutes");
const paymentRoutes = require("./route/paymentRoutes");
const reviewRoutes = require("./route/reviewRoutes");
const adminRoutes = require("./route/adminRoutes");

const app = express();
const server = http.createServer(app);

// Init Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Multi-Vendor Delivery App API is running 🚀" }));

// Connect to DB and start server
const PORT = process.env.PORT || 5005;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
});
