const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createNotification } = require("./notificationController");

// =========================
// Register User
// =========================
const registerUser = async (req, res) => {
    try {

        console.log("===== REGISTER API HIT =====");
        console.log(req.body);

        const {
            fullName,
            email,
            password,
            mobileNumber,
            age,
            gender,
            address
        } = req.body;

        // Validation
        if (
            !fullName ||
            !email ||
            !password ||
            !mobileNumber ||
            !age ||
            !gender ||
            !address ||
            !address.city ||
            !address.state ||
            !address.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Check Email
        const existingEmail = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Check Mobile
        const existingMobile = await User.findOne({
            mobileNumber
        });

        if (existingMobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile Number already registered."
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Creating User...");

        const user = new User({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            mobileNumber,
            age,
            gender,
            address,
            role: "citizen"
        });

        console.log(user);

        await user.save();

        console.log("User Saved Successfully");

        // Welcome notification for the newly registered citizen
        await createNotification({
            user: user._id,
            title: "Welcome to CleanCity",
            message: `Hi ${user.fullName}, thanks for joining! Start reporting dirt/waste in your area to earn reward points.`,
            type: "System"
        });

        // Generate Token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user
        });

    } catch (error) {

        console.error("===========================");
        console.error(error);
        console.error("===========================");

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =========================
// Login User
// =========================
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials."
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    registerUser,
    loginUser
};