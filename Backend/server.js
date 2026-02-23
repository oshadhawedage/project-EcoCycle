import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ewasteRoutes from "./routes/EwasteRoutes.js";
import pickupRoutes from "./routes/pickupRequestRoutes.js";
import impactLogRoutes from "./routes/impactLogRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";


// Load environment variables
dotenv.config();

// Create express app
const app = express();


// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// Connect to MongoDB
connectDB();

// Basic test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/ewaste", ewasteRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/impact-logs", impactLogRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/settings", settingsRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  