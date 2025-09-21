// backend/controllers/applicationController.js
import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";

export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user._id;
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    const existing = await Application.findOne({ student: studentId, job: jobId });
    if (existing && !['rejected by mentor', 'rejected by recruiter'].includes(existing.status)) {
      return res.status(400).json({ message: "Already applied" });
    }
    
    if (existing) await Application.findByIdAndDelete(existing._id);

    const student = await User.findById(studentId).select('assignedMentor');
    
    await Application.create({
      student: studentId,
      job: jobId,
      mentor: student?.assignedMentor,
      recruiter: job.recruiter
    });

    res.status(201).json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    console.error("Get My Applications Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
    console.error("Get Mentor Applications Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
    console.error("Get Recruiter Applications Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Student: withdraw application
export const withdrawApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // ensure student owns this application
    if (String(app.student) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Only allow withdrawal if pending
    if (app.status !== "pending mentor approval") {
      return res.status(400).json({ message: "Cannot withdraw application at this stage" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    console.error("Withdraw Application Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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
