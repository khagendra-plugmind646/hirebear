import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Product from "@/models/Product";
import { getFileStorageService } from "@/services/FileStorageService";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify the download token
    let decoded: any;
    try {
      decoded = jwt.verify(params.token, process.env.NEXTAUTH_SECRET as string);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired download link" }, { status: 401 });
    }

    const { key } = decoded;
    if (!key) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    await connectDB();

    // Find the product associated with this file
    const product = await Product.findOne({ filePath: key });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has purchased this product
    const purchase = await Purchase.findOne({
      userId: (session.user as any).id,
      productId: product._id,
      status: "ACTIVE",
    });

    if (!purchase) {
      return NextResponse.json({ error: "You haven't purchased this product" }, { status: 403 });
    }

    // Get the file from storage
    const storage = getFileStorageService();
    const fileBuffer = await storage.getFile(key);

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${product.name.replace(/\s+/g, "_")}_database.xlsx"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 });
  }
}
