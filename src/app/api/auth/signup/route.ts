import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { RewardStatusModel } from "@/models/Referral";
import { getReferralConfig } from "@/models/ReferralConfig";
import { recordReferralSignup } from "@/services/ReferralService";

const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  referralCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { name, email, password, referralCode } = parsed.data;

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    // Same message either way — don't reveal whether an email is registered.
    return NextResponse.json({ error: "Could not create account" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const ownReferralCode = crypto.randomBytes(4).toString("hex");

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    referralCode: ownReferralCode,
  });

  // Reward tracking record, driven by the admin-configured campaign settings.
  const config = await getReferralConfig();
  if (config) {
    await RewardStatusModel.create({
      userId: user._id,
      requiredReferrals: config.requiredReferrals,
      rewardProductId: config.rewardProductId,
    });
  }

  if (referralCode) {
    await recordReferralSignup(user._id.toString(), referralCode);
  }

  return NextResponse.json({ ok: true });
}

// Rate-limit this route by IP in production (e.g. 5 signups / hour / IP)
// to slow down duplicate-account referral abuse.
