const Notification = require("../models/Notification");


const createNotification = async ({ user, title, message, type, complaint = null }) => {
    try {

        if (!user || !title || !message || !type) {
            console.error("Create Notification Error: Missing required fields.");
            return null;
        }

        const notification = await Notification.create({
            user,
            title,
            message,
            type,
            complaint
        });

        return notification;

    } catch (error) {

        // Notifications should never break the parent request/flow,
        // so we just log the error instead of throwing it.
        console.error("Create Notification Error:", error.message);
        return null;

    }
};

// ==========================================================
// @desc    Get logged-in user's notifications (with pagination + unread filter)
// @route   GET /api/notifications
// @access  Private
// ==========================================================
const getMyNotifications = async (req, res) => {
    try {

        const { page = 1, limit = 10, isRead } = req.query;

        const filter = { user: req.user._id };

        if (isRead !== undefined) {
            filter.isRead = isRead === "true";
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .populate("complaint", "title status")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Notification.countDocuments(filter),
            Notification.countDocuments({ user: req.user._id, isRead: false })
        ]);

        return res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            unreadCount,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: notifications
        });

    } catch (error) {

        console.error("Get My Notifications Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching notifications."
        });

    }
};

// ==========================================================
// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
// ==========================================================
const markAsRead = async (req, res) => {
    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Only the owner can mark their own notification as read
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data: notification
        });

    } catch (error) {

        console.error("Mark As Read Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while updating notification."
        });

    }
};

// ==========================================================
// @desc    Delete a single notification
// @route   DELETE /api/notifications/:id
// @access  Private
// ==========================================================
const deleteNotification = async (req, res) => {
    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        // Only the owner can delete their own notification
        if (notification.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        await notification.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully."
        });

    } catch (error) {

        console.error("Delete Notification Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting notification."
        });

    }
};

// ==========================================================
// @desc    Delete all notifications for the logged-in user
// @route   DELETE /api/notifications
// @access  Private
// ==========================================================
const deleteAllNotifications = async (req, res) => {
    try {

        const result = await Notification.deleteMany({ user: req.user._id });

        return res.status(200).json({
            success: true,
            message: `${result.deletedCount} notification(s) deleted successfully.`
        });

    } catch (error) {

        console.error("Delete All Notifications Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting notifications."
        });

    }
};

module.exports = {
    createNotification,
    getMyNotifications,
    markAsRead,
    deleteNotification,
    deleteAllNotifications
};