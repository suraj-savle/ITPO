import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["general", "placement", "academic", "event", "urgent"], 
      default: "general" 
    },
    priority: { 
      type: String, 
      enum: ["low", "medium", "high"], 
      default: "medium" 
    },
    targetAudience: { 
      type: String, 
      enum: ["all", "student", "mentor", "recruiter"], 
      default: "all" 
    },
    expiresAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
