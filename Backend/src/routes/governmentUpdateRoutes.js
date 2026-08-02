const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    createGovernmentUpdate,
    getAllGovernmentUpdates,
    getGovernmentUpdateById,
    updateGovernmentUpdate,
    deleteGovernmentUpdate,
    toggleGovernmentUpdateStatus
} = require("../controllers/governmentUpdateController");

// ==========================================================
// Public Routes
// ==========================================================

// @desc    Get all government updates (with filters + pagination)
// @route   GET /api/government-updates
router.get("/", getAllGovernmentUpdates);

// @desc    Get a single government update by ID
// @route   GET /api/government-updates/:id
router.get("/:id", getGovernmentUpdateById);

// ==========================================================
// Protected Routes (Admin only)
// ==========================================================

// @desc    Create a new government update
// @route   POST /api/government-updates
router.post(
    "/",
    protect,
    authorize("admin"),
    upload.single("image"),
    createGovernmentUpdate
);

// @desc    Update an existing government update
// @route   PUT /api/government-updates/:id
router.put(
    "/:id",
    protect,
    authorize("admin"),
    upload.single("image"),
    updateGovernmentUpdate
);

// @desc    Toggle status between Draft / Published
// @route   PATCH /api/government-updates/:id/status
router.patch(
    "/:id/status",
    protect,
    authorize("admin"),
    toggleGovernmentUpdateStatus
);

// @desc    Delete a government update
// @route   DELETE /api/government-updates/:id
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteGovernmentUpdate
);

module.exports = router;