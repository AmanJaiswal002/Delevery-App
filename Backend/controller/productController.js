const Product = require("../models/Product");

// GET /api/products — Fetch all (with optional search & filter)
const getAllProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter).populate("sellerId", "name email");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/products/:id — Fetch single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("sellerId", "name email");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/products — Create product (seller only)
const createProduct = async (req, res) => {
    try {
        const { title, description, price, image, category, stock } = req.body;
        if (!title || !description || !price || !image || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const product = new Product({
            title,
            description,
            price,
            image,
            category,
            stock: stock || 0,
            sellerId: req.user._id,
        });
        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/products/:id — Update product (seller only, own product)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.sellerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Product updated successfully", product: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/products/:id — Delete product (seller own or admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const isSeller = product.sellerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isSeller && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
