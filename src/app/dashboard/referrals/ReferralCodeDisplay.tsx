"use client";
import { useState } from "react";

export default function ReferralCodeDisplay({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 14, color: "var(--sub)", marginBottom: 8 }}>Your referral code</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" readOnly value={referralCode} style={{ flex: 1, fontSize: 16, fontWeight: 600, textTransform: "uppercase" }} />
        <button className="btn btn-outline" onClick={handleCopy}>{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
  );
}
