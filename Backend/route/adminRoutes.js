const express = require("express");
const router = express.Router();
const { getAllUsers, toggleBlockUser, adminDeleteProduct, getAnalytics } = require("../controller/adminCntroller");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/reloMiddleware");

router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.put("/block-user/:id", authMiddleware, roleMiddleware("admin"), toggleBlockUser);
router.delete("/product/:id", authMiddleware, roleMiddleware("admin"), adminDeleteProduct);
router.get("/analytics", authMiddleware, roleMiddleware("admin"), getAnalytics);

module.exports = router;
