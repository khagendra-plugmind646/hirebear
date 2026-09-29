import { Schema, models, model, Types } from "mongoose";

export type PurchaseStatus = "ACTIVE" | "REFUNDED" | "REVOKED";

// The entitlement to view a database
export interface IPurchase {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  databaseId: Types.ObjectId;
  orderId: Types.ObjectId;
  status: PurchaseStatus;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    databaseId: { type: Schema.Types.ObjectId, ref: "Database", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    status: { type: String, enum: ["ACTIVE", "REFUNDED", "REVOKED"], default: "ACTIVE" },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One user cannot hold two active entitlements for the same order.
PurchaseSchema.index({ userId: 1, productId: 1 });
PurchaseSchema.index({ userId: 1, databaseId: 1 });

export default models.Purchase || model<IPurchase>("Purchase", PurchaseSchema);
