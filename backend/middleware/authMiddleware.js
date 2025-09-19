import jwt from "jsonwebtoken";
import Student from "../models/StudentModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach student to request
      req.student = await Student.findById(decoded.id).select("-password");

      if (!req.student) {
        return res.status(404).json({ message: "Student not found" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, not authorized" });
  }
};
