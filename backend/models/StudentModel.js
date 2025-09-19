import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const studentSchema = new mongoose.Schema({
  // ===== AUTH =====
  name: { type: String, required: true, trim: true, maxlength: 100, default: "" },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    default: "",
    validate: {
      validator: email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: "Invalid email format"
    }
  },
  password: { type: String, required: true, minlength: 8, select: false, default: "" },

  // ===== ACADEMIC INFO =====
  university: { type: String, default: "" },
  dob: Date,
  course: { type: String, default: "" },
  rollNo: {
    type: String,
    sparse: true,  // This allows multiple null values
    // unique: true,
    default: 0,
  },
  currentYear: { type: Number, min: 1, max: 5, default: 1 },
  cgpa: { type: Number, min: 0, max: 10, default: 0 },

    // ===== SKILLS, PROJECTS, EXPERIENCE =====
  description: { type: String, maxlength: 1000, default: "" },
  skills: [{
    name: { type: String, default: "" },
    proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" }
  }],
  projects: [{
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: { type: [String], default: [] },
    githubLink: { type: String, default: "" }
  }],
  experiences: [{
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    startDate: { type: Date },
    endDate: { type: Date },
    currentlyWorking: { type: Boolean, default: false }
  }],

  // ===== SOCIAL LINKS =====
  socialLinks: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" }
  },

  // ===== GAMIFICATION =====
  reputationPoints: { type: Number, default: 0 },
  profileCompletion: { type: Number, default: 0 },

  // ===== SYSTEM =====
  isActive: { type: Boolean, default: true },
  lastLogin: Date

}, { timestamps: true });

// 🔑 Hash password before save
studentSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare password
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Calculate profile completion automatically
studentSchema.methods.calculateProfileCompletion = function() {
  let fieldsCompleted = 0;
  let totalFields = 4; // CGPA, skills, projects, experiences

  if (this.cgpa && this.cgpa > 0) fieldsCompleted++;
  if (this.skills && this.skills.length > 0) fieldsCompleted++;
  if (this.projects && this.projects.length > 0) fieldsCompleted++;
  if (this.experiences && this.experiences.length > 0) fieldsCompleted++;

  this.profileCompletion = Math.round((fieldsCompleted / totalFields) * 100);
  return this.profileCompletion;
};

// 🔑 Calculate reputation points automatically
studentSchema.methods.calculateReputation = function() {
  let points = 0;

  // CGPA points
  if (this.cgpa >= 9) points += 50;
  else if (this.cgpa >= 8) points += 40;
  else if (this.cgpa >= 7) points += 30;
  else if (this.cgpa >= 6) points += 20;
  else points += 10;

  // Skills points
  if (this.skills && this.skills.length > 0) {
    points += this.skills.length * 5;
    if (this.skills.length > 5) points += 2;
  }

  // Projects points
  if (this.projects && this.projects.length > 0) {
    points += this.projects.length * 20;
    if (this.projects.length > 3) points += 10;
  }

  // Experiences points
  if (this.experiences && this.experiences.length > 0) {
    this.experiences.forEach(exp => {
      points += 30;
      if (exp.currentlyWorking) points += 10;
    });
  }

  this.reputationPoints = points;
  return this.reputationPoints;
};

// 🔑 Auto-update profileCompletion & reputation before save
studentSchema.pre("save", function(next) {
  this.calculateProfileCompletion();
  this.calculateReputation();
  next();
});

// 🔑 Public profile without sensitive data
studentSchema.methods.getPublicProfile = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("Student", studentSchema);
