import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, enum: ["Internship", "Job"], default: "Internship" },
    location: { type: String },
    description: { type: String, required: true },
    requirements: { type: String },
    stipend: { type: String },
    applyLink: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
