import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>
      <div className="card" style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Payment wasn't completed.</h1>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <Link href="/" className="btn btn-outline">Back to Databases</Link>
        </div>
      </div>
    </main>
  );
}
