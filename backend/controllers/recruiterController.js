import User from "../models/UserModel.js";
import Recruiter from "../models/RecruiterModel.js";
import Job from "../models/JobModel.js";
import Application from "../models/ApplicationModel.js";
import NotificationService from "../services/notificationService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed'));
    }
  }
});

// Register recruiter with company profile
export const registerRecruiter = async (req, res) => {
  try {
    const {
      name, email, password, phone,
      companyProfile, contactInfo, documents
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user account
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "recruiter",
      company: companyProfile.displayName
    });

    // Create recruiter profile
    const recruiter = await Recruiter.create({
      user: user._id,
      companyProfile,
      contactInfo,
      documents
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Recruiter registered successfully. Awaiting verification.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: recruiter.verificationStatus
      }
    });
  } catch (error) {
    console.error("Recruiter registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recruiter profile
export const getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ user: req.user._id })
      .populate('user', '-password');
    
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    res.json(recruiter);
  } catch (error) {
    console.error("Get recruiter profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update recruiter profile
export const updateRecruiterProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    const recruiter = await Recruiter.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('user', '-password');

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter profile not found" });
    }

    res.json({ message: "Profile updated successfully", recruiter });
  } catch (error) {
    console.error("Update recruiter profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create job posting (draft or submit)
export const createJobPosting = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      recruiter: req.user._id
    };

    // If submitting for approval, set status and timestamp
    if (req.body.submit) {
      jobData.status = "pending_approval";
      jobData.submittedAt = new Date();
    }

    const job = await Job.create(jobData);

    // Send notification to placement cell if submitted
    if (req.body.submit) {
      await NotificationService.notifyJobSubmission(job._id, req.user._id, job.title);
    }

    res.status(201).json({
      message: req.body.submit ? "Job submitted for approval" : "Job saved as draft",
      job
    });
  } catch (error) {
    console.error("Create job posting error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recruiter's job postings
export const getRecruiterJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = { recruiter: req.user._id };
    if (status && status !== 'all') {
      if (status === 'draft') {
        filter.$or = [{ status: 'draft' }, { status: { $exists: false } }];
      } else {
        filter.status = status;
      }
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error("Get recruiter jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job posting
export const updateJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findOne({ _id: jobId, recruiter: req.user._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    // Only allow updates for draft or rejected jobs
    if (!['draft', 'rejected'].includes(job.status)) {
      return res.status(400).json({ message: "Cannot edit job in current status" });
    }

    // If resubmitting after rejection, update status
    if (updates.submit && job.status === 'rejected') {
      updates.status = "pending_approval";
      updates.submittedAt = new Date();
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      message: updates.submit ? "Job resubmitted for approval" : "Job updated successfully",
      job: updatedJob
    });
  } catch (error) {
    console.error("Update job posting error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get job applications for recruiter
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify job belongs to recruiter
    const job = await Job.findOne({ _id: jobId, recruiter: req.user._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }

    const filter = { job: jobId };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('student', 'name email phone department year cgpa skills profileImage resumeUrl')
      .populate('mentor', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      job: { title: job.title, department: job.department },
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, recruiterNote, interviewDate } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job', 'recruiter title');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify job belongs to recruiter
    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updates = { status };
    if (recruiterNote) updates.recruiterNote = recruiterNote;
    if (interviewDate) updates.interviewDate = interviewDate;

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { $set: updates },
      { new: true }
    ).populate('student', 'name email').populate('job', 'title');

    // Send notification to student
    await NotificationService.notifyApplicationStatus(
      applicationId,
      updatedApplication.student._id,
      status,
      updatedApplication.job.title,
      recruiterNote
    );

    res.json({
      message: "Application status updated successfully",
      application: updatedApplication
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recruiter dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Use both new and legacy job models
    const [legacyJobs, applications] = await Promise.all([
      Job.find({ recruiter: recruiterId }),
      Application.find({ recruiter: recruiterId })
    ]);

    const totalJobs = legacyJobs.length;
    const activeJobs = legacyJobs.filter(job => job.isActive).length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => app.status === 'pending recruiter review').length;
    const interviewsScheduled = applications.filter(app => app.status === 'interview scheduled').length;

    res.json({
      totalJobs,
      activeJobs,
      pendingJobs: 0,
      totalApplications,
      pendingApplications,
      interviewsScheduled,
      approvedStudents: applications.filter(app => ['interview scheduled', 'hired'].includes(app.status)).length
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get application history with filters
export const getApplicationHistory = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const filter = { recruiter: req.user._id };
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const applications = await Application.find(filter)
      .populate('student', 'name email department year')
      .populate('job', 'title department')
      .populate('mentor', 'name email')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get application history error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Generate reports
export const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const recruiterId = req.user._id;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let reportData = {};

    switch (type) {
      case 'jobs':
        reportData = await Job.aggregate([
          { $match: { recruiter: recruiterId, ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              jobs: { $push: { title: '$title', createdAt: '$createdAt' } }
            }
          }
        ]);
        break;

      case 'applications':
        reportData = await Application.aggregate([
          { $match: { recruiter: recruiterId, ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    res.json({ type, reportData, generatedAt: new Date() });
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};