import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// ✅ Configure CORS here, not in middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Connect DB
connectDB();

// Routes
// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Debug route to list all registered users
app.get('/api/debug/users', async (req, res) => {
  try {
    const User = (await import('./models/UserModel.js')).default;
    const users = await User.find({});
    console.log('Debug - All users:', users);
    res.json({
      count: users.length,
      users: users.map(u => ({
        email: u.email,
        rollNo: u.rollNo,
        name: u.name,
        status: u.status,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to list registered emails (development only)
app.get('/api/debug/registered-emails', async (req, res) => {
  try {
    const User = (await import('./models/UserModel.js')).default;
    const users = await User.find({}, 'email rollNo name status');
    console.log('Registered users:', users);
    res.json({
      count: users.length,
      users: users.map(u => ({
        email: u.email,
        rollNo: u.rollNo,
        name: u.name,
        status: u.status
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Debug route to check database contents (remove in production)
app.get('/api/debug/users', async (req, res) => {
  try {
    const User = (await import('./models/UserModel.js')).default;
    const users = await User.find({}).select('-password');
    res.json({ 
      count: users.length,
      users: users.map(u => ({ 
        email: u.email, 
        rollNo: u.rollNo,
        name: u.name,
        status: u.status
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);


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
