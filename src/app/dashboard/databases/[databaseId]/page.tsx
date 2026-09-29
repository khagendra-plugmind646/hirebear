import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Database from "@/models/Database";
import DatabaseViewerClient from "./DatabaseViewerClient";

export default async function DatabaseViewerPage({ params }: { params: { databaseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();

  // Verify user has access to this database
  const purchase = await Purchase.findOne({
    userId: (session.user as any).id,
    databaseId: params.databaseId,
    status: "ACTIVE",
  }).populate("productId");

  if (!purchase) {
    redirect("/dashboard/databases");
  }

  const database = await Database.findById(params.databaseId);
  if (!database) {
    redirect("/dashboard/databases");
  }

  return <DatabaseViewerClient databaseId={params.databaseId} databaseName={database.name} databaseDescription={database.description} />;
}