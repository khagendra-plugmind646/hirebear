import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Purchase from "@/models/Purchase";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyRazorpayWebhookSignature } from "@/services/PaymentService";
import { markReferralSuccessfulForOrder } from "@/services/ReferralService";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    console.log("Webhook received:", { signature: !!signature, bodyLength: rawBody.length });

    if (!signature) {
      console.error("Missing signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);

    console.log("Signature valid:", isValid);

    if (!isValid) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log("Webhook event:", event.event);

    // Handle payment.captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.receipt;

      console.log("Processing payment for order:", orderId);

      await connectDB();

      const order = await Order.findOne({ orderId });
      if (!order) {
        console.error("Order not found:", orderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      console.log("Order found:", order.orderId, "Current status:", order.status);

      // Update order status
      order.status = "PAID";
      order.paymentId = payment.id;
      await order.save();

      console.log("Order updated to PAID");

      // Check if purchase already exists
      const existingPurchase = await Purchase.findOne({ orderId: order._id });
      if (existingPurchase) {
        console.log("Purchase already exists, skipping creation");
        return NextResponse.json({ status: "ok" });
      }

      // Create purchase record
      const product = await Product.findById(order.productId);
      const user = await User.findById(order.userId);

      if (product && user) {
        const purchase = await Purchase.create({
          userId: user._id,
          productId: product._id,
          databaseId: product.databaseId,
          orderId: order._id,
          status: "ACTIVE",
          purchaseDate: new Date(),
        });
        console.log("Purchase created:", purchase._id);

        // Mark referral as successful if this user was referred
        await markReferralSuccessfulForOrder(user._id.toString(), order._id.toString());
        console.log("Referral status updated for user:", user._id.toString());
      } else {
        console.error("Product or user not found");
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
