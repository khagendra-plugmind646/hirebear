import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Database from "@/models/Database";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  price: z.number().positive(),
  contactCount: z.number().int().positive(),
  databaseId: z.string().optional(),
  type: z.enum(["database", "future"]).default("database"),
  status: z.enum(["active", "inactive", "coming-soon"]).default("active"),
});

export async function GET() {
  const { authorized } = await requireAdminApi();
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const products = await Product.find().populate("databaseId").sort({ displayOrder: 1, price: 1 }).lean();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { authorized } = await requireAdminApi();
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await connectDB();
  const existing = await Product.findOne({ slug: parsed.data.slug });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

  // If databaseId is provided, verify it exists
  if (parsed.data.databaseId) {
    const database = await Database.findById(parsed.data.databaseId);
    if (!database) {
      return NextResponse.json({ error: "Database not found" }, { status: 404 });
    }
  }

  const product = await Product.create({
    ...parsed.data,
    displayOrder: 0,
  });

  return NextResponse.json(product, { status: 201 });
}
