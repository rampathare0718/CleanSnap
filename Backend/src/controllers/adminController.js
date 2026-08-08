const Complaint = require("../models/Complaints");
const User = require("../models/User");

// ==========================================================
// @desc    Get dashboard summary stats for admin
// @route   GET /api/admin/stats
// @access  Private (admin)
// ==========================================================
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalComplaints,
      pending,
      approved,
      assigned,
      inProgress,
      completed,
      rejected,
      totalWorkers,
      totalCitizens,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "Approved" }),
      Complaint.countDocuments({ status: "Assigned" }),
      Complaint.countDocuments({ status: "In Progress" }),
      Complaint.countDocuments({ status: "Completed" }),
      Complaint.countDocuments({ status: "Rejected" }),
      User.countDocuments({ role: "worker" }),
      User.countDocuments({ role: "citizen" }),
    ]);

    // Average rating across all rated complaints
    const ratingAgg = await Complaint.aggregate([
      { $match: { rating: { $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const averageRating = ratingAgg.length > 0 ? ratingAgg[0].avgRating : null;
    const totalRatings = ratingAgg.length > 0 ? ratingAgg[0].count : 0;

    // Overdue complaints: deadline passed but not yet completed
    const overdue = await Complaint.countDocuments({
      deadline: { $ne: null, $lt: new Date() },
      status: { $in: ["Assigned", "In Progress"] },
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pending,
        approved,
        assigned,
        inProgress,
        completed,
        rejected,
        overdue,
        totalWorkers,
        totalCitizens,
        averageRating,
        totalRatings,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard stats.",
    });
  }
};

module.exports = {
  getDashboardStats,
};