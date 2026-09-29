import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { z } from "zod";

const patchSchema = z.object({
  price: z.number().positive().optional(),
  contactCount: z.number().int().positive().optional(),
  active: z.boolean().optional(),
  description: z.string().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { authorized } = await requireAdminApi();
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();
  const product = await Product.findByIdAndUpdate(params.id, parsed.data, { new: true });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}
