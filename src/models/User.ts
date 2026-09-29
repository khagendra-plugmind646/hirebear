import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  referralCode: string; // this user's own shareable code
  referredBy?: mongoose.Types.ObjectId | null; // User who referred them, if any
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    referralCode: { type: String, required: true, unique: true, index: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
