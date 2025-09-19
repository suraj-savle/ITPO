// controllers/studentController.js
export const getStudentProfile = async (req, res) => {
  try {
    if (!req.student) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.json(req.student);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
