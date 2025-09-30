import Notification from "../models/NotificationModel.js";
import User from "../models/UserModel.js";

class NotificationService {
  // Create a notification
  static async createNotification({
    recipient,
    sender = null,
    type,
    title,
    message,
    data = {},
    priority = "medium",
    expiresAt = null
  }) {
    try {
      const notification = await Notification.create({
        recipient,
        sender,
        type,
        title,
        message,
        data,
        priority,
        expiresAt
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Notify placement cell about new job submission
  static async notifyJobSubmission(jobId, recruiterId, jobTitle) {
    try {
      // Find all admin users (placement cell)
      const admins = await User.find({ role: "admin", isActive: true });
      
      const notifications = admins.map(admin => ({
        recipient: admin._id,
        sender: recruiterId,
        type: "job_submitted",
        title: "New Job Posting Submitted",
        message: `A new job posting "${jobTitle}" has been submitted for approval.`,
        data: { jobId, recruiterId },
        priority: "high"
      }));

      await Notification.insertMany(notifications);
      console.log(`Job submission notifications sent to ${admins.length} admins`);
    } catch (error) {
      console.error("Error notifying job submission:", error);
    }
  }

  // Notify recruiter about job approval/rejection
  static async notifyJobStatus(jobId, recruiterId, status, jobTitle, comments = "") {
    try {
      const isApproved = status === "approved";
      
      await this.createNotification({
        recipient: recruiterId,
        type: isApproved ? "job_approved" : "job_rejected",
        title: `Job Posting ${isApproved ? "Approved" : "Rejected"}`,
        message: `Your job posting "${jobTitle}" has been ${status.toLowerCase()}.${comments ? ` Comments: ${comments}` : ""}`,
        data: { jobId, status },
        priority: isApproved ? "medium" : "high"
      });

      console.log(`Job ${status} notification sent to recruiter`);
    } catch (error) {
      console.error("Error notifying job status:", error);
    }
  }

  // Notify about new application
  static async notifyNewApplication(applicationId, studentId, recruiterId, jobTitle) {
    try {
      await this.createNotification({
        recipient: recruiterId,
        sender: studentId,
        type: "application_received",
        title: "New Job Application",
        message: `You have received a new application for "${jobTitle}".`,
        data: { applicationId, studentId },
        priority: "medium"
      });

      console.log("New application notification sent to recruiter");
    } catch (error) {
      console.error("Error notifying new application:", error);
    }
  }

  // Notify student about application status update
  static async notifyApplicationStatus(applicationId, studentId, status, jobTitle, note = "") {
    try {
      const statusMessages = {
        "interview scheduled": "Your application has been shortlisted for an interview!",
        "hired": "Congratulations! You have been selected for the position.",
        "rejected by recruiter": "Your application was not selected this time."
      };

      await this.createNotification({
        recipient: studentId,
        type: "application_status_update",
        title: "Application Status Update",
        message: `${statusMessages[status] || "Your application status has been updated"} Job: "${jobTitle}".${note ? ` Note: ${note}` : ""}`,
        data: { applicationId, status },
        priority: status === "hired" ? "high" : "medium"
      });

      console.log("Application status notification sent to student");
    } catch (error) {
      console.error("Error notifying application status:", error);
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const filter = { recipient: userId };
      if (unreadOnly) filter.isRead = false;

      const notifications = await Notification.find(filter)
        .populate('sender', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(filter);
      const unreadCount = await Notification.countDocuments({ 
        recipient: userId, 
        isRead: false 
      });

      return {
        notifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
        unreadCount
      };
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw error;
    }
  }

  // Notify placement cell about new recruiter registration
  static async notifyRecruiterRegistration(recruiterId, companyName, recruiterName) {
    try {
      const admins = await User.find({ role: "admin", isActive: true });
      
      if (admins.length === 0) {
        console.log("No admin users found for notification");
        return;
      }

      const notifications = admins.map(admin => ({
        recipient: admin._id,
        sender: recruiterId,
        type: "recruiter_registered",
        title: "New Recruiter Registration",
        message: `${recruiterName} from "${companyName}" has registered and is awaiting approval.`,
        data: { recruiterId },
        priority: "medium"
      }));

      await Notification.insertMany(notifications);
      console.log(`Recruiter registration notifications sent to ${admins.length} admins`);
    } catch (error) {
      console.error("Error notifying recruiter registration:", error);
      // Don't throw error to prevent registration failure
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true }
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }
}

export default NotificationService;