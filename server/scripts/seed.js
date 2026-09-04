/**
 * GASGO Seed Script
 * Run with: node scripts/seed.js
 *
 * Creates:
 *  - 1 Admin user
 *  - 1 Shop Owner user + their shop
 *  - 1 Customer user
 *  - 5 Cylinder inventory items for the shop
 */

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Shop from "../models/shopModel.js";
import Cylinder from "../models/cylinderModel.js";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing demo data
  await User.deleteMany({ email: { $in: ["admin@gasgo.lk", "owner@gasgo.lk", "customer@gasgo.lk"] } });
  console.log("🗑  Cleared old demo users");

  // ── Admin ────────────────────────────────────────────────────────────────
  await User.create({
    name: "GasGo Admin",
    email: "admin@gasgo.lk",
    password: "Admin@123",
    phone: "0771234567",
    role: "ADMIN",
  });
  console.log("👑 Admin created: admin@gasgo.lk / Admin@123");

  // ── Shop Owner ───────────────────────────────────────────────────────────
  const owner = await User.create({
    name: "Kamal Perera",
    email: "owner@gasgo.lk",
    password: "Owner@123",
    phone: "0777654321",
    role: "SHOP_OWNER",
  });
  console.log("🏪 Shop Owner created: owner@gasgo.lk / Owner@123");

  // Clear existing demo shop
  await Shop.deleteMany({ ownerId: owner._id });

  const shop = await Shop.create({
    ownerId: owner._id,
    shopName: "GasGo Colombo Shop",
    contactNumber: "0112345678",
    address: "No. 42, Galle Road, Colombo 03",
    location: {
      type: "Point",
      coordinates: [79.8612, 6.9271], // Colombo [lng, lat]
    },
  });
  console.log(`🏬 Shop created: ${shop.shopName}`);

  // Clear existing cylinders for this shop
  await Cylinder.deleteMany({ shopId: shop._id });

  // ── Cylinders ────────────────────────────────────────────────────────────
  const cylinders = [
    {
      sizeKg: "5kg",
      gasType: "LPG",
      capacityLitres: 6.5,
      price: 2500,
      availableQuantity: 10,
      description: "Small domestic LPG cylinder",
    },
    {
      sizeKg: "9kg",
      gasType: "LPG",
      capacityLitres: 12.5,
      price: 4500,
      availableQuantity: 20,
      description: "Standard domestic LPG cylinder",
    },
    {
      sizeKg: "18kg",
      gasType: "LPG",
      capacityLitres: 25,
      price: 8000,
      availableQuantity: 5,
      description: "18 kg Forklift / commercial cylinder",
    },
    {
      sizeKg: "45kg",
      gasType: "LPG",
      capacityLitres: 62,
      price: 18000,
      availableQuantity: 3,
      description: "Industrial 45 kg cylinder",
    },
    {
      sizeKg: "90kg",
      gasType: "LPG",
      capacityLitres: 125,
      price: 35000,
      availableQuantity: 1,
      description: "Large commercial 90 kg cylinder",
    },
  ];

  for (const c of cylinders) {
    await Cylinder.create({ shopId: shop._id, ...c });
    console.log(`  🛢  ${c.sizeKg} ${c.gasType} — Qty: ${c.availableQuantity}`);
  }

  // ── Customer ─────────────────────────────────────────────────────────────
  await User.create({
    name: "Nimal Silva",
    email: "customer@gasgo.lk",
    password: "Customer@123",
    phone: "0712223344",
    role: "CUSTOMER",
  });
  console.log("👤 Customer created: customer@gasgo.lk / Customer@123");

  console.log("\n✅ Seed complete!\n");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
