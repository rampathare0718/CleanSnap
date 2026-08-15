const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
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
  getMyRating,
} = require("../controllers/complaintController");

// ==========================================================
// Citizen Routes
// ==========================================================

// Create a new complaint (with before image)
router.post(
  "/",
  protect,
  authorize("citizen"),
  upload.single("beforeImage"),
  createComplaint
);

// Get complaints reported by the logged-in citizen
router.get(
  "/my",
  protect,
  authorize("citizen"),
  getMyComplaints
);

// Delete own complaint (only while Pending)
router.delete(
  "/:id",
  protect,
  authorize("citizen"),
  deleteComplaint
);

// Rate the worker after complaint is completed
router.put(
  "/:id/rate",
  protect,
  authorize("citizen"),
  rateComplaint
);

// ==========================================================
// Admin Routes
// ==========================================================

// Get all complaints (optionally filtered by ?status=)
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllComplaints
);

// Approve a pending complaint
router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveComplaint
);

// Reject a pending complaint
router.put(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectComplaint
);

// Assign a worker to an approved complaint (optionally with a deadline)
router.put(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignWorker
);

// ==========================================================
// Worker Routes
// ==========================================================

// Get complaints assigned to the logged-in worker
router.get(
  "/assigned",
  protect,
  authorize("worker"),
  getAssignedComplaints
);

// Get the logged-in worker's average rating + rated jobs
router.get(
  "/worker/rating",
  protect,
  authorize("worker"),
  getMyRating
);

// Mark complaint as "In Progress"
router.put(
  "/:id/start",
  protect,
  authorize("worker"),
  startWork
);

// Upload after image & mark complaint as "Completed"
router.put(
  "/:id/complete",
  protect,
  authorize("worker"),
  upload.single("afterImage"),
  completeComplaint
);

// ==========================================================
// Shared Route (citizen owner / admin / assigned worker)
// ==========================================================

// Get single complaint by ID — put LAST since it's a generic /:id catch-all
router.get(
  "/:id",
  protect,
  getComplaintById
);

module.exports = router;