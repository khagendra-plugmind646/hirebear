"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function RazorpayCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/checkout/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: params.product }),
    });

    if (!res.ok) {
      setLoading(false);
      if (res.status === 401) {
        router.push(`/login?next=/checkout/razorpay/${params.product}`);
        return;
      }
      const data = await res.json();
      setError(data.error || "Could not start checkout. Please try again.");
      return;
    }

    const { orderId, razorpayOrderId, amount, currency, keyId } = await res.json();

    const options = {
      key: keyId,
      amount: amount,
      currency: currency,
      name: "HireBear",
      description: `${params.product} Recruiter Database`,
      order_id: razorpayOrderId,
      handler: function (response: any) {
        // Payment successful - redirect to success page
        router.push(`/payment/success?order_id=${orderId}`);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      router.push(`/payment/failed?order_id=${orderId}`);
    });
    rzp.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <main style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>
        <div className="card" style={{ width: "100%", maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Order Summary</h1>
          <p style={{ color: "var(--sub)", marginBottom: 24, textTransform: "capitalize" }}>
            {params.product} Recruiter Database
          </p>
          {error && <p style={{ color: "#B42318", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handlePay} disabled={loading}>
            {loading ? "Starting checkout…" : "Pay with Razorpay"}
          </button>
          <p style={{ fontSize: 12.5, color: "var(--sub)", marginTop: 14, textAlign: "center" }}>
            Payment is processed securely by Razorpay. Your order is only marked paid after
            server-side verification of Razorpay's webhook.
          </p>
        </div>
      </main>
    </>
  );
}
