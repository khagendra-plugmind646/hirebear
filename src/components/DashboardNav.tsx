"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import BearIcon from "./BearIcon";

export default function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/databases", label: "My Databases" },
    { href: "/dashboard/orders", label: "Orders" },
    { href: "/pricing", label: "Purchase" },
    { href: "/dashboard/referrals", label: "Refer & Earn" },
    { href: "/dashboard/profile", label: "Profile" },
  ];

  return (
    <nav style={navStyle}>
      <Link href="/" style={{ fontWeight: 800, fontSize: 19, display: "flex", alignItems: "center", gap: 8 }}>
        <BearIcon size={20} />
        HIREBEAR
      </Link>
      <div style={{ display: "flex", gap: 20 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="btn"
            style={{
              ...(pathname === item.href ? activeStyle : {}),
            }}
          >
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn"
          style={{ border: "1px solid var(--line)" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 32px",
  borderBottom: "1px solid var(--line)",
};

const activeStyle: React.CSSProperties = {
  backgroundColor: "var(--ink)",
  color: "var(--bg)",
};