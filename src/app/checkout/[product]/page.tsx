"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug: params.product }),
    });

    if (!res.ok) {
      setLoading(false);
      if (res.status === 401) {
        router.push(`/login?next=/checkout/${params.product}`);
        return;
      }
      setError("Could not start checkout. Please try again.");
      return;
    }

    const { paymentSessionId } = await res.json();

    // @ts-expect-error — loaded via the Cashfree SDK script tag below
    const cashfree = window.Cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox" });
    cashfree.checkout({ paymentSessionId, redirectTarget: "_self" });
  }

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <main style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>
        <div className="card" style={{ width: "100%", maxWidth: 420 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Order Summary</h1>
          <p style={{ color: "var(--sub)", marginBottom: 24, textTransform: "capitalize" }}>
            {params.product} Recruiter Database
          </p>
          {error && <p style={{ color: "#B42318", fontSize: 14, marginBottom: 12 }}>{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={handlePay} disabled={loading}>
            {loading ? "Starting checkout…" : "Pay now"}
          </button>
          <p style={{ fontSize: 12.5, color: "var(--sub)", marginTop: 14, textAlign: "center" }}>
            Payment is processed securely by Cashfree. Your order is only marked paid after
            server-side verification of Cashfree's webhook.
          </p>
        </div>
      </main>
    </>
  );
}
