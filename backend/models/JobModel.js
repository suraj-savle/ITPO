import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  requirements: { type: [String], default: [] },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["active", "closed"], 
    default: "active" 
  },
  deadline: { type: Date },
  jobType: { 
    type: String, 
    enum: ["internship", "full-time", "part-time"], 
    default: "full-time" 
  }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);