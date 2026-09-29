/**
 * Run with: npx tsx scripts/add-standard-records.ts
 *
 * This script adds sample recruiter records for the Standard database
 * so the database viewer will work properly.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Database from "../src/models/Database";
import RecruiterRecord from "../src/models/RecruiterRecord";

// Ensure models are registered
import "../src/models/User";
import "../src/models/Order";

dotenv.config({ path: ".env.local" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Find the Standard database
  const standardDatabase = await Database.findOne({ slug: "standard-database" });
  if (!standardDatabase) {
    console.error("Standard database not found");
    await mongoose.disconnect();
    return;
  }

  console.log("Adding sample records to Standard database...");

  const sampleRecords = [
    {
      databaseId: standardDatabase._id,
      name: "Priya Patel",
      companyName: "Tech Solutions Inc",
      jobTitle: "Senior Recruiter",
      location: "Mumbai",
      email: "priya@techsolutions.com",
      phone: "+91-9876543220",
      linkedinUrl: "https://linkedin.com/in/priyapatel",
      companyWebsite: "https://techsolutions.com",
      active: true,
    },
    {
      databaseId: standardDatabase._id,
      name: "Amit Kumar",
      companyName: "Digital Innovations",
      jobTitle: "HR Manager",
      location: "Delhi",
      email: "amit@digitalinnovations.com",
      phone: "+91-9876543221",
      linkedinUrl: "https://linkedin.com/in/amitkumar",
      companyWebsite: "https://digitalinnovations.com",
      active: true,
    },
    {
      databaseId: standardDatabase._id,
      name: "Sneha Reddy",
      companyName: "Cloud Systems",
      jobTitle: "Talent Acquisition Lead",
      location: "Hyderabad",
      email: "sneha@cloudsystems.com",
      phone: "+91-9876543222",
      linkedinUrl: "https://linkedin.com/in/snehareddy",
      companyWebsite: "https://cloudsystems.com",
      active: true,
    },
    {
      databaseId: standardDatabase._id,
      name: "Rahul Verma",
      companyName: "Data Corp",
      jobTitle: "Technical Recruiter",
      location: "Bangalore",
      email: "rahul@datacorp.com",
      phone: "+91-9876543223",
      linkedinUrl: "https://linkedin.com/in/rahulverma",
      companyWebsite: "https://datacorp.com",
      active: true,
    },
    {
      databaseId: standardDatabase._id,
      name: "Neha Gupta",
      companyName: "AI Technologies",
      jobTitle: "HR Business Partner",
      location: "Pune",
      email: "neha@aitechnologies.com",
      phone: "+91-9876543224",
      linkedinUrl: "https://linkedin.com/in/nehagupta",
      companyWebsite: "https://aitechnologies.com",
      active: true,
    },
  ];

  // Clear existing records for Standard database
  await RecruiterRecord.deleteMany({ databaseId: standardDatabase._id });

  // Add new records
  await RecruiterRecord.insertMany(sampleRecords);

  // Update database record count
  standardDatabase.recordCount = await RecruiterRecord.countDocuments({ databaseId: standardDatabase._id });
  await standardDatabase.save();

  console.log(`Added ${sampleRecords.length} sample records to Standard database`);
  console.log(`Updated record count to ${standardDatabase.recordCount}`);

  await mongoose.disconnect();
}

main();
