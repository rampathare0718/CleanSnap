const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

app.use(cors({
    origin: "https://cleansnap-frontend-k69j.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options("*", cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const governmentUpdateRoutes = require("./routes/governmentUpdateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const rewardRoutes=require("./routes/rewardRoutes");
const feedbackRoutes=require("./routes/feedbackRoutes");


// Load Environment Variables


// Connect Database
connectDB();

const app = express();

// =========================
// Middlewares
// =========================


app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/government-updates", governmentUpdateRoutes);
app.use("/api/notifications", notificationRoutes);   
app.use("/api/rewards",rewardRoutes);  
app.use("/api/feedback",feedbackRoutes);

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