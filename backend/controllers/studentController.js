import User from "../models/UserModel.js";

export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
      .populate('assignedMentor', 'name email department')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'year', 'cgpa', 'description', 'skills', 
      'socialLinks', 'projects', 'experiences', 'course', 'specialization', 'backlogs'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const student = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: student
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
