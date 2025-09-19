// controllers/authController.js
import Student from "../models/StudentModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route POST /api/auth/register
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const student = new Student({ name, email, password, });
    await student.save();

    res.status(201).json({
      success: true,
      token: generateToken(student._id),
      student: student.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @route POST /api/auth/login
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select("+password");
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await student.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      success: true,
      token: generateToken(student._id),
      student: student.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
