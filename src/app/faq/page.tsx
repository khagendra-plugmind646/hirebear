import Link from "next/link";
import BearIcon from "@/components/BearIcon";

export default function FAQPage() {
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
        <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>Frequently Asked Questions</h1>
        <p style={{ color: "var(--sub)", fontSize: 18, marginBottom: 48 }}>
          Everything you need to know about HIREBEAR
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>What is HIREBEAR?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              HIREBEAR is a platform that provides curated recruiter contact databases to job seekers. 
              We help you find the right recruiters to connect with for your job search.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>How does it work?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              Simply choose a database, complete a one-time payment, and instantly access recruiter contacts 
              in your HIREBEAR account. You can search, filter, and view the data anytime.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Is this a subscription service?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              No, all our databases are one-time purchases. You pay once and have lifetime access to the data. 
              No recurring charges or hidden fees.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Can I download the Excel file?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              In the initial version, data is viewable within your HIREBEAR account only. This ensures data 
              security and allows us to maintain data quality. You can search, filter, and view contacts online.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>How accurate is the data?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              We only provide data from authorized sources and verify our recruiter contacts. However, 
              recruiter information can change over time, so we recommend verifying contact details before reaching out.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>What payment methods do you accept?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              We accept payments through Cashfree, which supports UPI, credit cards, debit cards, net banking, 
              and popular wallets. All payments are secure and processed safely.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Can I get a refund?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              Due to the nature of digital products, we generally don't offer refunds once access has been granted. 
              If you have concerns about a purchase, please contact our support team.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>How do I access my purchased database?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              After purchase, log in to your HIREBEAR account and go to "My Databases" in your dashboard. 
              Your purchased databases will be available there for instant viewing.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Is my data secure?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              Yes, we take security seriously. Your payment information is processed securely through Cashfree, 
              and your account data is protected. We never share your personal information with third parties.
            </p>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Can I share my account with others?</h3>
            <p style={{ color: "var(--sub)", fontSize: 15, lineHeight: 1.6 }}>
              No, account sharing is not permitted. Each purchase is for individual use only. Sharing accounts 
              may result in access termination.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ color: "var(--sub)", fontSize: 16, marginBottom: 24 }}>
            Still have questions?
          </p>
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