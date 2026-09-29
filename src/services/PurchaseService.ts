import Purchase from "@/models/Purchase";
import Product from "@/models/Product";
import Database from "@/models/Database";

/**
 * Validate that a user has an active purchase entitlement for a database.
 * This is used for the database viewer access control.
 */
export async function validateDatabaseAccess(userId: string, databaseId: string) {
  const purchase = await Purchase.findOne({ 
    userId, 
    databaseId, 
    status: "ACTIVE" 
  }).populate("productId");

  if (!purchase) {
    throw new Error("No active purchase found for this database");
  }

  const product = purchase.productId as any;
  if (!product || product.status !== "active") {
    throw new Error("Product is no longer available");
  }

  const database = await Database.findById(databaseId);
  if (!database || database.status !== "active") {
    throw new Error("Database is not available");
  }

  return { purchase, product, database };
}
