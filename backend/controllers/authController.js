import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route GET /api/auth/check-email/:email
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const existing = await User.findOne({ email });
    console.log('Check email result:', { email, exists: !!existing });
    
    res.json({
      exists: !!existing,
      email
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @route POST /api/auth/register-student
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, department, year, rollNo, cgpa, skills } = req.body;

    console.log('Registration attempt:', { email, rollNo });
    
    // Check email first
    console.log('Checking email:', email);
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    console.log('Existing email check result:', existingEmail ? {
      existingEmail: existingEmail.email,
      existingName: existingEmail.name,
      existingStatus: existingEmail.status,
      createdAt: existingEmail.createdAt
    } : 'No existing user');
    
    if (existingEmail) {
      console.log('Email already exists:', { 
        attemptedEmail: email,
        existingEmail: existingEmail.email 
      });
      return res.status(400).json({ 
        message: "This email address is already registered",
        field: "email"
      });
    }
    
    // Then check roll number
    const existingRollNo = await User.findOne({ rollNo });
    if (existingRollNo) {
      console.log('Roll number already exists:', { attemptedRollNo: rollNo });
      return res.status(400).json({ 
        message: "This roll number is already registered",
        field: "rollNo"
      });
    }

    const user = new User({ 
      name, 
      email, 
      password, 
      phone, 
      department, 
      year, 
      rollNo, 
      cgpa: parseFloat(cgpa),
      skills: skills || [],
      role: "student"
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful. Awaiting admin approval.",
      token,
      user: user.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.status === "pending") {
      return res.status(403).json({ message: "Account pending approval" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      role: user.role,
      user: user.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('assignedMentor', 'name email');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @route PUT /api/auth/update-profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const updates = req.body;

    // ✅ Prevent changing sensitive fields
    const restrictedFields = ["password", "role", "email", "status", "reputationPoints", "profileCompletion"];
    restrictedFields.forEach(field => delete updates[field]);

    // ✅ If resume uploaded
    if (req.files?.resume) {
      user.resumeUrl = `/uploads/resumes/${req.files.resume[0].filename}`;
    }

    if (req.files?.profileUrl) {
      user.profileUrl = `/uploads/profile/${req.files.profileImage[0].filename}`;
    }

    // ✅ Ensure nested updates for socialLinks
    if (updates.socialLinks) {
      updates.socialLinks = {
        linkedin: updates.socialLinks.linkedin || "",
        github: updates.socialLinks.github || "",
        portfolio: updates.socialLinks.portfolio || "",
        twitter: updates.socialLinks.twitter || "",
        leetcode: updates.socialLinks.leetcode || "",
        codeforces: updates.socialLinks.codeforces || "",
        hackerrank: updates.socialLinks.hackerrank || "",
      };
    }

    // ✅ Update and re-run validators
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    // Recalculate profileCompletion & reputation
    user.calculateProfileCompletion();
    user.calculateReputation();
    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};