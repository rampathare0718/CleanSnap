const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { createNotification } = require("./notificationController");
const sendEmail = require("../utils/sendEmail");

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
                code: "VALIDATION_ERROR",
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
                code: "EMAIL_TAKEN",
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
                code: "MOBILE_TAKEN",
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
            code: "SERVER_ERROR",
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
                code: "VALIDATION_ERROR",
                message: "Email and Password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                code: "USER_NOT_FOUND",
                message: "No account found with this email."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                code: "WRONG_PASSWORD",
                message: "You have entered wrong password."
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
            code: "SERVER_ERROR",
            message: error.message
        });

    }
};

// =========================
// Forgot Password - Send Reset Link
// =========================
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                code: "VALIDATION_ERROR",
                message: "Email is required."
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If that email is registered, a reset link has been sent."
            });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetLink = `${frontendUrl}/reset-password/${rawToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: "CleanSnap - Reset Your Password",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                        <h2 style="color: #16a34a;">Reset Your Password</h2>
                        <p>Hi ${user.fullName},</p>
                        <p>We received a request to reset your CleanSnap password. Click the button below to set a new password. This link is valid for 15 minutes.</p>
                        <div style="text-align: center; margin: 28px 0;">
                            <a href="${resetLink}" style="background: #16a34a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="font-size: 12px; color: #16a34a; word-break: break-all;">${resetLink}</p>
                        <p>If you did not request this, you can safely ignore this email — your password will remain unchanged.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Failed to send reset email:", emailError);
            return res.status(500).json({
                success: false,
                code: "EMAIL_SEND_FAILED",
                message: "Could not send reset email. Please try again later."
            });
        }

        return res.status(200).json({
            success: true,
            message: "If that email is registered, a reset link has been sent."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: error.message
        });
    }
};

// =========================
// Reset Password - Verify Token + Set New Password
// =========================
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                code: "VALIDATION_ERROR",
                message: "Reset token is missing."
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                code: "VALIDATION_ERROR",
                message: "New password is required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                code: "VALIDATION_ERROR",
                message: "Password must be at least 6 characters long."
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() }
        }).select("+resetPasswordToken +resetPasswordExpiry");

        if (!user) {
            return res.status(400).json({
                success: false,
                code: "RESET_TOKEN_INVALID",
                message: "This reset link is invalid or has expired. Please request a new one."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful. You can now log in with your new password."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            code: "SERVER_ERROR",
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword
};