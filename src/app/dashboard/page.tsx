import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Order from "@/models/Order";
import { RewardStatusModel } from "@/models/Referral";
import Link from "next/link";
import "@/models/Product"; // ensure schema registered for populate
import "@/models/Database"; // ensure schema registered for populate
import { getFileStorageService } from "@/services/FileStorageService";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const userId = (session.user as any).id;

  const [purchaseCount, orderCount, reward, purchases] = await Promise.all([
    Purchase.countDocuments({ userId, status: "ACTIVE" }),
    Order.countDocuments({ userId }),
    RewardStatusModel.findOne({ userId }).lean(),
    Purchase.find({ userId, status: "ACTIVE" })
      .populate("productId")
      .populate("databaseId")
      .lean(),
  ]);

  const storage = getFileStorageService();

  // Generate download links for each purchase
  const purchasesWithLinks = await Promise.all(
    purchases.map(async (p: any) => ({
      ...p,
      downloadLink: p.productId?.filePath
        ? await storage.createTemporaryDownload(p.productId.filePath, 3600)
        : null,
    }))
  );

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>
        Welcome back, {session.user?.name?.split(" ")[0]}.
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
        <Stat label="Your Databases" value={purchaseCount} />
        <Stat label="Orders" value={orderCount} />
        <Stat label="Successful Referrals" value={`${(reward as any)?.successfulReferrals ?? 0} / ${(reward as any)?.requiredReferrals ?? 5}`} />
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
        <Link href="/dashboard/databases" className="btn btn-primary">My Databases</Link>
        <Link href="/dashboard/orders" className="btn btn-outline">Orders</Link>
        <Link href="/dashboard/referrals" className="btn btn-outline">Refer & Earn</Link>
        <Link href="/dashboard/profile" className="btn btn-outline">Profile</Link>
      </div>

      {/* Show purchased databases directly on dashboard */}
      {purchasesWithLinks.length > 0 && (
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Your Databases</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {purchasesWithLinks.map((p: any) => (
              <div key={p._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 700 }}>{p.productId?.name} Recruiter Database</p>
                  <p style={{ color: "var(--sub)", fontSize: 13.5 }}>
                    {p.productId?.contactCount}+ contacts · Purchased {new Date(p.purchaseDate).toLocaleDateString()} · Active
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Temporarily disabled download excel option
                  {p.downloadLink && (
                    <a
                      href={p.downloadLink}
                      className="btn btn-outline"
                      style={{ textDecoration: "none" }}
                    >
                      Download Excel
                    </a>
                  )} */}
                  <Link
                    href={`/dashboard/databases/${p.databaseId?._id}`}
                    className="btn btn-primary"
                  >
                    View Database
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {purchasesWithLinks.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p style={{ color: "var(--sub)", marginBottom: 16 }}>You haven't purchased any databases yet.</p>
          <Link href="/pricing" className="btn btn-primary">Browse Databases</Link>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <p style={{ color: "var(--sub)", fontSize: 13.5, marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 800 }}>{value}</p>
    </div>
  );
}
