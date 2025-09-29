import User from "../models/UserModel.js";
import Application from "../models/ApplicationModel.js";

export const testMentor = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getMentees = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const mentees = await User.find({ 
      role: "student", 
      assignedMentor: req.user._id,
      status: "active"
    }).select("-password");
    
    res.json({ success: true, mentees });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getMenteeApplications = async (req, res) => {
  try {
    const applications = await Application.find({ 
      studentId: req.params.studentId 
    })
    .populate('jobId', 'title company location')
    .populate('studentId', 'name email')
    .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updatePlacementStatus = async (req, res) => {
  try {
    const { isPlaced, placementDetails } = req.body;
    
    const updateData = { isPlaced };
    if (placementDetails) {
      updateData.placementDetails = placementDetails;
    }
    
    const student = await User.findOneAndUpdate(
      { 
        _id: req.params.studentId, 
        assignedMentor: req.user._id,
        role: "student"
      },
      updateData,
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found or not assigned to you" });

    res.json({
      success: true,
      message: `Student marked as ${isPlaced ? 'placed' : 'unplaced'}`,
      student: student.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.find({ status: "pending mentor approval" })
      .populate('student', 'name email department year rollNo assignedMentor profileImage')
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    // Filter applications from students assigned to this mentor
    const mentorApplications = applications.filter(app => 
      app.student && 
      app.student.assignedMentor && 
      app.student.assignedMentor.toString() === req.user._id.toString()
    );

    res.json(mentorApplications);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getProgressTracking = async (req, res) => {
  try {
    const mentees = await User.find({ 
      role: "student", 
      assignedMentor: req.user._id,
      status: "active"
    }).select("-password");

    const progressData = mentees.map(mentee => ({
      _id: mentee._id,
      name: mentee.name,
      email: mentee.email,
      department: mentee.department,
      year: mentee.year,
      rollNo: mentee.rollNo,
      cgpa: mentee.cgpa,
      isPlaced: mentee.isPlaced || false,
      placementDetails: mentee.placementDetails || {},
      profileImage: mentee.profileImage,
      applications: [],
      totalApplications: 0,
      interviews: 0,
      offers: 0
    }));

    res.json({ success: true, students: progressData });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    // Get mentor's students
    const students = await User.find({ 
      role: "student", 
      assignedMentor: req.user._id,
      status: "active"
    }).select("-password");

    // Get pending applications from mentor's students
    const pendingApplications = await Application.find({ 
      status: "pending mentor approval",
      student: { $in: students.map(s => s._id) }
    })
    .populate('student', 'name email department year rollNo profileImage')
    .populate('job', 'title company location')
    .sort({ createdAt: -1 });

    // Get recent applications (last 10)
    const recentApplications = await Application.find({ 
      student: { $in: students.map(s => s._id) }
    })
    .populate('student', 'name email')
    .populate('job', 'title company')
    .sort({ createdAt: -1 })
    .limit(10);

    // Calculate stats
    const totalStudents = students.length;
    const pendingApprovals = pendingApplications.length;
    
    // Count approvals today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const approvedToday = await Application.countDocuments({
      student: { $in: students.map(s => s._id) },
      status: "approved by mentor",
      updatedAt: { $gte: today }
    });

    const completedInternships = students.filter(s => s.isPlaced).length;

    res.json({
      pendingApplications,
      recentApplications,
      students,
      notifications: [], // TODO: Implement notifications
      stats: {
        totalStudents,
        pendingApprovals,
        approvedToday,
        completedInternships
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('student', 'assignedMentor');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if this mentor is assigned to the student
    if (application.student.assignedMentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to approve this application" });
    }

    application.status = "pending recruiter review";
    application.mentorApprovedAt = new Date();
    await application.save();

    res.json({ message: "Application approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const rejectApplication = async (req, res) => {
  try {
    const { feedback } = req.body;
    const application = await Application.findById(req.params.applicationId)
      .populate('student', 'assignedMentor');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if this mentor is assigned to the student
    if (application.student.assignedMentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reject this application" });
    }

    application.status = "rejected by mentor";
    application.mentorFeedback = feedback;
    application.rejectedAt = new Date();
    await application.save();

    res.json({ message: "Application rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.studentId,
      role: "student",
      assignedMentor: req.user._id
    }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found or not assigned to you" });
    }

    // Get student's applications
    const applications = await Application.find({ student: student._id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    res.json({
      ...student.toObject(),
      applications
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};