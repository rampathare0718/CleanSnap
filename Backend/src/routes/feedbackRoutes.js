const express = require("express");
const router = express.Router();

const {
    createFeedback,
    getFeedbackByComplaint,
    getMyFeedback,
    getAllFeedback,
    deleteFeedback,
} = require("../controllers/feedbackController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Citizen routes
router.post("/:complaintId", protect, authorize("citizen"), createFeedback);
router.get("/my-feedback", protect, authorize("citizen"), getMyFeedback);
router.delete("/:id", protect, authorize("citizen"), deleteFeedback);

// Shared route (owner or admin) — role check handled inside controller
router.get("/:complaintId", protect, getFeedbackByComplaint);

// Admin route
router.get("/", protect, authorize("admin"), getAllFeedback);

module.exports = router;