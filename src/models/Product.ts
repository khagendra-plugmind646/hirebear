import { Schema, models, model } from "mongoose";

export interface IProduct {
  name: string;
  slug: string; // "basic" | "standard" | ...
  description: string;
  price: number; // in INR, smallest currency unit handled at payment layer
  currency: string;
  contactCount: number;
  databaseId: Schema.Types.ObjectId; // Reference to Database entity
  filePath: string; // Path to Excel file in storage (e.g., "products/basic-database.xlsx")
  type: "database" | "future";
  status: "active" | "inactive" | "coming-soon";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    contactCount: { type: Number, required: true },
    databaseId: { type: Schema.Types.ObjectId, ref: "Database", required: false },
    filePath: { type: String, default: "" },
    type: { type: String, enum: ["database", "future"], default: "database" },
    status: { type: String, enum: ["active", "inactive", "coming-soon"], default: "active" },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
