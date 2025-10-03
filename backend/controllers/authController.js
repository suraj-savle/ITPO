import User from "../models/UserModel.js";
import NotificationService from "../services/notificationService.js";
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

// @route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, department, year, rollNo, cgpa, skills, role, company, status } = req.body;
    
    const isRecruiter = role === "recruiter";
    
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ 
        message: "This email address is already registered",
        field: "email"
      });
    }
    
    if (rollNo) {
      const existingRollNo = await User.findOne({ rollNo });
      if (existingRollNo) {
        return res.status(400).json({ 
          message: "This roll number is already registered",
          field: "rollNo"
        });
      }
    }

    const userData = { 
      name, 
      email, 
      password, 
      phone,
      role: role || "student"
    };
    
    if (!isRecruiter) {
      userData.department = department;
      userData.year = year;
      userData.rollNo = rollNo;
      userData.cgpa = parseFloat(cgpa) || 0;
      userData.skills = skills || [];
      userData.status = "pending";
    }
    
    if (isRecruiter) {
      userData.company = company;
      userData.status = "pending";
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: isRecruiter ? "Registration submitted. Awaiting admin approval." : "Registration successful. Awaiting admin approval.",
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
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email }).select("+password");
    console.log('User found:', user ? { id: user._id, email: user.email, status: user.status, role: user.role } : 'No user found');
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "pending") {
      console.log('User account pending approval:', user.email);
      return res.status(403).json({ message: "Account pending approval" });
    }

    console.log('Comparing password...');
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', user.email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update last login and add activity log
    user.lastLogin = new Date();
    user.activityLog.push({ action: 'Logged in', date: new Date() });
    await user.save();

    console.log('Login successful for user:', user.email);
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      role: user.role,
      user: user.getPublicProfile(),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('assignedMentor', 'name email');
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
    const userId = req.user._id;
    console.log('Received update request for user:', userId);
    console.log('Update data:', req.body);

    // Find user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // List of fields that can be updated
    const allowedFields = [
      'name', 'phone', 'department', 'year', 'cgpa', 
      'description', 'skills', 'socialLinks', 'projects', 
      'experiences', 'course', 'specialization', 'backlogs'
    ];

    // Update only allowed fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        // Handle special cases
        if (field === 'cgpa') {
          user[field] = parseFloat(req.body[field]) || 0;
        } else if (field === 'backlogs') {
          user[field] = parseInt(req.body[field]) || 0;
        } else {
          user[field] = req.body[field];
        }
      }
    }

    // Handle nested updates for socialLinks
    if (req.body.socialLinks) {
      user.socialLinks = {
        linkedin: req.body.socialLinks.linkedin || "",
        github: req.body.socialLinks.github || "",
        portfolio: req.body.socialLinks.portfolio || "",
        twitter: req.body.socialLinks.twitter || "",
        leetcode: req.body.socialLinks.leetcode || "",
        codeforces: req.body.socialLinks.codeforces || "",
        hackerrank: req.body.socialLinks.hackerrank || "",
      };
    }

    try {
      // Add activity log
      user.activityLog.push({ action: 'Updated profile', date: new Date() });
      
      // Save the updated user
      await user.save();
      console.log('User profile updated successfully');

      // Send back the updated user data
      res.json({
        message: "Profile updated successfully",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          department: user.department,
          year: user.year,
          rollNo: user.rollNo,
          cgpa: user.cgpa,
          description: user.description,
          skills: user.skills,
          socialLinks: user.socialLinks,
          projects: user.projects,
          experiences: user.experiences,
          course: user.course,
          specialization: user.specialization,
          backlogs: user.backlogs
        }
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      
      // Check for validation errors
      if (saveError.name === 'ValidationError') {
        return res.status(400).json({
          message: "Validation error",
          errors: Object.keys(saveError.errors).reduce((acc, key) => {
            acc[key] = saveError.errors[key].message;
            return acc;
          }, {})
        });
      }
      
      throw saveError;
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ 
      message: "Failed to update profile",
      error: error.message 
    });
  }
};