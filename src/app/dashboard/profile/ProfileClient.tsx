"use client";
import { useState } from "react";

export default function ProfileClient({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <p style={{ fontSize: 16, fontWeight: 500, fontFamily: "monospace" }}>{referralCode}</p>
      <button
        onClick={handleCopy}
        className="btn btn-outline"
        style={{ padding: "8px 16px", fontSize: 14 }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
