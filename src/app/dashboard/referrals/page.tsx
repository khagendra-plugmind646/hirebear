import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { RewardStatusModel } from "@/models/Referral";
import Purchase from "@/models/Purchase";
import ReferralPanel from "./ReferralPanel";
import ReferralCodeDisplay from "./ReferralCodeDisplay";

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const userId = (session.user as any).id;

  const [user, reward] = await Promise.all([
    User.findById(userId).lean(),
    RewardStatusModel.findOne({ userId }).lean(),
  ]);

  const referralLink = `${process.env.APP_URL || "https://hirebear.in"}/r/${(user as any)?.referralCode}`;

  // Check if user already owns the reward product
  let alreadyOwns = false;
  if ((reward as any)?.rewardProductId) {
    const existingPurchase = await Purchase.findOne({
      userId,
      productId: (reward as any).rewardProductId,
      status: "ACTIVE",
    });
    alreadyOwns = !!existingPurchase;
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Refer & Unlock</h1>
      <ReferralCodeDisplay referralCode={(user as any)?.referralCode || ""} />
      <ReferralPanel
        referralLink={referralLink}
        successfulReferrals={(reward as any)?.successfulReferrals ?? 0}
        requiredReferrals={(reward as any)?.requiredReferrals ?? 5}
        unlocked={(reward as any)?.status === "UNLOCKED"}
        alreadyOwns={alreadyOwns}
      />
    </main>
  );
}
