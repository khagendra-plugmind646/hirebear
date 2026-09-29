/**
 * Run with: npx tsx scripts/seed.ts
 *
 * This script creates the initial database structure with:
 * 1. Database entities (representing the actual data collections)
 * 2. Product entities (what customers buy)
 * 3. Sample recruiter records for testing
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../src/models/Product";
import Database from "../src/models/Database";
import RecruiterRecord from "../src/models/RecruiterRecord";

dotenv.config({ path: ".env.local" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Create Database entities
  const basicDatabase = await Database.findOneAndUpdate(
    { slug: "basic-database" },
    {
      name: "Basic Recruiter Database",
      slug: "basic-database",
      description: "30+ verified recruiter contacts for job seekers",
      recordCount: 30,
      status: "active",
      version: "1.0",
    },
    { upsert: true, new: true }
  );

  const standardDatabase = await Database.findOneAndUpdate(
    { slug: "standard-database" },
    {
      name: "Standard Recruiter Database",
      slug: "standard-database",
      description: "100+ verified recruiter contacts for job seekers",
      recordCount: 100,
      status: "active",
      version: "1.0",
    },
    { upsert: true, new: true }
  );

  // Create Product entities linked to databases
  await Product.findOneAndUpdate(
    { slug: "basic" },
    {
      name: "Basic",
      slug: "basic",
      description: "30+ recruiter contacts",
      price: 299,
      contactCount: 30,
      databaseId: basicDatabase._id,
      filePath: "products/basic-database.xlsx",
      type: "database",
      status: "active",
      displayOrder: 1,
    },
    { upsert: true }
  );

  await Product.findOneAndUpdate(
    { slug: "standard" },
    {
      name: "Standard",
      slug: "standard",
      description: "100+ recruiter contacts",
      price: 499,
      contactCount: 100,
      databaseId: standardDatabase._id,
      filePath: "products/standard-database.xlsx",
      type: "database",
      status: "active",
      displayOrder: 2,
    },
    { upsert: true }
  );

  // Create sample recruiter records for testing
  const sampleRecords = [
    {
      databaseId: basicDatabase._id,
      name: "Alex Sharma",
      companyName: "Example Corp",
      jobTitle: "Talent Acquisition",
      location: "Gurgaon",
      email: "alex@example.com",
      phone: "+91-9876543210",
      linkedinUrl: "https://linkedin.com/in/alexsharma",
      companyWebsite: "https://example.com",
      active: true,
    },
    {
      databaseId: basicDatabase._id,
      name: "Riya Mehta",
      companyName: "Demo Labs",
      jobTitle: "Recruiter",
      location: "Bangalore",
      email: "riya@demolabs.com",
      phone: "+91-9876543211",
      linkedinUrl: "https://linkedin.com/in/riyamehta",
      companyWebsite: "https://demolabs.com",
      active: true,
    },
    {
      databaseId: basicDatabase._id,
      name: "Vikram Singh",
      companyName: "Tech Start",
      jobTitle: "HR Manager",
      location: "Mumbai",
      email: "vikram@techstart.com",
      phone: "+91-9876543212",
      linkedinUrl: "https://linkedin.com/in/vikram singh",
      companyWebsite: "https://techstart.com",
      active: true,
    },
  ];

  // Clear existing sample records and add new ones
  await RecruiterRecord.deleteMany({ databaseId: basicDatabase._id });
  await RecruiterRecord.insertMany(sampleRecords);

  // Update database record count
  basicDatabase.recordCount = await RecruiterRecord.countDocuments({ databaseId: basicDatabase._id });
  await basicDatabase.save();

  console.log("Seeded Basic and Standard products with databases and sample records.");
  await mongoose.disconnect();
}

main();
