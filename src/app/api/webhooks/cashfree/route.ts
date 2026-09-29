import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Purchase from "@/models/Purchase";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyCashfreeWebhookSignature } from "@/services/PaymentService";
import { markReferralSuccessfulForOrder } from "@/services/ReferralService";
import { getEmailService } from "@/services/EmailService";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature") || "";
  const timestamp = req.headers.get("x-webhook-timestamp") || "";

  const valid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature);
  if (!valid) {
    // Never trust an unverified webhook — log and reject.
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const cfOrderId = payload?.data?.order?.order_id;
  const paymentStatus = payload?.data?.payment?.payment_status; // "SUCCESS" | "FAILED" | ...
  const paymentId = payload?.data?.payment?.cf_payment_id;

  await connectDB();
  const order = await Order.findOne({ orderId: cfOrderId });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (paymentStatus !== "SUCCESS") {
    order.status = "FAILED";
    await order.save();
    return NextResponse.json({ ok: true });
  }

  if (order.status === "PAID") {
    // Webhook delivered more than once — treat idempotently, do nothing further.
    return NextResponse.json({ ok: true });
  }

  order.status = "PAID";
  order.paymentId = paymentId;
  order.paidAt = new Date();
  await order.save();

  const product = await Product.findById(order.productId);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  await Purchase.create({
    userId: order.userId,
    productId: order.productId,
    databaseId: product.databaseId,
    orderId: order._id,
    status: "ACTIVE",
  });

  await markReferralSuccessfulForOrder(order.userId.toString(), order._id.toString());

  const user = await User.findById(order.userId);
  if (user && product) {
    await getEmailService().sendPurchaseConfirmation(user.email, user.name, product.name);
  }

  return NextResponse.json({ ok: true });
}
