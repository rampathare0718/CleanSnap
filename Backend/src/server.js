const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const governmentUpdateRoutes = require("./routes/governmentUpdateRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// =========================
// Middlewares
// =========================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/government-updates", governmentUpdateRoutes);
app.use("/api/notifications", notificationRoutes);     

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