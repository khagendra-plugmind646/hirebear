import { Schema, models, model } from "mongoose";

export interface IDatabase {
  name: string;
  slug: string;
  description: string;
  recordCount: number;
  status: "active" | "inactive" | "coming-soon";
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const DatabaseSchema = new Schema<IDatabase>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    recordCount: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ["active", "inactive", "coming-soon"], 
      default: "active" 
    },
    version: { type: String, default: "1.0" },
  },
  { timestamps: true }
);

export default models.Database || model<IDatabase>("Database", DatabaseSchema);