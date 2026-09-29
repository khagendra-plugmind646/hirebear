"use client";
import { useState } from "react";

type Product = { _id: string; name: string };
type Config = { requiredReferrals: number; rewardProductId: string; campaignActive: boolean };

export default function ReferralConfigForm({ config, products }: { config: Config | null; products: Product[] }) {
  const [form, setForm] = useState<Config>(
    config || { requiredReferrals: 5, rewardProductId: products[0]?._id || "", campaignActive: true }
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/referral-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  return (
    <div className="card">
      <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Campaign settings</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        <label style={{ fontSize: 13.5, color: "var(--sub)" }}>
          Required referrals
          <input className="input" type="number" style={{ marginTop: 4 }}
            value={form.requiredReferrals}
            onChange={(e) => setForm({ ...form, requiredReferrals: Number(e.target.value) })} />
        </label>
        <label style={{ fontSize: 13.5, color: "var(--sub)" }}>
          Reward product
          <select className="input" style={{ marginTop: 4 }}
            value={form.rewardProductId}
            onChange={(e) => setForm({ ...form, rewardProductId: e.target.value })}>
            {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <input type="checkbox" checked={form.campaignActive}
            onChange={(e) => setForm({ ...form, campaignActive: e.target.checked })} />
          Campaign active
        </label>
      </div>
      <button className="btn btn-primary" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </button>
      {saved && <span style={{ marginLeft: 10, fontSize: 13, color: "#1a7f37" }}>Saved.</span>}
    </div>
  );
}
