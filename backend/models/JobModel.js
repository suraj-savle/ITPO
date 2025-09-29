// Simple JobModel for compatibility
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "approved", "rejected", "interview"], default: "pending" },
  interviewDate: { type: Date }
});

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rolesResponsibilities: { type: String },
    location: { type: String, required: true },
    skillsRequired: [{ type: String }],
    stipend: { type: String, required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applications: [applicationSchema],
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["draft", "pending_approval", "approved", "rejected", "request_changes"], default: "draft" }
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
