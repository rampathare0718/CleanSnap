const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
    getMyRewards,
    getAllRewards,
    getUserRewardSummary,
    deleteReward,
    getLeaderboard,
    endRewardCycle
} = require("../controllers/rewardController");

// ==========================================================
// Citizen Routes
// ==========================================================

// @desc    Get logged-in citizen's reward history and total points
// @route   GET /api/rewards/my
// @access  Private (Citizen)
router.get(
    "/my",
    protect,
    authorize("citizen"),
    getMyRewards
);

// ==========================================================
// Admin Routes
// ==========================================================

// @desc    Get all rewards
// @route   GET /api/rewards
// @access  Private (Admin)
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllRewards
);

// @desc    Get reward summary of a specific user
// @route   GET /api/rewards/user/:id
// @access  Private (Admin)
router.get(
    "/user/:id",
    protect,
    authorize("admin"),
    getUserRewardSummary
);

// @desc    Reward Leaderboard
// @route   GET /api/rewards/leaderboard
// @access  Private (Admin)
router.get(
    "/leaderboard",
    protect,
    authorize("admin"),
    getLeaderboard
);

// @desc    End Reward Cycle
// @route   POST /api/rewards/end-cycle
// @access  Private (Admin)
router.post(
    "/end-cycle",
    protect,
    authorize("admin"),
    endRewardCycle
);

// @desc    Delete Reward
// @route   DELETE /api/rewards/:id
// @access  Private (Admin)
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteReward
);

module.exports = router;