import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import ReferralConfigModel, { getReferralConfig } from "@/models/ReferralConfig";
import { z } from "zod";

const schema = z.object({
  requiredReferrals: z.number().int().positive().optional(),
  rewardProductId: z.string().optional(),
  campaignActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const { authorized } = await requireAdminApi();
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();
  const config = await getReferralConfig();
  if (!config) return NextResponse.json({ error: "Seed a product first" }, { status: 400 });

  Object.assign(config, parsed.data);
  await config.save();

  return NextResponse.json(config);
}
