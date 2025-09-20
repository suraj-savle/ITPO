import Job from "../models/JobModel.js";
import Application from "../models/ApplicationModel.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .populate('recruiterId', 'name companyName')
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, requirements, deadline, jobType } = req.body;

    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      requirements,
      deadline,
      jobType,
      recruiterId: req.user.id
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const applyForJob = async (req, res) => {
  try {
    console.log('Apply for job request:', {
      jobId: req.params.id,
      userId: req.user?._id,
      userRole: req.user?.role
    });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const jobId = req.params.id;
    const studentId = req.user._id;

    const existingApplication = await Application.findOne({ studentId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const application = new Application({
      studentId,
      jobId,
      status: 'applied'
    });

    await application.save();
    console.log('Application saved:', application);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    console.error('Job application error:', err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('jobId', 'title company location status')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};