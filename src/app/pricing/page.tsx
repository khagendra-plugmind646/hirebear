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

export default async function PricingPage() {
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
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 12 }}>Simple, Transparent Pricing</h1>
          <p style={{ color: "var(--sub)", fontSize: 18 }}>
            One-time payment. No subscriptions. No hidden fees.
          </p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, maxWidth: 900, margin: "0 auto" }}>
          {products.map((p) => (
            <div key={p.slug} className="card" style={{ padding: 32, textAlign: "center" }}>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
              <p style={{ color: "var(--sub)", fontSize: 16, marginBottom: 24 }}>{p.contactCount}+ recruiter contacts</p>
              <p style={{ fontSize: 48, fontWeight: 800, marginBottom: 24 }}>₹{p.price}</p>
              <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>One-time payment</p>
              <Link href={`/checkout/razorpay/${p.slug}`} className="btn btn-primary" style={{ width: "100%", padding: "14px 28px" }}>
                Get {p.name}
              </Link>
            </div>
          ))}
          
          <div className="card" style={{ padding: 32, textAlign: "center", opacity: 0.7 }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Coming Soon</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, marginBottom: 24 }}>More options</p>
            <p style={{ fontSize: 48, fontWeight: 800, marginBottom: 24, color: "var(--sub)" }}>—</p>
            <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 32 }}>Pricing TBD</p>
            <button className="btn btn-outline" disabled style={{ width: "100%", padding: "14px 28px" }}>
              Notify Me
            </button>
          </div>
        </div>

        <div style={{ marginTop: 64, textAlign: "center" }}>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Frequently Asked Questions</h3>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Is this a subscription?</h4>
              <p style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.6 }}>
                No, all our databases are one-time purchases. You pay once and have lifetime access.
              </p>
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Can I download the data?</h4>
              <p style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.6 }}>
                For the initial version, data is viewable within your HIREBEAR account only. This ensures data security and quality.
              </p>
            </div>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>How do I access my database?</h4>
              <p style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.6 }}>
                After purchase, your database is instantly available in your dashboard. You can search, filter, and view recruiter contacts anytime.
              </p>
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Is the data verified?</h4>
              <p style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.6 }}>
                Yes, all recruiter contacts are verified and sourced from authorized channels. We only provide data we're legally permitted to share.
              </p>
            </div>
          </div>
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