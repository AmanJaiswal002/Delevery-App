const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controller/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/reloMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/upload", authMiddleware, roleMiddleware("seller"), upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imageUrl = `http://127.0.0.1:5005/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});
router.post("/", authMiddleware, roleMiddleware("seller"), createProduct);
router.put("/:id", authMiddleware, roleMiddleware("seller"), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("seller", "admin"), deleteProduct);

module.exports = router;
