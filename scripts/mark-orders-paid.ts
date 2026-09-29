/**
 * Run with: npx tsx scripts/mark-orders-paid.ts
 *
 * This script finds all orders without purchase records and creates
 * the corresponding purchase records. Useful for testing without making
 * actual payments.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "../src/models/Order";
import Purchase from "../src/models/Purchase";
import Product from "../src/models/Product";
import User from "../src/models/User";
import Database from "../src/models/Database";

// Ensure models are registered
import "../src/models/RecruiterRecord";

dotenv.config({ path: ".env.local" });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI as string);

  console.log("Finding all orders without purchases...");

  // Find all orders that don't have a corresponding purchase
  const allOrders = await Order.find().lean();
  const orderIds = allOrders.map(o => o._id);
  const existingPurchases = await Purchase.find({ orderId: { $in: orderIds } }).lean();
  const existingOrderIds = new Set(existingPurchases.map(p => p.orderId.toString()));

  const ordersWithoutPurchases = allOrders.filter((order: any) => !existingOrderIds.has(order._id.toString()));

  console.log(`Found ${ordersWithoutPurchases.length} orders without purchases`);

  let successCount = 0;
  let errorCount = 0;

  for (const order of ordersWithoutPurchases as any[]) {
    try {
      console.log(`Processing order: ${order.orderId} (Status: ${order.status})`);

      // Update order status to PAID if it's not already
      if (order.status !== "PAID") {
        await Order.findByIdAndUpdate(order._id, { status: "PAID" });
        console.log(`  → Order status updated to PAID`);
      }

      // Get the product to find the databaseId
      const product = await Product.findById(order.productId);
      if (!product) {
        console.error(`  → Product not found for order ${order.orderId}`);
        errorCount++;
        continue;
      }

      // Create purchase record with all required fields
      const purchase = await Purchase.create({
        userId: order.userId,
        productId: order.productId,
        databaseId: product.databaseId,
        orderId: order._id,
        amount: order.amount,
        currency: order.currency,
        purchaseDate: new Date(),
      });

      console.log(`  → Purchase created: ${purchase._id}`);
      successCount++;
    } catch (error) {
      console.error(`  → Error processing order ${order.orderId}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✅ Successfully processed ${successCount} orders`);
  console.log(`❌ Failed to process ${errorCount} orders`);

  await mongoose.disconnect();
}

main();
