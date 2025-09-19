import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";

import authRoutes from "./routes/authRoutes.js";
// import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ✅ Configure CORS here, not in middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/student", studentRoutes);



app.use("/api/student", studentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
