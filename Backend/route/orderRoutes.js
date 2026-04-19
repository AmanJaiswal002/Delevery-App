const express = require("express");
const router = express.Router();
const { placeOrder, getUserOrders, getSellerOrders, getAllOrders, updateOrderStatus } = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/reloMiddleware");

router.post("/", authMiddleware, roleMiddleware("customer"), placeOrder);
router.get("/user", authMiddleware, roleMiddleware("customer"), getUserOrders);
router.get("/seller", authMiddleware, roleMiddleware("seller"), getSellerOrders);
router.get("/admin", authMiddleware, roleMiddleware("admin"), getAllOrders);
router.put("/:id/status", authMiddleware, roleMiddleware("seller"), updateOrderStatus);

module.exports = router;
