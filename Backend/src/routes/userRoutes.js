const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getUserById,
    createWorker,
    deleteUser,
    updateProfile
} = require("../controllers/userController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

// Update own profile (any logged-in role)
// PUT /api/users/profile
// NOTE: placed before "/:id" so "profile" is never swallowed as an :id param
router.put(
    "/profile",
    protect,
    updateProfile
);

// Get all users
// GET /api/users?role=worker
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllUsers
);

// Get single user
// GET /api/users/:id
router.get(
    "/:id",
    protect,
    authorize("admin"),
    getUserById
);

// Create worker
// POST /api/users/worker
router.post(
    "/worker",
    protect,
    authorize("admin"),
    createWorker
);

// Delete user
// DELETE /api/users/:id
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteUser
);

module.exports = router;