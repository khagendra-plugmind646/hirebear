import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const user = await User.findById((session.user as any).id);

  if (!user) {
    redirect("/login");
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Profile</h1>
      
      <div className="card" style={{ padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
            Name
          </label>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{user.name}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
            Email
          </label>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{user.email}</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
            Referral Code
          </label>
          <ProfileClient referralCode={user.referralCode} />
        </div>

        <div>
          <label style={{ display: "block", color: "var(--sub)", fontSize: 14, marginBottom: 8 }}>
            Member Since
          </label>
          <p style={{ fontSize: 16, fontWeight: 500 }}>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Account Settings</h3>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ color: "var(--sub)", fontSize: 14, marginBottom: 16 }}>
            Password change and email updates will be available in future updates.
          </p>
          <button className="btn btn-outline" disabled>
            Change Password (Coming Soon)
          </button>
        </div>
      </div>
    </main>
  );
}