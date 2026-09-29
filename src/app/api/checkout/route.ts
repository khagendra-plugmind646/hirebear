import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { createCashfreeOrder } from "@/services/PaymentService";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { productSlug } = await req.json();
  await connectDB();

  const product = await Product.findOne({ slug: productSlug, active: true });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const user = await User.findById((session.user as any).id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const orderId = `HB-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const order = await Order.create({
    orderId,
    userId: user._id,
    productId: product._id,
    amount: product.price,
    currency: product.currency,
    status: "PENDING",
  });

  const cashfreeOrder = await createCashfreeOrder({
    orderId: order.orderId,
    amount: product.price,
    customerId: user._id.toString(),
    customerEmail: user.email,
    customerPhone: user.phone || "9999999999",
  });

  return NextResponse.json({
    orderId: order.orderId,
    paymentSessionId: cashfreeOrder.payment_session_id,
  });
}
