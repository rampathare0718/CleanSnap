const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    getUserById,
    createWorker,
    deleteUser
} = require("../controllers/userController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

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