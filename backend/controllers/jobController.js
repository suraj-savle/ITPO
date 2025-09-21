import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import Application from "../models/ApplicationModel.js";

// Create job (recruiter only)
// ✅ Create Job
export const createJob = async (req, res) => {
  try {
    const { title, description, location, skillsRequired, stipend } = req.body;

    if (!title || !description || !location || !skillsRequired || !stipend) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      skillsRequired,
      stipend,
      recruiter: req.user._id, // Assign logged-in recruiter
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create Job Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// Helper to normalize incoming stringified arrays (frontend may send JSON string)
function parseArrayField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch {
    return String(field).split(",").map(s => s.trim()).filter(Boolean);
  }
}

// Get jobs -- for students: exclude ones they've already applied to.
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get single job with some populate
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("createdBy", "name email company");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Deactivate (or delete) job (recruiter)
export const toggleJobActive = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    // Only creator recruiter may toggle (you can also allow admin)
    if (String(job.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to modify this job" });
    }
    job.isActive = !!req.body.isActive;
    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const scheduleInterview = async (req, res) => {
  try {
    const { jobId, studentId } = req.params;
    const { interviewDate } = req.body;

    const job = await JobPost.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const applicant = job.applicants.find(app => app.student.toString() === studentId);
    if (!applicant) return res.status(404).json({ message: "Applicant not found" });

    applicant.status = "Interview Scheduled";
    applicant.interviewDate = interviewDate;

    await job.save();

    res.json({ message: "Interview scheduled successfully", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const studentId = req.user._id;

    // 1️⃣ Fetch the job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // 2️⃣ Clean any invalid application entries
    job.applications = job.applications.filter(app => app.user); // remove entries where user is undefined/null

    // 3️⃣ Check if student already applied
    const alreadyAppliedInJob = job.applications.some(
      a => a.user.toString() === studentId.toString()
    );
    if (alreadyAppliedInJob) {
      return res.status(400).json({ message: "Already applied" });
    }

    // 4️⃣ Add student to job's applications
    job.applications.push({
      user: studentId,
      status: "pending",
      appliedOn: new Date(),
    });
    await job.save();

    // 5️⃣ Update student's appliedJobs array
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Remove any invalid entries in student's appliedJobs
    student.appliedJobs = student.appliedJobs.filter(app => app.jobId);

    const alreadyAppliedInStudent = student.appliedJobs.some(
      app => app.jobId.toString() === jobId.toString()
    );
    if (!alreadyAppliedInStudent) {
      student.appliedJobs.push({
        jobId: jobId,
        status: "applied",  // student-side status
        appliedOn: new Date(),
      });
      await student.save();
    }

    return res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply Job Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



// backend/controllers/jobController.js
export const getAllJobsForStudents = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })  // only active jobs
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// Get all applications made by the logged-in student
export const getMyApplications = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Find all jobs where the applications array contains this student
    const jobs = await Job.find({ "applications.user": studentId })
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    // Map to include only the application info for this student
    const applications = jobs.map((job) => {
      const app = job.applications.find(a => a.user.toString() === studentId.toString());
      return {
        _id: app._id,
        job: {
          _id: job._id,
          title: job.title,
          description: job.description,
          location: job.location,
          stipend: job.stipend,
        },
        status: app.status,
        interviewDate: app.interviewDate,
        appliedOn: app.appliedOn,
      };
    });

    res.json(applications);
  } catch (err) {
    console.error("Get My Applications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
