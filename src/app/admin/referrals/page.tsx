import { connectDB } from "@/lib/db";
import { Referral } from "@/models/Referral";
import { getReferralConfig } from "@/models/ReferralConfig";
import Product from "@/models/Product";
import "@/models/User";
import ReferralConfigForm from "./ReferralConfigForm";

export default async function AdminReferralsPage() {
  await connectDB();

  const [signups, successful, invalid, config, products, topReferrersRaw] = await Promise.all([
    Referral.countDocuments(),
    Referral.countDocuments({ status: "SUCCESSFUL" }),
    Referral.countDocuments({ status: "INVALID" }),
    getReferralConfig(),
    Product.find({ active: true }).lean(),
    Referral.aggregate([
      { $match: { status: "SUCCESSFUL" } },
      { $group: { _id: "$referrerUserId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    ]),
  ]);

  const conversionRate = signups > 0 ? ((successful / signups) * 100).toFixed(1) : "0.0";
  const topReferrers = topReferrersRaw.map((r: any) => ({
    name: r.user[0]?.name || "Unknown",
    count: r.count,
  }));

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Referrals</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
        <Stat label="Signups via referral" value={signups} />
        <Stat label="Successful purchases" value={successful} />
        <Stat label="Conversion rate" value={`${conversionRate}%`} />
        <Stat label="Invalidated (refunded)" value={invalid} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Top referrers</h3>
          {topReferrers.length === 0 && <p style={{ color: "var(--sub)", fontSize: 14 }}>No conversions yet.</p>}
          {topReferrers.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
              <span>{r.name}</span>
              <span style={{ fontWeight: 700 }}>{r.count}</span>
            </div>
          ))}
        </div>

        <ReferralConfigForm
          config={JSON.parse(JSON.stringify(config))}
          products={JSON.parse(JSON.stringify(products))}
        />
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <p style={{ color: "var(--sub)", fontSize: 13, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800 }}>{value}</p>
    </div>
  );
}
