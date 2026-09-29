import { Schema, models, model } from "mongoose";

export interface IRecruiterRecord {
  databaseId: Schema.Types.ObjectId;
  name: string;
  companyName: string;
  jobTitle: string;
  location: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  companyWebsite?: string;
  source?: string;
  sourceRecordId?: string;
  metadata?: Record<string, any>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterRecordSchema = new Schema<IRecruiterRecord>(
  {
    databaseId: { type: Schema.Types.ObjectId, ref: "Database", required: true, index: true },
    name: { type: String, required: true, index: true },
    companyName: { type: String, required: true, index: true },
    jobTitle: { type: String, required: true, index: true },
    location: { type: String, required: true, index: true },
    email: { type: String, index: true, sparse: true },
    phone: { type: String },
    linkedinUrl: { type: String },
    companyWebsite: { type: String },
    source: { type: String },
    sourceRecordId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
RecruiterRecordSchema.index({ databaseId: 1, active: 1 });
RecruiterRecordSchema.index({ databaseId: 1, name: 1 });
RecruiterRecordSchema.index({ databaseId: 1, companyName: 1 });
RecruiterRecordSchema.index({ databaseId: 1, location: 1 });
RecruiterRecordSchema.index({ databaseId: 1, jobTitle: 1 });

export default models.RecruiterRecord || model<IRecruiterRecord>("RecruiterRecord", RecruiterRecordSchema);