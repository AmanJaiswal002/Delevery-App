const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controller/user.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
