import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: { 
    type: String, 
    enum: ["applied", "shortlisted", "interview", "selected", "rejected"], 
    default: "applied" 
  },
  appliedDate: { type: Date, default: Date.now },
  interviewDate: { type: Date },
  feedback: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);