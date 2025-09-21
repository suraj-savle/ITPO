// backend/models/ApplicationModel.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },     // student's mentor
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // job.createdBy
  status: {
    type: String,
    enum: [
      "pending mentor approval",
      "rejected by mentor",
      "pending recruiter review",
      "rejected by recruiter",
      "interview scheduled",
      "hired"
    ],
    default: "pending mentor approval"
  },
  studentNote: { type: String, default: "" }, // optional message student adds
  mentorNote: { type: String, default: "" },
  recruiterNote: { type: String, default: "" },
  interviewDate: { type: Date },
}, { timestamps: true });

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
