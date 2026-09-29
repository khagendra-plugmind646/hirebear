import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Purchase from "@/models/Purchase";
import User from "@/models/User";
import Product from "@/models/Product";
import { markReferralSuccessfulForOrder } from "@/services/ReferralService";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the order belongs to the current user
    if (order.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update order status
    order.status = "PAID";
    await order.save();

    // Check if purchase already exists
    const existingPurchase = await Purchase.findOne({ orderId: order._id });
    if (existingPurchase) {
      return NextResponse.json({ status: "ok", message: "Purchase already exists" });
    }

    // Create purchase record
    const product = await Product.findById(order.productId);
    const user = await User.findById(order.userId);

    if (product && user) {
      await Purchase.create({
        userId: user._id,
        productId: product._id,
        databaseId: product.databaseId,
        orderId: order._id,
        status: "ACTIVE",
        purchaseDate: new Date(),
      });

      // Mark referral as successful if this user was referred
      await markReferralSuccessfulForOrder(user._id.toString(), order._id.toString());
    }

    return NextResponse.json({ status: "ok", message: "Payment processed successfully" });
  } catch (error) {
    console.error("Manual payment success error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
