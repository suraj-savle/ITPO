// backend/controllers/applicationController.js
import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

// Student applies to job
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) return res.status(404).json({ message: "Job not found or inactive" });

    // Prevent duplicate application via unique index (but handle nicely)
    const existing = await Application.findOne({ student: req.user._id, job: jobId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    // assign student's mentor if available
    const student = await User.findById(req.user._id).select("assignedMentor");
    const mentorId = student?.assignedMentor || null;

    const application = await Application.create({
      student: req.user._id,
      job: jobId,
      mentor: mentorId,
      recruiter: job.createdBy,
      studentNote: req.body.studentNote || ""
    });

    // Optionally notify mentor (email/notification) - out of scope
    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    // handle duplicate index error
    if (err.code === 11000) return res.status(400).json({ message: "Already applied" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Student: list my applications
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user._id })
      .populate("job")
      .populate("mentor", "name email")
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mentor: list applications assigned to me (pending mentor approval)
export const getMentorApplications = async (req, res) => {
  try {
    const apps = await Application.find({ mentor: req.user._id, status: "pending mentor approval" })
      .populate("job")
      .populate("student", "name email department year profileImage")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mentor: approve/reject application
export const mentorDecision = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // ensure mentor owns this application
    if (String(app.mentor) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { action, mentorNote } = req.body; // action: "approve" or "reject"
    if (action === "approve") {
      app.status = "pending recruiter review";
      app.mentorNote = mentorNote || "";
    } else if (action === "reject") {
      app.status = "rejected by mentor";
      app.mentorNote = mentorNote || "";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await app.save();
    // optionally notify student & recruiter
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Recruiter: list mentor-approved applications (or all for recruiter)
export const getRecruiterApplications = async (req, res) => {
  try {
    // recruiter sees applications for his jobs
    const filter = { recruiter: req.user._id };
    // optionally query by status
    if (req.query.status) filter.status = req.query.status;

    const apps = await Application.find(filter)
      .populate("job")
      .populate("student", "name email department year profileImage")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Recruiter: take action (reject/schedule/hire)
export const recruiterDecision = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (String(app.recruiter) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { action, recruiterNote, interviewDate } = req.body;

    if (action === "reject") {
      app.status = "rejected by recruiter";
      app.recruiterNote = recruiterNote || "";
    } else if (action === "schedule") {
      if (!interviewDate) return res.status(400).json({ message: "interviewDate required" });
      app.status = "interview scheduled";
      app.interviewDate = new Date(interviewDate);
      app.recruiterNote = recruiterNote || "";
    } else if (action === "hire") {
      app.status = "hired";
      app.recruiterNote = recruiterNote || "";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await app.save();
    // optionally notify student & mentor
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
