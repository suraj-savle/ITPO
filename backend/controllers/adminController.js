import User from "../models/UserModel.js";
import Job from "../models/JobModel.js";
import Application from "../models/ApplicationModel.js";

export const getDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const placedStudents = await User.countDocuments({ role: "student", placed: true });
    const totalMentors = await User.countDocuments({ role: "mentor" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const pendingApprovals = await User.countDocuments({ status: "pending" });

    res.json({
      success: true,
      data: {
        totalStudents,
        placedStudents,
        unplacedStudents: totalStudents - placedStudents,
        totalMentors,
        totalRecruiters,
        pendingApprovals
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName, department } = req.body;

    if (!["mentor", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Can only create mentor or recruiter accounts" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const userData = {
      name,
      email,
      password,
      role,
      status: "active",
      createdBy: req.user.id
    };

    if (role === "recruiter") userData.companyName = companyName;
    if (role === "mentor") userData.department = department;

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
      user: user.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getPendingStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student", status: "pending" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const approveStudent = async (req, res) => {
  try {
    const { mentorId } = req.body;
    
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: "active",
        assignedMentor: mentorId || null
      },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({
      success: true,
      message: "Student approved successfully",
      student: student.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const rejectStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ success: true, message: "Student rejected and removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter)
      .select("-password")
      .populate('assignedMentor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("name email department");
    res.json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};