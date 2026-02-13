import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  