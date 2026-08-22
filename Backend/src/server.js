const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const governmentUpdateRoutes = require("./routes/governmentUpdateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// =========================
// CORS
// =========================
// Supports multiple origins (comma-separated in .env) so the same code
// works for local development AND your deployed Render frontend.
// Example .env value:
//   CORS_ORIGINS=http://localhost:5173,https://cleansnap-frontend-k69j.onrender.com
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:5173", "https://cleansnap-frontend-1b5w.onrender.com"];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like curl/Postman) and any listed origin
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// =========================
// Middlewares
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// Connect Database
// =========================
connectDB();

// =========================
// Static Files
// =========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// Routes
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/government-updates", governmentUpdateRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/feedback", feedbackRoutes);

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 CleanSnap Backend is Running..."
    });
});

// =========================
// Handle Invalid Routes
// =========================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});