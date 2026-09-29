/**
 * Run with: npx tsx scripts/import-excel-to-mongodb.ts
 *
 * This script imports Excel file data into the RecruiterRecord MongoDB collection
 * so the database viewer will work properly.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import * as xlsx from "xlsx";
// Ensure models are registered
import "../src/models/User";
import "../src/models/Order";
import "../src/models/Product";
import "../src/models/Database";
import "../src/models/RecruiterRecord";

import Database from "../src/models/Database";
import RecruiterRecord from "../src/models/RecruiterRecord";
import Product from "../src/models/Product";
import { getFileStorageService } from "../src/services/FileStorageService";

dotenv.config({ path: ".env.local" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  const storage = getFileStorageService();

  // Get all products with Excel files
  const products = await Product.find({ type: "database", status: "active" }).populate("databaseId");
  
  console.log(`Found ${products.length} products to process`);

  for (const product of products as any[]) {
    if (!product.filePath || !product.databaseId) {
      console.log(`Skipping ${product.name} - no file or database`);
      continue;
    }

    console.log(`\nProcessing ${product.name}...`);
    console.log(`File: ${product.filePath}`);
    console.log(`Database ID: ${product.databaseId._id}`);

    try {
      // Read Excel file from storage
      const fileBuffer = await storage.getFile(product.filePath);
      
      // Parse Excel file
      const workbook = xlsx.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      console.log(`Found ${jsonData.length} rows in Excel file`);

      if (jsonData.length === 0) {
        console.log("No data found in Excel file, skipping");
        continue;
      }

      // Clear existing records for this database
      await RecruiterRecord.deleteMany({ databaseId: product.databaseId._id });
      console.log("Cleared existing records");

      // Map Excel columns to RecruiterRecord schema
      const records = jsonData.map((row: any) => ({
        databaseId: product.databaseId._id,
        name: row.name || row.Name || row["Name"] || "Unknown",
        companyName: row.companyName || row.company || row.Company || row["Company"] || "Unknown",
        jobTitle: row.jobTitle || row.job || row.Job || row["Job Title"] || "Unknown",
        location: row.location || row.Location || row["Location"] || "Unknown",
        email: row.email || row.Email || row["Email"] || undefined,
        phone: row.phone || row.Phone || row["Phone"] || undefined,
        linkedinUrl: row.linkedinUrl || row.linkedin || row.LinkedIn || row["LinkedIn"] || undefined,
        companyWebsite: row.companyWebsite || row.website || row.Website || row["Website"] || undefined,
        active: true,
      }));

      // Insert records in batches
      const batchSize = 100;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await RecruiterRecord.insertMany(batch);
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} records)`);
      }

      // Update database record count
      const count = await RecruiterRecord.countDocuments({ databaseId: product.databaseId._id });
      product.databaseId.recordCount = count;
      await product.databaseId.save();

      console.log(`✅ Successfully imported ${count} records for ${product.name}`);
    } catch (error) {
      console.error(`❌ Error processing ${product.name}:`, error);
    }
  }

  console.log("\n=== Import complete ===");
  await mongoose.disconnect();
}

main();
