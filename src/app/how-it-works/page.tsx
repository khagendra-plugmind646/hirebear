import Link from "next/link";
import BearIcon from "@/components/BearIcon";

export default function HowItWorksPage() {
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
            <Link href="/login" className="btn" style={{ backgroundColor: "white", color: "var(--ink)", border: "1px solid var(--line)" }}>Login</Link>
            <Link href="/signup" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 800, margin: "80px auto", padding: "0 24px" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>How It Works</h1>
        <p style={{ color: "var(--sub)", fontSize: 18, marginBottom: 48, lineHeight: 1.6 }}>
          Get access to curated recruiter contacts in three simple steps.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div className="card" style={{ padding: 32, display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ 
              fontSize: 48, 
              fontWeight: 800, 
              color: "var(--accent)", 
              minWidth: 80, 
              textAlign: "center" 
            }}>
              01
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Choose</h2>
              <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
                Browse our available recruiter databases and choose the one that fits your needs. 
                Each database contains verified recruiter contacts with relevant information.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 32, display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ 
              fontSize: 48, 
              fontWeight: 800, 
              color: "var(--accent)", 
              minWidth: 80, 
              textAlign: "center" 
            }}>
              02
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Buy</h2>
              <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
                Complete a secure one-time payment through Cashfree. No subscriptions, no hidden fees. 
                Pay once and own the database access forever.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: 32, display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ 
              fontSize: 48, 
              fontWeight: 800, 
              color: "var(--accent)", 
              minWidth: 80, 
              textAlign: "center" 
            }}>
              03
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Access</h2>
              <p style={{ color: "var(--sub)", fontSize: 16, lineHeight: 1.6 }}>
                Your database becomes instantly available in your HIREBEAR account. 
                View recruiter contacts, search by company or role, and access your data anytime.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <Link href="/databases" className="btn btn-primary" style={{ padding: "14px 28px", fontSize: 16 }}>
            Browse Databases
          </Link>
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