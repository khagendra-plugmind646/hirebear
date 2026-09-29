import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import BearIcon from "@/components/BearIcon";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div>
      <nav style={{ display: "flex", gap: 24, padding: "16px 32px", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
        <Link href="/admin" style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          <BearIcon size={20} />
          HIREBEAR Admin
        </Link>
        <Link href="/admin/products" style={{ color: "var(--sub)", fontSize: 14.5 }}>Products</Link>
        <Link href="/admin/orders" style={{ color: "var(--sub)", fontSize: 14.5 }}>Orders</Link>
        <Link href="/admin/referrals" style={{ color: "var(--sub)", fontSize: 14.5 }}>Referrals</Link>
      </nav>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>{children}</div>
    </div>
  );
}
