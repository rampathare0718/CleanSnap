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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);