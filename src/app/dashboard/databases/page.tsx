import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import "@/models/Product"; // ensure schema registered for populate
import "@/models/Database"; // ensure schema registered for populate
import { getFileStorageService } from "@/services/FileStorageService";
import Link from "next/link";

export default async function MyDatabasesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const purchases = await Purchase.find({ userId: (session.user as any).id, status: "ACTIVE" })
    .populate("productId")
    .populate("databaseId")
    .lean();

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
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Your Databases</h1>
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
        {purchasesWithLinks.length === 0 && <p style={{ color: "var(--sub)" }}>No purchases yet.</p>}
      </div>
    </main>
  );
}
