const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
    {
        // Citizen who earned the reward
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Complaint from which reward was generated
        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            default: null,
        },

        // Reward Points
        points: {
            type: Number,
            required: true,
            min: 1,
        },

        // Reason for reward
        reason: {
            type: String,
            required: true,
            trim: true,
        },

        // Reward Cycle
        // Example:
        // 2026-Q1
        // 2026-Q2
        // Cleanliness Drive 2026
        rewardCycle: {
            type: String,
            required: true,
            default: "2026-Q1",
        },

        // Whether this reward has already been considered
        // while selecting winners.
        awarded: {
            type: Boolean,
            default: false,
        },

        // Optional
        // Stores who generated this reward.
        // Usually System.
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Reward", rewardSchema);