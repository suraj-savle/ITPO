import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/UserModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Admin",
      email: "admin@itpo.com",
      password: "admin123",
      role: "admin",
      status: "active"
    });

    await admin.save();
    console.log("Admin created successfully");
    console.log("Email: admin@itpo.com");
    console.log("Password: admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();