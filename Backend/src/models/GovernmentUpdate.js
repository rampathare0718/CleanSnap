const mongoose = require("mongoose");

const governmentUpdateSchema = new mongoose.Schema(
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

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Environment",
        "Cleanliness",
        "Recycling",
        "Event",
        "Public Notice",
      ],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },

    eventDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GovernmentUpdate",
  governmentUpdateSchema
);