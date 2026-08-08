const User = require("../models/User");

// ==========================================================
// @desc    Get all users, optionally filtered by role
//          Used by Admin to list workers for assignment,
//          or list citizens/workers for management screens.
// @route   GET /api/users?role=worker
// @access  Private (admin)
// ==========================================================
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};

// ==========================================================
// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (admin)
// ==========================================================
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user.",
    });
  }
};

// ==========================================================
// @desc    Admin creates a worker account directly
// @route   POST /api/users/worker
// @access  Private (admin)
// ==========================================================
const createWorker = async (req, res) => {
  try {
    const bcrypt = require("bcrypt");

    const {
      fullName,
      email,
      password,
      mobileNumber,
      age,
      gender,
      address,
    } = req.body;

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
        message: "Please fill all required fields.",
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const existingMobile = await User.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile Number already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobileNumber,
      age,
      gender,
      address,
      role: "worker",
    });

    const workerObj = worker.toObject();
    delete workerObj.password;

    return res.status(201).json({
      success: true,
      message: "Worker created successfully.",
      user: workerObj,
    });
  } catch (error) {
    console.error("Create Worker Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating worker.",
    });
  }
};

// ==========================================================
// @desc    Admin deletes a user (worker or citizen)
// @route   DELETE /api/users/:id
// @access  Private (admin)
// ==========================================================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be deleted here.",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user.",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createWorker,
  deleteUser,
};