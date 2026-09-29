import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BearIcon from "@/components/BearIcon";

async function getProducts(): Promise<IProduct[]> {
  await connectDB();
  const products = await Product.find({ status: "active", type: "database" }).sort({ displayOrder: 1, price: 1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function DatabasesPage() {
  const products = await getProducts();
  const session = await getServerSession(authOptions);

  return (
    <main>
      <nav style={navStyle}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
          <BearIcon size={20} />
          HIREBEAR
        </Link>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/databases" style={{ color: "var(--ink)", textDecoration: "none", fontSize: 15 }}>Databases</Link>
          <Link href="/how-it-works" style={{ color: "var(--ink)", textDecoration: "none", fontSize: 15 }}>How It Works</Link>
          <Link href="/pricing" style={{ color: "var(--ink)", textDecoration: "none", fontSize: 15 }}>Pricing</Link>
          <Link href="/faq" style={{ color: "var(--ink)", textDecoration: "none", fontSize: 15 }}>FAQ</Link>
          <div style={{ display: "flex", gap: 12, marginLeft: 16 }}>
            {session ? (
              <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn" style={{ backgroundColor: "white", color: "var(--ink)", border: "1px solid var(--line)" }}>Login</Link>
                <Link href="/signup" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 1000, margin: "80px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12 }}>Recruiter Databases</h1>
          <p style={{ color: "var(--sub)", fontSize: 18 }}>
            Choose the database that fits your job search needs
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          {products.map((p) => (
            <div key={p.slug} className="card" style={{ padding: 32, textAlign: "center" }}>
              <h3 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>{p.name}</h3>
              <p style={{ color: "var(--sub)", fontSize: 16, marginBottom: 8 }}>{p.description}</p>
              <p style={{ color: "var(--sub)", fontSize: 18, marginBottom: 24 }}>
                {p.contactCount}+ recruiter contacts
              </p>
              <p style={{ fontSize: 56, fontWeight: 800, marginBottom: 24 }}>₹{p.price}</p>
              <ul style={{ textAlign: "left", marginBottom: 32, color: "var(--sub)", fontSize: 15, lineHeight: 2 }}>
                <li>✓ Verified recruiter contacts</li>
                <li>✓ Company information</li>
                <li>✓ Job roles and titles</li>
                <li>✓ Location data</li>
                <li>✓ Professional contact info</li>
              </ul>
              <Link href={`/checkout/razorpay/${p.slug}`} className="btn btn-primary" style={{ width: "100%", padding: "14px 28px" }}>
                Get {p.name}
              </Link>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, textAlign: "center", padding: 32, backgroundColor: "var(--card)", borderRadius: 16, border: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Something extra coming soon 👀</h3>
          <p style={{ color: "var(--sub)", fontSize: 16, marginBottom: 24 }}>
            We're working on additional databases and features. Stay tuned!
          </p>
          <button className="btn btn-outline" disabled>
            Notify Me
          </button>
        </div>
      </section>
    </main>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 32px",
  borderBottom: "1px solid var(--line)",
};