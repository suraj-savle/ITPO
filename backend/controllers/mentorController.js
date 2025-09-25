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
    const totalMentees = await User.countDocuments({ 
      role: "student", 
      assignedMentor: req.user._id,
      status: "active"
    });
    
    const placedMentees = await User.countDocuments({ 
      role: "student", 
      assignedMentor: req.user._id,
      isPlaced: true,
      status: "active"
    });

    res.json({
      success: true,
      data: {
        totalMentees,
        placedMentees,
        unplacedMentees: totalMentees - placedMentees
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};