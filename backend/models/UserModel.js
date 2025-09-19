import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ["student", "mentor", "admin", "recruiter"], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["active", "pending"], 
    default: function() {
      return this.role === "student" ? "pending" : "active";
    }
  },
  phone: { type: String },
  department: { type: String },
  year: { type: String },
  rollNo: { type: String, unique: true, sparse: true },
  cgpa: { type: Number, min: 0, max: 10 },
  skills: { type: [String], default: [] },
  coverLetter: { type: String, default: "" },
  resumeUrl: { type: String, default: "" },
  placed: { type: Boolean, default: false },
  assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  companyName: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

userSchema.methods.getPublicProfile = function() {
  const obj = this.toObject();
  const { password, ...publicProfile } = obj;
  return publicProfile;
};

export default mongoose.model("User", userSchema);