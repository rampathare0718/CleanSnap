const Reward = require("../models/Rewards");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

// ==========================================================
// @desc    Award reward points (internal helper — NOT a route)
//          Called from other controllers whenever a user earns
//          points, e.g. completing a complaint or attending an event:
//          await createReward({
//              user: complaint.reportedBy,
//              points: 20,
//              reason: "Complaint resolved",
//              complaint: complaint._id
//          });
//
//          Rewards are ONLY for citizens — admins and workers are
//          never eligible, regardless of who calls this function.
// ==========================================================
const createReward = async ({ user, points, reason, complaint = null }) => {
    try {

        if (!user || !points || !reason) {
            console.error("Create Reward Error: Missing required fields.");
            return null;
        }

        const targetUser = await User.findById(user).select("role");

        if (!targetUser) {
            console.error("Create Reward Error: User not found.");
            return null;
        }

        // Only citizens can earn reward points
        if (targetUser.role !== "citizen") {
            console.error(
                `Create Reward Skipped: User role '${targetUser.role}' is not eligible for rewards.`
            );
            return null;
        }

        const reward = await Reward.create({
            user,
            complaint,
            points,
            reason
        });

        // Credit the points to the user's running total
        await User.findByIdAndUpdate(user, {
            $inc: { rewardPoints: points }
        });

        // Let the user know they earned points
        await createNotification({
            user,
            title: "Reward Points Earned",
            message: `You earned ${points} points for: ${reason}.`,
            type: "Reward",
            complaint
        });

        return reward;

    } catch (error) {

        // Never let a reward failure break the parent request/flow
        console.error("Create Reward Error:", error.message);
        return null;

    }
};

// ==========================================================
// @desc    Get logged-in user's reward history + total points
// @route   GET /api/rewards/my
// @access  Private (citizen)
// ==========================================================
const getMyRewards = async (req, res) => {
    try {

        const { page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const [rewards, total, user] = await Promise.all([
            Reward.find({ user: req.user._id })
                .populate("complaint", "title status")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Reward.countDocuments({ user: req.user._id }),
            User.findById(req.user._id).select("rewardPoints")
        ]);

        return res.status(200).json({
            success: true,
            totalPoints: user.rewardPoints,
            count: rewards.length,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: rewards
        });

    } catch (error) {

        console.error("Get My Rewards Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching your rewards."
        });

    }
};

// ==========================================================
// @desc    Get all rewards across all users (admin dashboard)
// @route   GET /api/rewards?userId=...
// @access  Private (admin)
// ==========================================================
const getAllRewards = async (req, res) => {
    try {

        const { userId, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (userId) {
            filter.user = userId;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [rewards, total] = await Promise.all([
            Reward.find(filter)
                .populate("user", "fullName email role")
                .populate("complaint", "title status")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Reward.countDocuments(filter)
        ]);

        return res.status(200).json({
            success: true,
            count: rewards.length,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            data: rewards
        });

    } catch (error) {

        console.error("Get All Rewards Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching rewards."
        });

    }
};

// ==========================================================
// @desc    Get a specific user's reward summary (admin)
// @route   GET /api/rewards/user/:id
// @access  Private (admin)
// ==========================================================
const getUserRewardSummary = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).select("fullName email role rewardPoints");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const rewards = await Reward.find({ user: req.params.id })
            .populate("complaint", "title status")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            user,
            count: rewards.length,
            data: rewards
        });

    } catch (error) {

        console.error("Get User Reward Summary Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching user's reward summary."
        });

    }
};

// ==========================================================
// @desc    Delete a reward entry (admin only — e.g. correcting a mistake)
//          Also reverses the points from the user's total
// @route   DELETE /api/rewards/:id
// @access  Private (admin)
// ==========================================================
const deleteReward = async (req, res) => {
    try {

        const reward = await Reward.findById(req.params.id);

        if (!reward) {
            return res.status(404).json({
                success: false,
                message: "Reward not found."
            });
        }

        // Reverse the points that were credited
        await User.findByIdAndUpdate(reward.user, {
            $inc: { rewardPoints: -reward.points }
        });

        await reward.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Reward deleted and points reversed successfully."
        });

    } catch (error) {

        console.error("Delete Reward Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting reward."
        });

    }
};

// ==========================================================
// @desc    Get the reward leaderboard/scoreboard (Admin only)
//          Ranks citizens by rewardPoints, highest first.
// @route   GET /api/rewards/leaderboard?limit=10
// @access  Private (admin)
// ==========================================================
const getLeaderboard = async (req, res) => {
    try {

        const { limit = 10 } = req.query;

        const leaderboard = await User.find({ role: "citizen" })
            .select("fullName email rewardPoints profileImage")
            .sort({ rewardPoints: -1 })
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            count: leaderboard.length,
            data: leaderboard
        });

    } catch (error) {

        console.error("Get Leaderboard Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching leaderboard."
        });

    }
};

// ==========================================================
// @desc    End the current reward cycle (Admin only):
//          1. Finds the citizen with the highest rewardPoints
//          2. Notifies them that they won the prize
//          3. Resets EVERY citizen's rewardPoints back to 0
//             so the next cycle starts fresh
// @route   POST /api/rewards/end-cycle
// @access  Private (admin)
// ==========================================================
const endRewardCycle = async (req, res) => {
    try {

        const topCitizen = await User.findOne({ role: "citizen", rewardPoints: { $gt: 0 } })
            .sort({ rewardPoints: -1 })
            .select("fullName email rewardPoints");

        if (!topCitizen) {
            return res.status(400).json({
                success: false,
                message: "No eligible citizen found to declare as winner. Cycle not reset."
            });
        }

        const winningPoints = topCitizen.rewardPoints;

        // Log the win as a zero-point reward entry, purely for history/audit
        await Reward.create({
            user: topCitizen._id,
            points: 0,
            reason: `Reward Cycle Winner — finished with ${winningPoints} points`
        });

        // Notify the winner
        await createNotification({
            user: topCitizen._id,
            title: "You Won the Reward Cycle!",
            message: `Congratulations! You finished this cycle with ${winningPoints} points and won the prize. A new cycle starts now.`,
            type: "Reward"
        });

        // Reset every citizen's points to 0 for the new cycle
        const resetResult = await User.updateMany(
            { role: "citizen" },
            { $set: { rewardPoints: 0 } }
        );

        return res.status(200).json({
            success: true,
            message: `Reward cycle ended. Winner: ${topCitizen.fullName} (${winningPoints} points). All citizen points reset to 0.`,
            winner: {
                id: topCitizen._id,
                fullName: topCitizen.fullName,
                email: topCitizen.email,
                points: winningPoints
            },
            citizensReset: resetResult.modifiedCount
        });

    } catch (error) {

        console.error("End Reward Cycle Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while ending reward cycle."
        });

    }
};

module.exports = {
    createReward,
    getMyRewards,
    getAllRewards,
    getUserRewardSummary,
    deleteReward,
    getLeaderboard,
    endRewardCycle
};