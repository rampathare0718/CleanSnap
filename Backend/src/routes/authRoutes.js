const express = require("express");

const {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Forgot Password - sends a reset link (with token) to the registered email
router.post("/forgot-password", forgotPassword);

// Reset Password - verifies the token from the link and sets a new password
router.post("/reset-password/:token", resetPassword);

module.exports = router;