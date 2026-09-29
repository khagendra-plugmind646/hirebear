import { Schema, models, model, Types } from "mongoose";

export type ReferralStatus = "PENDING" | "SUCCESSFUL" | "INVALID";

// Created when a referred user signs up. Only flips to SUCCESSFUL once
// their order is verified PAID server-side — see services/ReferralService.
export interface IReferral {
  referrerUserId: Types.ObjectId;
  referredUserId: Types.ObjectId;
  referralCode: string;
  orderId?: Types.ObjectId;
  status: ReferralStatus;
  createdAt: Date;
  convertedAt?: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrerUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    referredUserId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // one referral credit per referred user
    referralCode: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    status: { type: String, enum: ["PENDING", "SUCCESSFUL", "INVALID"], default: "PENDING", index: true },
    convertedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Referral = models.Referral || model<IReferral>("Referral", ReferralSchema);

export type RewardStatus = "LOCKED" | "UNLOCKED";

export interface IRewardStatus {
  userId: Types.ObjectId;
  requiredReferrals: number;
  successfulReferrals: number;
  rewardProductId: Types.ObjectId;
  status: RewardStatus;
  unlockedAt?: Date;
  createdAt: Date;
}

const RewardStatusSchema = new Schema<IRewardStatus>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    requiredReferrals: { type: Number, default: 5 },
    successfulReferrals: { type: Number, default: 0 },
    rewardProductId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    status: { type: String, enum: ["LOCKED", "UNLOCKED"], default: "LOCKED" },
    unlockedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const RewardStatusModel =
  models.RewardStatus || model<IRewardStatus>("RewardStatus", RewardStatusSchema);
