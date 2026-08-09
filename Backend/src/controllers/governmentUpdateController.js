const GovernmentUpdate = require("../models/GovernmentUpdate");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// ==========================================================
// Internal helper — notifies every citizen AND worker when
// an update goes live (used on create + on status toggle to Published)
// ==========================================================
const notifyUsersOfUpdate = async (update) => {
    try {

        const recipients = await User.find({
            role: { $in: ["citizen", "worker"] }
        }).select("_id");

        await Promise.all(
            recipients.map((recipient) =>
                createNotification({
                    user: recipient._id,
                    title: `New Update: ${update.category}`,
                    message: update.title,
                    type: "GovernmentUpdate"
                })
            )
        );

    } catch (error) {

        // Never let a notification failure break the main flow
        console.error("Notify Users Of Update Error:", error.message);

    }
};

// ==========================================================
// @desc    Create a new Government Update (Admin only)
// @route   POST /api/government-updates
// @access  Private (admin)
// ==========================================================
const createGovernmentUpdate = async (req, res) => {
    try {

        const { title, description, category, status, eventDate } = req.body;

        // Basic validation
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description and category are required."
            });
        }

        // If an image was uploaded via multer, build its path
        let imagePath = "";
        if (req.file) {
            imagePath = `src/uploads/${req.file.filename}`;
        }

        const newUpdate = await GovernmentUpdate.create({
            title,
            description,
            category,
            image: imagePath,
            status: status || "Published",
            eventDate: eventDate || null,
            createdBy: req.user._id
        });

        // Notify all citizens + workers only if the update goes live immediately
        if (newUpdate.status === "Published") {
            await notifyUsersOfUpdate(newUpdate);
        }

        return res.status(201).json({
            success: true,
            message: "Government update created successfully.",
            data: newUpdate
        });

    } catch (error) {

        console.error("Create Government Update Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while creating government update."
        });

    }
};

// ==========================================================
// @desc    Get all Government Updates (with filters + pagination)
// @route   GET /api/government-updates
// @access  Public
// ==========================================================
const getAllGovernmentUpdates = async (req, res) => {
    try {

        const {
            category,
            status,
            page = 1,
            limit = 10,
            search
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        // Citizens/workers should only see Published updates by default.
        // Only admins can explicitly request Draft updates.
        if (status) {
            if (status === "Draft" && req.user?.role !== "admin") {
                filter.status = "Published";
            } else {
                filter.status = status;
            }
        } else if (req.user?.role !== "admin") {
            filter.status = "Published";
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [updates, total] = await Promise.all([
            GovernmentUpdate.find(filter)
                .populate("createdBy", "fullName email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            GovernmentUpdate.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: updates.length,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: updates
        });

    } catch (error) {

        console.error("Get All Government Updates Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching government updates."
        });

    }
};

// ==========================================================
// @desc    Get a single Government Update by ID
// @route   GET /api/government-updates/:id
// @access  Public
// ==========================================================
const getGovernmentUpdateById = async (req, res) => {
    try {

        const update = await GovernmentUpdate.findById(req.params.id)
            .populate("createdBy", "fullName email role");

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Government update not found."
            });
        }

        // Hide drafts from non-admin users
        if (update.status === "Draft" && req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        return res.status(200).json({
            success: true,
            data: update
        });

    } catch (error) {

        console.error("Get Government Update By Id Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching government update."
        });

    }
};

// ==========================================================
// @desc    Update a Government Update (Admin only)
// @route   PUT /api/government-updates/:id
// @access  Private (admin)
// ==========================================================
const updateGovernmentUpdate = async (req, res) => {
    try {

        const update = await GovernmentUpdate.findById(req.params.id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Government update not found."
            });
        }

        const { title, description, category, status, eventDate } = req.body;

        const wasPublished = update.status === "Published";

        if (title) update.title = title;
        if (description) update.description = description;
        if (category) update.category = category;
        if (status) update.status = status;
        if (eventDate) update.eventDate = eventDate;

        // Replace image if a new one is uploaded
        if (req.file) {
            update.image = `src/uploads/${req.file.filename}`;
        }

        const updatedDoc = await update.save();

        // Notify citizens + workers only the moment a Draft first goes Published
        if (!wasPublished && updatedDoc.status === "Published") {
            await notifyUsersOfUpdate(updatedDoc);
        }

        return res.status(200).json({
            success: true,
            message: "Government update updated successfully.",
            data: updatedDoc
        });

    } catch (error) {

        console.error("Update Government Update Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while updating government update."
        });

    }
};

// ==========================================================
// @desc    Delete a Government Update (Admin only)
// @route   DELETE /api/government-updates/:id
// @access  Private (admin)
// ==========================================================
const deleteGovernmentUpdate = async (req, res) => {
    try {

        const update = await GovernmentUpdate.findById(req.params.id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Government update not found."
            });
        }

        await update.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Government update deleted successfully."
        });

    } catch (error) {

        console.error("Delete Government Update Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting government update."
        });

    }
};

// ==========================================================
// @desc    Toggle status between Draft / Published (Admin only)
// @route   PATCH /api/government-updates/:id/status
// @access  Private (admin)
// ==========================================================
const toggleGovernmentUpdateStatus = async (req, res) => {
    try {

        const update = await GovernmentUpdate.findById(req.params.id);

        if (!update) {
            return res.status(404).json({
                success: false,
                message: "Government update not found."
            });
        }

        update.status = update.status === "Published" ? "Draft" : "Published";

        await update.save();

        // Notify citizens + workers only when it flips TO Published
        if (update.status === "Published") {
            await notifyUsersOfUpdate(update);
        }

        return res.status(200).json({
            success: true,
            message: `Government update status changed to ${update.status}.`,
            data: update
        });

    } catch (error) {

        console.error("Toggle Government Update Status Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while toggling government update status."
        });

    }
};

module.exports = {
    createGovernmentUpdate,
    getAllGovernmentUpdates,
    getGovernmentUpdateById,
    updateGovernmentUpdate,
    deleteGovernmentUpdate,
    toggleGovernmentUpdateStatus
};