const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaints");

// ==============================
// @desc    Create feedback for a completed complaint
// @route   POST /api/feedback/:complaintId
// @access  Private (citizen)
// ==============================
const createFeedback = async (req, res) => {
    try {

        const { complaintId } = req.params;
        const { rating, comment } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating is required and must be between 1 and 5."
            });
        }

        // Find complaint
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found."
            });
        }

        // Only the citizen who reported it can give feedback
        if (complaint.reportedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to give feedback on this complaint."
            });
        }

        // Feedback only allowed once complaint is completed
        if (complaint.status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be given once the complaint is marked as Completed."
            });
        }

        // Create feedback
        const feedback = await Feedback.create({
            user: req.user._id,
            complaint: complaint._id,
            rating,
            comment,
        });

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully.",
            feedback,
        });

    } catch (error) {

        // Handle duplicate feedback (unique complaint field)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Feedback has already been submitted for this complaint."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong while submitting feedback.",
            error: error.message,
        });

    }
};

// ==============================
// @desc    Get feedback for a specific complaint
// @route   GET /api/feedback/:complaintId
// @access  Private (citizen who owns it / admin)
// ==============================
const getFeedbackByComplaint = async (req, res) => {
    try {

        const { complaintId } = req.params;

        const feedback = await Feedback.findOne({ complaint: complaintId })
            .populate("user", "fullName email")
            .populate("complaint", "title status");

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "No feedback found for this complaint."
            });
        }

        // Only owner or admin can view
        if (
            req.user.role !== "admin" &&
            feedback.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        return res.status(200).json({
            success: true,
            feedback,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching feedback.",
            error: error.message,
        });

    }
};

// ==============================
// @desc    Get all feedback given by logged-in user
// @route   GET /api/feedback/my-feedback
// @access  Private (citizen)
// ==============================
const getMyFeedback = async (req, res) => {
    try {

        const feedbackList = await Feedback.find({ user: req.user._id })
            .populate("complaint", "title status beforeImage afterImage")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: feedbackList.length,
            feedback: feedbackList,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching your feedback.",
            error: error.message,
        });

    }
};

// ==============================
// @desc    Get all feedback (admin monitoring)
// @route   GET /api/feedback
// @access  Private (admin)
// ==============================
const getAllFeedback = async (req, res) => {
    try {

        const feedbackList = await Feedback.find()
            .populate("user", "fullName email")
            .populate("complaint", "title status assignedWorker")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: feedbackList.length,
            feedback: feedbackList,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching feedback.",
            error: error.message,
        });

    }
};

// ==============================
// @desc    Delete feedback (owner only)
// @route   DELETE /api/feedback/:id
// @access  Private (citizen)
// ==============================
const deleteFeedback = async (req, res) => {
    try {

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found."
            });
        }

        if (feedback.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this feedback."
            });
        }

        await feedback.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Feedback deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting feedback.",
            error: error.message,
        });

    }
};

module.exports = {
    createFeedback,
    getFeedbackByComplaint,
    getMyFeedback,
    getAllFeedback,
    deleteFeedback,
};