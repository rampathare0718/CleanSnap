const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    beforeImage: {
      type: String,
      required: true,
    },

    afterImage: {
      type: String,
      default: "",
    },

    location: {
      address: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Assigned",
        "In Progress",
        "Completed",
        "Rejected",
      ],
      default: "Pending",
    },

    adminRemark: {
      type: String,
      default: "",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // ---- Deadline (set by admin when assigning a worker) ----
    deadline: {
      type: Date,
      default: null,
    },

    // ---- Rating (given by citizen to worker after completion) ----
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    ratingComment: {
      type: String,
      trim: true,
      default: "",
    },

    ratedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);