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

    if (role === "recruiter") userData.company = companyName;
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
    
    // Get student details
    const student = await User.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    
    // If mentor is assigned, validate they are from the same department
    if (mentorId) {
      const mentor = await User.findOne({ 
        _id: mentorId, 
        role: "mentor", 
        department: student.department 
      });
      
      if (!mentor) {
        return res.status(400).json({ 
          message: "Mentor must be from the same department as the student" 
        });
      }
    }
    
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: "active",
        assignedMentor: mentorId || null
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Student approved successfully",
      student: updatedStudent.getPublicProfile()
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
    const { department } = req.query;
    const filter = { role: "mentor" };
    
    if (department) {
      filter.department = department;
    }
    
    const mentors = await User.find(filter).select("name email department");
    res.json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const assignMentorToStudent = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    
    const student = await User.findByIdAndUpdate(
      studentId,
      { assignedMentor: mentorId },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json({
      success: true,
      message: "Mentor assigned successfully",
      student: student.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }
    
    // Delete related data
    if (user.role === 'student') {
      await Application.deleteMany({ student: userId });
    } else if (user.role === 'mentor') {
      await Application.deleteMany({ mentor: userId });
      await User.updateMany({ assignedMentor: userId }, { $unset: { assignedMentor: 1 } });
    } else if (user.role === 'recruiter') {
      await Job.deleteMany({ recruiter: userId });
      await Application.deleteMany({ recruiter: userId });
    }
    
    await User.findByIdAndDelete(userId);
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getUserActivities = async (req, res) => {
  try {
    const { role, limit = 50 } = req.query;
    const filter = role ? { role } : { role: { $in: ['student', 'mentor', 'recruiter'] } };
    
    const users = await User.find(filter)
      .select('name email role activityLog lastLogin status')
      .sort({ 'activityLog.date': -1 })
      .limit(parseInt(limit));
    
    const activities = [];
    users.forEach(user => {
      user.activityLog.forEach(activity => {
        activities.push({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          action: activity.action,
          date: activity.date,
          status: user.status
        });
      });
    });
    
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ success: true, activities: activities.slice(0, parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getUsersStatus = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : { role: { $in: ['student', 'mentor', 'recruiter'] } };
    
    const users = await User.find(filter)
      .select('name email role status lastLogin isActive profileCompletion reputationPoints assignedMentor')
      .populate('assignedMentor', 'name')
      .sort({ lastLogin: -1 });
    
    const statusSummary = {
      active: users.filter(u => u.status === 'active').length,
      pending: users.filter(u => u.status === 'pending').length,
      recentlyActive: users.filter(u => u.lastLogin && new Date() - new Date(u.lastLogin) < 7 * 24 * 60 * 60 * 1000).length
    };
    
    res.json({ success: true, users, statusSummary });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};