import { Schema, models, model, Types } from "mongoose";

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface IOrder {
  orderId: string; // human-readable, e.g. HB-10293
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  amount: number;
  currency: string;
  paymentProvider: "cashfree";
  paymentOrderId?: string; // Cashfree's order id
  paymentId?: string; // Cashfree's payment id, set on success
  status: OrderStatus;
  createdAt: Date;
  paidAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentProvider: { type: String, default: "cashfree" },
    paymentOrderId: { type: String },
    paymentId: { type: String },
    status: { type: String, enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: "PENDING", index: true },
    paidAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
