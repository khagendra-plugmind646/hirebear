import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminAuth";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getFileStorageService } from "@/services/FileStorageService";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { authorized } = await requireAdminApi();
  if (!authorized) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!file.name.endsWith(".xlsx")) {
    return NextResponse.json({ error: "Only .xlsx files are accepted" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `products/${product.slug}-${Date.now()}.xlsx`;

  const storage = getFileStorageService();
  await storage.upload(key, buffer, file.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  await storage.delete(product.filePath); // remove the previous version

  product.filePath = key;
  product.fileName = file.name;
  await product.save();

  return NextResponse.json({ ok: true, filePath: key });
}
