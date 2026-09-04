import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load environment variables from .env
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const adminEmail = "admin@gasgo.lk";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists. Checking role...");
      if (existingAdmin.role !== "ADMIN") {
        existingAdmin.role = "ADMIN";
        await existingAdmin.save();
        console.log("Updated existing user to ADMIN role.");
      } else {
        console.log("Admin account is fully configured.");
      }
    } else {
      console.log("Creating default admin account...");
      const newAdmin = await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: "Admin@123", // Pre-save hook will hash this
        phone: "0770000000",
        role: "ADMIN"
      });
      console.log("Admin account created successfully:", newAdmin.email);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
