import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BearIcon from "@/components/BearIcon";

async function getProducts(): Promise<IProduct[]> {
  await connectDB();
  const products = await Product.find({ status: "active" }).sort({ displayOrder: 1, price: 1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
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
              <>
                <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn" style={{ backgroundColor: "white", color: "var(--ink)", border: "1px solid var(--line)" }}>Login</Link>
                <Link href="/signup" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "120px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: 8,
          padding: "8px 16px", 
          backgroundColor: "#FFF3E0", 
          color: "var(--ink)", 
          borderRadius: 20, 
          fontSize: 14, 
          fontWeight: 500, 
          marginBottom: 32 
        }}>
          <span style={{ width: 8, height: 8, backgroundColor: "var(--accent)", borderRadius: "50%" }}></span>
          Recruiter databases for job seekers
        </div>
        <h1 style={{ fontSize: "clamp(48px,5vw,64px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.1 }}>
          Get closer to your next opportunity.
        </h1>
        <p style={{ color: "var(--sub)", fontSize: 18, marginBottom: 40, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 40px" }}>
          Curated recruiter contacts in a simple, ready-to-use database. Find the right people and start better conversations.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/databases" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>
            Browse Databases
          </Link>
          <Link href="/how-it-works" className="btn" style={{ padding: "16px 32px", fontSize: 16, backgroundColor: "white", border: "1px solid var(--line)", color: "var(--ink)" }}>
            How it works →
          </Link>
        </div>
      </section>

      {/* Database Preview */}
      <section style={{ maxWidth: 900, margin: "0 auto 80px", padding: "0 24px" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden", borderRadius: 16 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line)", backgroundColor: "#FAFAF8" }}>
                  <th style={{ padding: 16, textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--sub)" }}>Name</th>
                  <th style={{ padding: 16, textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--sub)" }}>Company</th>
                  <th style={{ padding: 16, textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--sub)" }}>Role</th>
                  <th style={{ padding: 16, textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--sub)" }}>Location</th>
                  <th style={{ padding: 16, textAlign: "left", fontWeight: 600, fontSize: 13, color: "var(--sub)" }}>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, fontSize: 14, fontWeight: 500 }}>Alex Sharma</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Example Corp</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Talent Acquisition</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Gurgaon</td>
                  <td style={{ padding: 16, fontSize: 14, color: "var(--sub)" }}>alex@example.com</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, fontSize: 14, fontWeight: 500 }}>Riya Mehta</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Demo Labs</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Recruiter</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Bangalore</td>
                  <td style={{ padding: 16, fontSize: 14, color: "var(--sub)" }}>riya@example.com</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: 16, fontSize: 14, fontWeight: 500 }}>Sana Iyer</td>
                  <td style={{ padding: 16, fontSize: 14 }}>North Peak Inc</td>
                  <td style={{ padding: 16, fontSize: 14 }}>HR Manager</td>
                  <td style={{ padding: 16, fontSize: 14 }}>Pune</td>
                  <td style={{ padding: 16, fontSize: 14, color: "var(--sub)" }}>sana@example.com</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ padding: 12, backgroundColor: "#FAFAF8", fontSize: 12, color: "var(--sub)", textAlign: "right" }}>
            Sample data
          </div>
        </div>
      </section>

      {/* Trust Message */}
      <section style={{ textAlign: "center", padding: "60px 24px", maxWidth: 700, margin: "0 auto 80px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>One-time purchase. No subscription.</h2>
        <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
          Buy the database you need and access your purchase from your HIREBEAR account anytime.
        </p>
      </section>

      {/* Product Section */}
      <section style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Choose your database</h2>
          <p style={{ color: "var(--sub)", fontSize: 18 }}>Simple plans. One-time payment.</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32, maxWidth: 800, margin: "0 auto" }}>
          {products.filter(p => p.type === "database").map((p, index) => (
            <div key={p.slug} className="card" style={{ padding: 32, position: "relative" }}>
              {index === 1 && (
                <div style={{ 
                  position: "absolute", 
                  top: -12, 
                  left: "50%", 
                  transform: "translateX(-50%)", 
                  backgroundColor: "var(--accent)", 
                  color: "var(--ink)", 
                  padding: "4px 12px", 
                  borderRadius: 12, 
                  fontSize: 12, 
                  fontWeight: 600 
                }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
              <p style={{ color: "var(--sub)", fontSize: 16, marginBottom: 24 }}>{p.contactCount}+ recruiter contacts</p>
              <p style={{ fontSize: 40, fontWeight: 800, marginBottom: 24 }}>₹{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: "var(--sub)" }}> one-time</span></p>
              
              <ul style={{ textAlign: "left", marginBottom: 32, color: "var(--ink)", fontSize: 15, lineHeight: 2, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#1a7f37" }}>✓</span>
                  {index === 0 ? "Recruiter names & companies" : "Everything in Basic"}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#1a7f37" }}>✓</span>
                  {index === 0 ? "Roles & locations" : "More recruiters & companies"}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#1a7f37" }}>✓</span>
                  {index === 0 ? "Contact info, where authorized" : "More roles & locations"}
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#1a7f37" }}>✓</span>
                  View inside HIREBEAR
                </li>
              </ul>
              
              <Link
                href={`/checkout/razorpay/${p.slug}`}
                className="btn"
                style={{
                  width: "100%",
                  padding: "14px 28px",
                  backgroundColor: index === 1 ? "var(--ink)" : "white",
                  color: index === 1 ? "var(--bg)" : "var(--ink)",
                  border: index === 1 ? "none" : "1px solid var(--line)"
                }}
              >
                Get {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ maxWidth: 1200, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Simple as 1, 2, 3.</h2>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "var(--accent)", marginBottom: 16 }}>01</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Choose</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
              Choose the recruiter database that fits your needs.
            </p>
          </div>
          
          <div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "var(--accent)", marginBottom: 16 }}>02</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Buy</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
              Complete the one-time payment securely.
            </p>
          </div>
          
          <div>
            <div style={{ fontSize: 48, fontWeight: 800, color: "var(--accent)", marginBottom: 16 }}>03</div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Access</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
              The database is added to your HIREBEAR account and stays there.
            </p>
          </div>
        </div>
      </section>

      {/* Why HIREBEAR */}
      <section style={{ maxWidth: 1000, margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Why HIREBEAR</h2>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Curated</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
              Organized recruiter information in one place.
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Instant</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
              Access your purchased database after successful payment.
            </p>
          </div>
          
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>One-time</h3>
            <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
              No recurring subscription for the initial products.
            </p>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <section style={{ backgroundColor: "var(--ink)", color: "var(--bg)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16 }}>Want your database free?</h2>
        <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9, maxWidth: 600, margin: "0 auto 32px" }}>
          Refer friends and earn rewards. Get your database for free when 5 friends make a purchase.
        </p>
        <Link href="/signup" className="btn" style={{ 
          backgroundColor: "var(--accent)", 
          color: "var(--ink)", 
          padding: "16px 32px", 
          fontSize: 16,
          fontWeight: 600 
        }}>
          Start Referring
        </Link>
      </section>

      {/* FAQ Section */}
      <section style={{ maxWidth: 800, margin: "80px auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Frequently asked</h2>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { q: "Is this a subscription service?", a: "No, all our databases are one-time purchases. You pay once and have lifetime access." },
            { q: "Can I download the data?", a: "For the initial version, data is viewable within your HIREBEAR account only. This ensures data security and quality." },
            { q: "How do I access my database?", a: "After purchase, log in to your HIREBEAR account and go to 'My Databases' in your dashboard." },
            { q: "Is the data verified?", a: "Yes, all recruiter contacts are verified and sourced from authorized channels." },
          ].map((faq, index) => (
            <div key={index} className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ color: "var(--sub)", fontSize: 14, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "48px 24px", borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <BearIcon size={24} />
          <span style={{ fontWeight: 800, fontSize: 19 }}>HIREBEAR</span>
        </div>
        <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 24 }}>
          Get closer to your next opportunity.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 24, fontSize: 14 }}>
          <Link href="/databases" style={{ color: "var(--sub)", textDecoration: "none" }}>Databases</Link>
          <Link href="/how-it-works" style={{ color: "var(--sub)", textDecoration: "none" }}>How It Works</Link>
          <Link href="/pricing" style={{ color: "var(--sub)", textDecoration: "none" }}>Pricing</Link>
          <Link href="/faq" style={{ color: "var(--sub)", textDecoration: "none" }}>FAQ</Link>
        </div>
        <p style={{ color: "var(--sub)", fontSize: 13 }}>
          © 2026 HIREBEAR. All rights reserved.
        </p>
      </footer>
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
