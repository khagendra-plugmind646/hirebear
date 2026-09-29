import crypto from "crypto";
import Razorpay from "razorpay";

const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

/** Called from POST /api/checkout — creates the order on Cashfree's side. */
export async function createCashfreeOrder(params: {
  orderId: string;
  amount: number;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const res = await fetch(`${CASHFREE_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_APP_ID as string,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY as string,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify({
      order_id: params.orderId,
      order_amount: params.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: params.customerId,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
      },
      order_meta: {
        return_url: `${process.env.APP_URL}/payment/success?order_id={order_id}`,
        notify_url: `${process.env.APP_URL}/api/webhooks/cashfree`,
      },
    }),
  });

  if (!res.ok) throw new Error(`Cashfree order creation failed: ${await res.text()}`);
  return res.json(); // includes payment_session_id used by the Cashfree Checkout SDK on the client
}

/**
 * Verifies the webhook signature. NEVER mark an order PAID without this
 * passing — the frontend "success" redirect alone is not proof of payment.
 * Cashfree signs the raw request body with your webhook secret; compare
 * against the x-webhook-signature / x-webhook-timestamp headers per their
 * current webhook spec before trusting the payload.
 */
export function verifyCashfreeWebhookSignature(rawBody: string, timestamp: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.CASHFREE_WEBHOOK_SECRET as string)
    .update(timestamp + rawBody)
    .digest("base64");

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

/** Called from POST /api/checkout — creates the order on Razorpay's side. */
export async function createRazorpayOrder(params: {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const options = {
    amount: params.amount * 100, // Razorpay expects amount in paise
    currency: params.currency,
    receipt: params.orderId,
    notes: {
      customerId: params.customerId,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Razorpay order creation failed: ${error}`);
  }
}

/**
 * Verifies Razorpay webhook signature.
 * Razorpay uses HMAC SHA256 to sign the webhook payload.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
) {
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
}
