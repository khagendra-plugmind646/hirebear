"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BearIcon from "@/components/BearIcon";
import { Suspense } from "react";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const referralCode = params.get("ref") || undefined;

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", referralCode: referralCode || "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, referralCode: form.referralCode || undefined }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not create account. Try a different email.");
      return;
    }
    router.push("/login");
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          <BearIcon size={24} />
          <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}>Create your account</h1>
        </div>
        {error && <p style={{ color: "#B42318", fontSize: 14, marginBottom: 12 }}>{error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <input className="input" placeholder="Full name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" required minLength={8}
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input className="input" type="password" placeholder="Confirm password" required
            value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          <input className="input" placeholder="Referral code (optional)"
            value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--sub)", marginTop: 16 }}>
          Already have an account? <Link href="/login" style={{ fontWeight: 600, color: "var(--ink)" }}>Login</Link>
        </p>
      </form>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
