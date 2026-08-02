const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications
} = require("../controllers/notificationController");

// ==========================================================
// All notification routes are private —
// a user can only ever access their own notifications.
// ==========================================================

// @desc    Get logged-in user's notifications (pagination + unread filter)
// @route   GET /api/notifications
router.get("/", protect, getMyNotifications);

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
router.patch("/:id/read", protect, markAsRead);

// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
router.delete("/:id", protect, deleteNotification);

// @desc    Delete all notifications for the logged-in user
// @route   DELETE /api/notifications
router.delete("/", protect, deleteAllNotifications);

module.exports = router;