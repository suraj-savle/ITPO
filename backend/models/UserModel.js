import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
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

    role: {
        type: String,
        enum: ["student", "mentor", "admin", "recruiter"],
        required: true
    },
    status: {
        type: String,
        enum: ["active", "pending"],
        default: function () {
            return this.role === "student" ? "pending" : "active";
        }
    },

    phone: { type: String },
    department: { type: String, default: "" }, // ✅ kept only once
    year: { type: String },
    rollNo: { type: String, unique: true, sparse: true },
    description: { type: String, maxlength: 500, default: "" },

    // ===== ACADEMIC INFO =====
    course: { type: String, default: "" },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    specialization: { type: String, default: "" },
    backlogs: { type: Number, min: 0, default: 0 }, // new: backlog count

    // ===== SKILLS, PROJECTS, EXPERIENCE =====
    skills: { type: [String], default: [] },
    certifications: [{
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        date: { type: Date }
    }],
    projects: [{
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: { type: [String], default: [] },
        githubLink: { type: String, default: "" },
        liveDemo: { type: String, default: "" }
    }],
    experiences: [{
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        startDate: { type: Date },
        endDate: { type: Date },
        currentlyWorking: { type: Boolean, default: false },
        description: { type: String, default: "" }
    }],

    // ===== PLACEMENT INFO =====
    isPlaced: { type: Boolean, default: false },
    placementDetails: {
        company: { type: String, default: "" },
        roleOffered: { type: String, default: "" },
        package: { type: String, default: "" }, // e.g. "6 LPA"
        offerDate: { type: Date }
    },
    appliedJobs: [{
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        status: { type: String, enum: ["applied", "interview", "offered", "rejected"], default: "applied" },
        appliedOn: { type: Date, default: Date.now }
    }],

    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    profileUrl: { type: String, default: "" },
    assignedMentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // ===== SOCIAL LINKS =====
    socialLinks: {
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        twitter: { type: String, default: "" },
        leetcode: { type: String, default: "" },
        codeforces: { type: String, default: "" }, // new
        hackerrank: { type: String, default: "" }  // new
    },

    // ===== GAMIFICATION =====
    reputationPoints: { type: Number, default: 0 },
    profileCompletion: { type: Number, default: 0 },
    badges: [{ type: String, default: "" }], // e.g. "Top Coder", "Hackathon Winner"
    activityLog: [{
        action: { type: String }, // e.g. "Applied to Job", "Updated Profile"
        date: { type: Date, default: Date.now }
    }],

    // ===== SYSTEM =====
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false }, // Email verification
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    lastLogin: Date,
    profileImage: { type: String, default: "" }

}, { timestamps: true });


// 🔑 Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Calculate profile completion automatically
userSchema.methods.calculateProfileCompletion = function () {
    let fieldsCompleted = 0;
    let totalFields = 5; // CGPA, skills, projects, experiences, social links

    if (this.cgpa && this.cgpa > 0) fieldsCompleted++;
    if (this.skills && this.skills.length > 0) fieldsCompleted++;
    if (this.projects && this.projects.length > 0) fieldsCompleted++;
    if (this.experiences && this.experiences.length > 0) fieldsCompleted++;
    if (this.socialLinks && (this.socialLinks.linkedin || this.socialLinks.github || this.socialLinks.portfolio)) fieldsCompleted++;

    this.profileCompletion = Math.round((fieldsCompleted / totalFields) * 100);
    return this.profileCompletion;
};

// 🔑 Calculate reputation points automatically
userSchema.methods.calculateReputation = function () {
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
        if (this.skills.length > 5) points += 10;
    }

    // Projects points
    if (this.projects && this.projects.length > 0) {
        points += this.projects.length * 20;
        if (this.projects.length > 3) points += 15;
    }

    // Experiences points
    if (this.experiences && this.experiences.length > 0) {
        this.experiences.forEach(exp => {
            points += 30;
            if (exp.currentlyWorking) points += 10;
        });
    }

    // Profile completion bonus
    if (this.profileCompletion === 100) points += 25;

    this.reputationPoints = points;
    return this.reputationPoints;
};

// 🔑 Auto-update profileCompletion & reputation before save
userSchema.pre("save", function (next) {
    this.calculateProfileCompletion();
    this.calculateReputation();
    next();
});

// 🔑 Public profile without sensitive data
userSchema.methods.getPublicProfile = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpire;
    return obj;
};

export default mongoose.model("User", userSchema);
