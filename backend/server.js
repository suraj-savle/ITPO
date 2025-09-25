import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";


dotenv.config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// ✅ Configure CORS here, not in middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Connect DB
connectDB();

// Routes
// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});



app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/mentor", mentorRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/posts", postRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    code: err.code
  });

  if (err.name === 'MongoServerError' && err.code === 11000) {
    // Handle duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `This ${field} is already registered`,
      field: field
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;
