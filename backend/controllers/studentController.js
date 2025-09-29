import User from "../models/UserModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/resumes';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `resume-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate('assignedMentor', 'name email department')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('resumeUrl name');
    
    if (!student || !student.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filename = student.resumeUrl.split('/').pop();
    const filePath = path.join('uploads/resumes', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.download(filePath, `${student.name.replace(/\s+/g, '_')}_Resume.pdf`);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const viewResume = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('resumeUrl');
    
    if (!student || !student.resumeUrl) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filename = student.resumeUrl.split('/').pop();
    const filePath = path.join('uploads/resumes', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(path.resolve(filePath));
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'year', 'cgpa', 'description', 'skills', 
      'socialLinks', 'projects', 'experiences', 'course', 'specialization', 'backlogs',
      'profileImage'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const student = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: student
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeUrl = `http://localhost:5000/uploads/resumes/${req.file.filename}`;
    
    const student = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl,
      user: student
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
