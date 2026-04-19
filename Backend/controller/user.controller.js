const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "customer",
        });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isBlocked) return res.status(403).json({ message: "Your account has been blocked" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("Error logging in user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/auth/logout
const logoutUser = async (req, res) => {
    res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
