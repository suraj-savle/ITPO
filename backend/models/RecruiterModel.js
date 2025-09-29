import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Company Information
  companyProfile: {
    legalName: { type: String, required: true },
    displayName: { type: String, required: true },
    website: { type: String, required: true },
    industry: { type: String, required: true },
    companySize: { type: String, enum: ["1-10", "11-50", "51-200", "201-1000", "1000+"], required: true },
    headquarters: { type: String, required: true },
    description: { type: String, required: true, maxlength: 1000 },
    logo: { type: String, default: "" }
  },

  // Contact Information
  contactInfo: {
    primaryContact: { type: String, required: true },
    phone: { type: String, required: true },
    alternateEmail: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "India" }
    }
  },

  // Verification Documents
  documents: {
    registrationCertificate: { type: String, required: true },
    mouDocument: { type: String },
    taxId: { type: String, required: true },
    additionalDocs: [{ type: String }]
  },

  // Verification Status
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  verificationNotes: { type: String, default: "" },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // Multi-Factor Authentication
  mfaEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
  backupCodes: [{ type: String }],

  // Preferences
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    weeklyReports: { type: Boolean, default: true }
  },

  // Activity Tracking
  lastLoginAt: { type: Date },
  loginCount: { type: Number, default: 0 },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for faster queries
recruiterSchema.index({ "user": 1 });
recruiterSchema.index({ "verificationStatus": 1 });
recruiterSchema.index({ "companyProfile.legalName": 1 });

export default mongoose.model("Recruiter", recruiterSchema);