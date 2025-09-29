import AuditLog from "../models/AuditLogModel.js";

class AuditService {
  static async log({
    user,
    action,
    resource,
    resourceId = null,
    details = {},
    ipAddress = null,
    userAgent = null,
    severity = "low"
  }) {
    try {
      await AuditLog.create({
        user,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent,
        severity
      });
    } catch (error) {
      console.error("Error creating audit log:", error);
    }
  }

  // Job-related audit logs
  static async logJobCreated(userId, jobId, jobData, req) {
    await this.log({
      user: userId,
      action: "job_created",
      resource: "job",
      resourceId: jobId,
      details: { title: jobData.title, status: jobData.status },
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: "medium"
    });
  }

  static async logJobUpdated(userId, jobId, changes, req) {
    await this.log({
      user: userId,
      action: "job_updated",
      resource: "job",
      resourceId: jobId,
      details: { changes },
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: "medium"
    });
  }

  static async logJobStatusChanged(userId, jobId, oldStatus, newStatus, req) {
    await this.log({
      user: userId,
      action: "job_status_changed",
      resource: "job",
      resourceId: jobId,
      details: { oldStatus, newStatus },
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: "high"
    });
  }

  // Application-related audit logs
  static async logApplicationStatusChanged(userId, applicationId, oldStatus, newStatus, req) {
    await this.log({
      user: userId,
      action: "application_status_changed",
      resource: "application",
      resourceId: applicationId,
      details: { oldStatus, newStatus },
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: "medium"
    });
  }

  // Authentication audit logs
  static async logLogin(userId, req, success = true) {
    await this.log({
      user: userId,
      action: success ? "login_success" : "login_failed",
      resource: "auth",
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: success ? "low" : "medium"
    });
  }

  static async logLogout(userId, req) {
    await this.log({
      user: userId,
      action: "logout",
      resource: "auth",
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: "low"
    });
  }

  // Profile audit logs
  static async logProfileUpdated(userId, changes, req) {
    await this.log({
      user: userId,
      action: "profile_updated",
      resource: "profile",
      resourceId: userId,
      details: { changes },
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity: "low"
    });
  }

  // Security audit logs
  static async logSecurityEvent(userId, event, details, req, severity = "high") {
    await this.log({
      user: userId,
      action: `security_${event}`,
      resource: "security",
      details,
      ipAddress: req?.ip,
      userAgent: req?.get('User-Agent'),
      severity
    });
  }

  // Get audit logs with filters
  static async getAuditLogs({
    userId = null,
    action = null,
    resource = null,
    startDate = null,
    endDate = null,
    page = 1,
    limit = 50
  }) {
    try {
      const filter = {};
      
      if (userId) filter.user = userId;
      if (action) filter.action = action;
      if (resource) filter.resource = resource;
      
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate);
        if (endDate) filter.timestamp.$lte = new Date(endDate);
      }

      const logs = await AuditLog.find(filter)
        .populate('user', 'name email role')
        .sort({ timestamp: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await AuditLog.countDocuments(filter);

      return {
        logs,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      console.error("Error getting audit logs:", error);
      throw error;
    }
  }
}

export default AuditService;