const Complaint = require("../models/Complaints");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const { createReward } = require("./rewardController");

// ==========================================================
// @desc    Citizen creates a new complaint (with before image)
// @route   POST /api/complaints
// @access  Private (citizen)
// ==========================================================
const createComplaint = async (req, res) => {
  try {
    const { title, description, address, latitude, longitude } = req.body;

    if (!title || !description || !address) {
      return res.status(400).json({
        success: false,
        message: "Title, description and address are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Before image is required.",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      beforeImage: req.file.filename,
      location: {
        address,
        latitude: latitude || null,
        longitude: longitude || null,
      },
      reportedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating complaint.",
    });
  }
};

// ==========================================================
// @desc    Get complaints reported by the logged-in citizen
// @route   GET /api/complaints/my
// @access  Private (citizen)
// ==========================================================
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("assignedWorker", "fullName mobileNumber");

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get My Complaints Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your complaints.",
    });
  }
};

// ==========================================================
// @desc    Get all complaints (admin dashboard, with filters)
// @route   GET /api/complaints?status=Pending
// @access  Private (admin)
// ==========================================================
const getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "fullName email mobileNumber")
      .populate("assignedWorker", "fullName mobileNumber");

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get All Complaints Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaints.",
    });
  }
};

// ==========================================================
// @desc    Get complaints assigned to logged-in worker
// @route   GET /api/complaints/assigned
// @access  Private (worker)
// ==========================================================
const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedWorker: req.user._id,
      status: { $in: ["Assigned", "In Progress"] },
    })
      .sort({ createdAt: -1 })
      .populate("reportedBy", "fullName mobileNumber");

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get Assigned Complaints Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching assigned complaints.",
    });
  }
};

// ==========================================================
// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private (citizen owner / admin / assigned worker)
// ==========================================================
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("reportedBy", "fullName email mobileNumber")
      .populate("assignedWorker", "fullName mobileNumber");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    const isOwner = complaint.reportedBy._id.toString() === req.user._id.toString();
    const isAssignedWorker =
      complaint.assignedWorker &&
      complaint.assignedWorker._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignedWorker && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You cannot view this complaint.",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get Complaint By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching complaint.",
    });
  }
};

// ==========================================================
// @desc    Admin approves a pending complaint
// @route   PUT /api/complaints/:id/approve
// @access  Private (admin)
// ==========================================================
const approveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Complaint cannot be approved from '${complaint.status}' status.`,
      });
    }

    complaint.status = "Approved";
    if (req.body.adminRemark) {
      complaint.adminRemark = req.body.adminRemark;
    }

    await complaint.save();

    // Notify the citizen that their complaint was approved
    await createNotification({
      user: complaint.reportedBy,
      title: "Complaint Approved",
      message: `Your complaint "${complaint.title}" has been approved and will be assigned to a worker soon.`,
      type: "Complaint",
      complaint: complaint._id,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint approved successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Approve Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while approving complaint.",
    });
  }
};

// ==========================================================
// @desc    Admin rejects a pending complaint
// @route   PUT /api/complaints/:id/reject
// @access  Private (admin)
// ==========================================================
const rejectComplaint = async (req, res) => {
  try {
    const { adminRemark } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Complaint cannot be rejected from '${complaint.status}' status.`,
      });
    }

    complaint.status = "Rejected";
    complaint.adminRemark = adminRemark || "Rejected by admin.";

    await complaint.save();

    // Notify the citizen that their complaint was rejected
    await createNotification({
      user: complaint.reportedBy,
      title: "Complaint Rejected",
      message: `Your complaint "${complaint.title}" was rejected. Reason: ${complaint.adminRemark}`,
      type: "Complaint",
      complaint: complaint._id,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint rejected.",
      complaint,
    });
  } catch (error) {
    console.error("Reject Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while rejecting complaint.",
    });
  }
};

// ==========================================================
// @desc    Admin assigns a worker to an approved complaint
//          (optionally sets a deadline for the worker)
// @route   PUT /api/complaints/:id/assign
// @access  Private (admin)
// ==========================================================
const assignWorker = async (req, res) => {
  try {
    const { workerId, deadline } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "workerId is required.",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved complaints can be assigned to a worker.",
      });
    }

    const worker = await User.findById(workerId);

    if (!worker || worker.role !== "worker") {
      return res.status(400).json({
        success: false,
        message: "Invalid worker selected.",
      });
    }

    complaint.assignedWorker = worker._id;
    complaint.status = "Assigned";

    // Set deadline if the admin provided one
    if (deadline) {
      complaint.deadline = new Date(deadline);
    }

    await complaint.save();

    // Notify the worker that a complaint has been assigned to them
    await createNotification({
      user: worker._id,
      title: "New Complaint Assigned",
      message: complaint.deadline
        ? `You have been assigned to clean up: "${complaint.title}". Deadline: ${complaint.deadline.toDateString()}.`
        : `You have been assigned to clean up: "${complaint.title}".`,
      type: "Complaint",
      complaint: complaint._id,
    });

    // Let the citizen know a worker has been assigned
    await createNotification({
      user: complaint.reportedBy,
      title: "Worker Assigned",
      message: `A worker has been assigned to your complaint "${complaint.title}".`,
      type: "Complaint",
      complaint: complaint._id,
    });

    return res.status(200).json({
      success: true,
      message: "Worker assigned successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Assign Worker Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while assigning worker.",
    });
  }
};

// ==========================================================
// @desc    Worker marks complaint as "In Progress"
// @route   PUT /api/complaints/:id/start
// @access  Private (worker - must be the assigned worker)
// ==========================================================
const startWork = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (
      !complaint.assignedWorker ||
      complaint.assignedWorker.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this complaint.",
      });
    }

    if (complaint.status !== "Assigned") {
      return res.status(400).json({
        success: false,
        message: `Work cannot be started from '${complaint.status}' status.`,
      });
    }

    complaint.status = "In Progress";
    await complaint.save();

    // Let the citizen know work has started on their complaint
    await createNotification({
      user: complaint.reportedBy,
      title: "Cleanup In Progress",
      message: `Work has started on your complaint "${complaint.title}".`,
      type: "Complaint",
      complaint: complaint._id,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint marked as In Progress.",
      complaint,
    });
  } catch (error) {
    console.error("Start Work Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while starting work.",
    });
  }
};

// ==========================================================
// @desc    Worker uploads after image & marks complaint Completed
// @route   PUT /api/complaints/:id/complete
// @access  Private (worker - must be the assigned worker)
// ==========================================================
const completeComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (
      !complaint.assignedWorker ||
      complaint.assignedWorker.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this complaint.",
      });
    }

    if (complaint.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "Work must be started before it can be completed.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "After image is required to complete the complaint.",
      });
    }

    // Update complaint
    complaint.afterImage = req.file.filename;
    complaint.status = "Completed";
    complaint.completedAt = new Date();

    await complaint.save();

    // Award reward points (Reward Controller handles:
    // reward history + reward points + reward notification)
    await createReward({
      user: complaint.reportedBy,
      complaint: complaint._id,
      points: 10,
      reason: "Complaint Completed",
    });

    // Notify citizen that complaint has been completed
    await createNotification({
      user: complaint.reportedBy,
      title: "Complaint Completed",
      message: `Your complaint "${complaint.title}" has been resolved. Check out the after photo!`,
      type: "Complaint",
      complaint: complaint._id,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint marked as Completed. Citizen rewarded successfully.",
      complaint,
    });

  } catch (error) {
    console.error("Complete Complaint Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while completing complaint.",
    });
  }
};

// ==========================================================
// @desc    Citizen rates the worker after complaint is completed
// @route   PUT /api/complaints/:id/rate
// @access  Private (citizen - must be the one who reported it)
// ==========================================================
const rateComplaint = async (req, res) => {
  try {
    const { rating, ratingComment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5.",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only rate complaints you reported.",
      });
    }

    if (complaint.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "You can only rate a complaint after it has been completed.",
      });
    }

    if (complaint.rating !== null) {
      return res.status(400).json({
        success: false,
        message: "This complaint has already been rated.",
      });
    }

    complaint.rating = rating;
    complaint.ratingComment = ratingComment || "";
    complaint.ratedAt = new Date();

    await complaint.save();

    // Notify the worker they've been rated
    if (complaint.assignedWorker) {
      await createNotification({
        user: complaint.assignedWorker,
        title: "You Received a Rating",
        message: `You were rated ${rating}/5 for completing "${complaint.title}".`,
        type: "Complaint",
        complaint: complaint._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating submitted successfully.",
      complaint,
    });
  } catch (error) {
    console.error("Rate Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting rating.",
    });
  }
};

// ==========================================================
// @desc    Citizen deletes their own complaint (only if Pending)
// @route   DELETE /api/complaints/:id
// @access  Private (citizen owner)
// ==========================================================
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (complaint.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own complaints.",
      });
    }

    if (complaint.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending complaints can be deleted.",
      });
    }

    await complaint.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Complaint Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting complaint.",
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getAssignedComplaints,
  getComplaintById,
  approveComplaint,
  rejectComplaint,
  assignWorker,
  startWork,
  completeComplaint,
  rateComplaint,
  deleteComplaint,
};