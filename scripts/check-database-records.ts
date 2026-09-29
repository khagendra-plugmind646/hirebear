/**
 * Run with: npx tsx scripts/check-database-records.ts
 *
 * This script checks the database records and recruiter records to debug
 * why the database viewer is not working.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Database from "../src/models/Database";
import RecruiterRecord from "../src/models/RecruiterRecord";
import Purchase from "../src/models/Purchase";
import Product from "../src/models/Product";

// Ensure models are registered
import "../src/models/User";
import "../src/models/Order";

dotenv.config({ path: ".env.local" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  console.log("=== DATABASE STATUS ===");
  const databases = await Database.find().lean();
  console.log(`Total databases: ${databases.length}`);
  databases.forEach((db: any) => {
    console.log(`Database: ${db.name}, ID: ${db._id}, Slug: ${db.slug}, Status: ${db.status}, RecordCount: ${db.recordCount}`);
  });

  console.log("\n=== RECRUITER RECORDS STATUS ===");
  const records = await RecruiterRecord.find().lean();
  console.log(`Total recruiter records: ${records.length}`);
  records.forEach((record: any) => {
    console.log(`Record: ${record.name}, DatabaseID: ${record.databaseId}, Active: ${record.active}`);
  });

  console.log("\n=== PURCHASE DATABASE MAPPING ===");
  const purchases = await Purchase.find()
    .populate("productId")
    .populate("databaseId")
    .lean();
  console.log(`Total purchases: ${purchases.length}`);
  purchases.forEach((purchase: any) => {
    console.log(`Purchase: Product: ${purchase.productId?.name}, DatabaseID: ${purchase.databaseId?._id}, DatabaseName: ${purchase.databaseId?.name}`);
  });

  console.log("\n=== PRODUCT DATABASE MAPPING ===");
  const products = await Product.find()
    .populate("databaseId")
    .lean();
  console.log(`Total products: ${products.length}`);
  products.forEach((product: any) => {
    console.log(`Product: ${product.name}, DatabaseID: ${product.databaseId?._id}, DatabaseName: ${product.databaseId?.name}`);
  });

  await mongoose.disconnect();
}

main();
