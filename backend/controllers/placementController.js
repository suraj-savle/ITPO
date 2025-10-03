import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import Application from "../models/ApplicationModel.js";
import Notification from "../models/NotificationModel.js";
import NotificationService from "../services/notificationService.js";
import AuditService from "../services/auditService.js";

// User Account Management
export const getPendingUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    const filter = { status: "pending" };
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get pending users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved, comments } = req.body;

    console.log('Approving user:', { userId, approved, comments });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = approved ? "active" : "rejected";
    await user.save();

    console.log('User status updated successfully');

    // Try audit service but don't fail if it errors
    try {
      await AuditService.logSecurityEvent(
        req.user._id,
        `user_${approved ? 'approved' : 'rejected'}`,
        { userId, userRole: user.role, comments },
        req,
        "high"
      );
    } catch (auditError) {
      console.error('Audit service error (non-blocking):', auditError);
    }

    res.json({
      message: `User ${approved ? 'approved' : 'rejected'} successfully`,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error("Approve user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Job Posting Verification
export const getPendingJobs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const jobs = await Job.find({ status: "pending_approval" })
      .populate('recruiter', 'name email company')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments({ status: "pending_approval" });

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get pending jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const reviewJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { action, comments } = req.body; // action: 'approve', 'reject', 'request_revision'

    const job = await Job.findById(jobId).populate('recruiter', 'name email');
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const oldStatus = job.status;
    
    switch (action) {
      case 'approve':
        job.status = "approved";
        job.approvedAt = new Date();
        job.approvedBy = req.user._id;
        job.isActive = true;
        break;
      case 'reject':
        job.status = "rejected";
        job.rejectionReason = comments;
        break;
      case 'request_revision':
        job.status = "request_changes";
        job.placementCellComments = comments;
        break;
    }

    if (comments) {
      job.placementCellComments = comments;
    }

    await job.save();

    // Send notification to recruiter
    await NotificationService.notifyJobStatus(
      jobId,
      job.recruiter._id,
      job.status,
      job.title,
      comments
    );

    await AuditService.logJobStatusChanged(
      req.user._id,
      jobId,
      oldStatus,
      job.status,
      req
    );

    res.json({
      message: `Job ${action}d successfully`,
      job
    });
  } catch (error) {
    console.error("Review job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Application Workflow Management
export const getApplicationStats = async (req, res) => {
  try {
    const [
      totalApplications,
      pendingMentorApproval,
      pendingRecruiterReview,
      interviewsScheduled,
      hired
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: "pending mentor approval" }),
      Application.countDocuments({ status: "pending recruiter review" }),
      Application.countDocuments({ status: "interview scheduled" }),
      Application.countDocuments({ status: "hired" })
    ]);

    res.json({
      totalApplications,
      pendingMentorApproval,
      pendingRecruiterReview,
      interviewsScheduled,
      hired,
      placementRate: totalApplications > 0 ? ((hired / totalApplications) * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error("Get application stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getApplicationsOverview = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('student', 'name email department year')
      .populate('job', 'title company')
      .populate('mentor', 'name email')
      .populate('recruiter', 'name email company')
      .sort({ createdAt: -1 })
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
    console.error("Get applications overview error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Dashboard Analytics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      activeStudents,
      pendingStudents,
      totalRecruiters,
      pendingRecruiters,
      totalJobs,
      activeJobs,
      pendingJobs,
      totalApplications,
      placedStudents
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", status: "active" }),
      User.countDocuments({ role: "student", status: "pending" }),
      User.countDocuments({ role: "recruiter" }),
      User.countDocuments({ role: "recruiter", status: "pending" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "approved", isActive: true }),
      Job.countDocuments({ status: "pending_approval" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "hired" })
    ]);

    res.json({
      users: {
        totalStudents,
        activeStudents,
        pendingStudents,
        totalRecruiters,
        pendingRecruiters
      },
      jobs: {
        totalJobs,
        activeJobs,
        pendingJobs
      },
      applications: {
        totalApplications,
        placedStudents,
        placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Communication
export const sendBulkNotification = async (req, res) => {
  try {
    const { recipients, title, message, priority = "medium" } = req.body;
    
    let targetUsers = [];
    
    if (recipients.type === "role") {
      targetUsers = await User.find({ 
        role: recipients.value, 
        status: "active" 
      }).select('_id');
    } else if (recipients.type === "specific") {
      targetUsers = recipients.userIds.map(id => ({ _id: id }));
    } else if (recipients.type === "all") {
      targetUsers = await User.find({ status: "active" }).select('_id');
    }

    const notifications = targetUsers.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type: "system_announcement",
      title,
      message,
      priority
    }));

    await Notification.insertMany(notifications);

    res.json({
      message: `Notification sent to ${notifications.length} users`,
      count: notifications.length
    });
  } catch (error) {
    console.error("Send bulk notification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reports
export const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate, format = "json" } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    let reportData = {};

    switch (type) {
      case 'placement':
        reportData = await Application.aggregate([
          ...(Object.keys(dateFilter).length ? [{ $match: { createdAt: dateFilter } }] : []),
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ]);
        break;

      case 'recruitment':
        reportData = await Job.aggregate([
          ...(Object.keys(dateFilter).length ? [{ $match: { createdAt: dateFilter } }] : []),
          {
            $lookup: {
              from: 'users',
              localField: 'recruiter',
              foreignField: '_id',
              as: 'recruiterInfo'
            }
          },
          {
            $group: {
              _id: '$recruiterInfo.company',
              jobCount: { $sum: 1 },
              jobs: { $push: { title: '$title', status: '$status' } }
            }
          }
        ]);
        break;

      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    res.json({ 
      type, 
      reportData, 
      generatedAt: new Date(),
      dateRange: { startDate, endDate }
    });
  } catch (error) {
    console.error("Generate report error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};