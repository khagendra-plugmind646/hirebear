import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import RecruiterRecord from "@/models/RecruiterRecord";
import Database from "@/models/Database";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  await connectDB();

  // Verify user has purchase entitlement for this database
  const purchase = await Purchase.findOne({
    userId: (session.user as any).id,
    databaseId: params.id,
    status: "ACTIVE",
  }).populate("productId");

  if (!purchase) {
    return NextResponse.json({ error: "Database access not authorized" }, { status: 403 });
  }

  // Verify database is active
  const database = await Database.findById(params.id);
  if (!database || database.status !== "active") {
    return NextResponse.json({ error: "Database not available" }, { status: 404 });
  }

  // Parse query parameters
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const search = searchParams.get("search") || "";

  // Validate pagination
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 });
  }

  // Build search query
  const searchQuery: any = {
    databaseId: params.id,
    active: true,
  };

  if (search) {
    searchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { jobTitle: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  // Get total count for pagination
  const total = await RecruiterRecord.countDocuments(searchQuery);

  // Get paginated records
  const records = await RecruiterRecord.find(searchQuery)
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      databaseInfo: {
        name: database.name,
        description: database.description,
        recordCount: database.recordCount,
      },
    },
  });
}