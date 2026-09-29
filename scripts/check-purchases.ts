/**
 * Run with: npx tsx scripts/check-purchases.ts
 *
 * This script checks the current state of orders and purchases to debug
 * why databases aren't showing after successful payments.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "../src/models/Order";
import Purchase from "../src/models/Purchase";
import Product from "../src/models/Product";
import User from "../src/models/User";

// Ensure models are registered
import "../src/models/Database";
import "../src/models/RecruiterRecord";

dotenv.config({ path: ".env.local" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  console.log("=== ORDER STATUS ===");
  const orders = await Order.find().populate("productId").populate("userId").lean();
  console.log(`Total orders: ${orders.length}`);
  orders.forEach((order: any) => {
    console.log(`Order: ${order.orderId}, Status: ${order.status}, Product: ${order.productId?.name}, User: ${order.userId?.email}`);
  });

  console.log("\n=== PURCHASE STATUS ===");
  const purchases = await Purchase.find()
    .populate("productId")
    .populate("userId")
    .populate("orderId")
    .lean();
  console.log(`Total purchases: ${purchases.length}`);
  purchases.forEach((purchase: any) => {
    console.log(`Purchase: ${purchase._id}, Status: ${purchase.status}, Product: ${purchase.productId?.name}, User: ${purchase.userId?.email}, Order: ${purchase.orderId?.orderId}`);
  });

  console.log("\n=== PRODUCT STATUS ===");
  const products = await Product.find().lean();
  console.log(`Total products: ${products.length}`);
  products.forEach((product: any) => {
    console.log(`Product: ${product.name}, Slug: ${product.slug}, FilePath: ${product.filePath || 'NOT SET'}, Status: ${product.status}`);
  });

  console.log("\n=== USER STATUS ===");
  const users = await User.find().lean();
  console.log(`Total users: ${users.length}`);
  users.forEach((user: any) => {
    console.log(`User: ${user.email}, Name: ${user.name}`);
  });

  await mongoose.disconnect();
}

main();
