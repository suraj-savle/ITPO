import User from "../models/UserModel.js";
import Application from "../models/ApplicationModel.js";

export const getMentees = async (req, res) => {
  try {
    const mentees = await User.find({ 
      role: "student", 
      assignedMentor: req.user.id,
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
    const { placed } = req.body;
    
    const student = await User.findOneAndUpdate(
      { 
        _id: req.params.studentId, 
        assignedMentor: req.user.id,
        role: "student"
      },
      { placed },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found or not assigned to you" });

    res.json({
      success: true,
      message: `Student marked as ${placed ? 'placed' : 'unplaced'}`,
      student: student.getPublicProfile()
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const totalMentees = await User.countDocuments({ 
      role: "student", 
      assignedMentor: req.user.id,
      status: "active"
    });
    
    const placedMentees = await User.countDocuments({ 
      role: "student", 
      assignedMentor: req.user.id,
      placed: true,
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