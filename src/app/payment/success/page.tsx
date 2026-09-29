"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState<"loading" | "success" | "confirming">("loading");

  useEffect(() => {
    async function confirmPayment() {
      if (!orderId) {
        setStatus("confirming");
        return;
      }

      try {
        // Try to confirm payment via API
        const res = await fetch("/api/payment/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("confirming");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setStatus("confirming");
      }
    }

    confirmPayment();
  }, [orderId]);

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        {status === "loading" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Processing payment…</h1>
            <p style={{ color: "var(--sub)", marginBottom: 24 }}>
              Please wait while we confirm your payment.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Payment successful 🎉</h1>
            <p style={{ color: "var(--sub)", marginBottom: 24 }}>
              Your database has been added to your HIREBEAR account.
            </p>
          </>
        )}
        {status === "confirming" && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Confirming your payment…</h1>
            <p style={{ color: "var(--sub)", marginBottom: 24 }}>
              This can take a few seconds while we verify with Razorpay. Refresh in a moment, or check
              your dashboard shortly.
            </p>
          </>
        )}
        <Link href="/dashboard/databases" className="btn btn-primary" style={{ width: "100%" }}>
          Go to My Databases
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
