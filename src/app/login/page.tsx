"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BearIcon from "@/components/BearIcon";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "80px 24px" }}>
      <form onSubmit={handleSubmit} className="card" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          <BearIcon size={24} />
          <h1 style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}>Login</h1>
        </div>
        {error && <p style={{ color: "#B42318", fontSize: 14, marginBottom: 12 }}>{error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <input className="input" type="email" placeholder="Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--sub)", marginTop: 16 }}>
          <Link href="#" style={{ fontWeight: 600 }}>Forgot password?</Link> · <Link href="/signup" style={{ fontWeight: 600, color: "var(--ink)" }}>Create account</Link>
        </p>
      </form>
    </main>
  );
}
