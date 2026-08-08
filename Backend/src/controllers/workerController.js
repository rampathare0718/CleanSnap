const User = require("../models/User");
const bcrypt = require("bcrypt");

// =========================
// Create Worker
// =========================
const createWorker = async (req, res) => {
    try {
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

        // Check email
        const existingEmail = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });
        }

        // Check mobile
        const existingMobile = await User.findOne({
            mobileNumber
        });

        if (existingMobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile Number already registered."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create worker
        const worker = new User({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            mobileNumber,
            age,
            gender,
            address,
            role: "worker"
        });

        await worker.save();

        return res.status(201).json({
            success: true,
            message: "Worker created successfully.",
            worker: {
                id: worker._id,
                fullName: worker.fullName,
                email: worker.email,
                mobileNumber: worker.mobileNumber,
                role: worker.role
            }
        });

    } catch (error) {
        console.error("Create Worker Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createWorker
};