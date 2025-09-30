import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true }, // e.g., "job", "application", "profile"
  resourceId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" }
}, { timestamps: true });

// Index for efficient queries
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

export default mongoose.model("AuditLog", auditLogSchema);