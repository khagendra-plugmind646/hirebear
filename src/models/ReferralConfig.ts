import { Schema, models, model, Types } from "mongoose";

export interface IReferralConfig {
  requiredReferrals: number;
  rewardProductId: Types.ObjectId;
  campaignActive: boolean;
}

const ReferralConfigSchema = new Schema<IReferralConfig>({
  requiredReferrals: { type: Number, default: 5 },
  rewardProductId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  campaignActive: { type: Boolean, default: true },
});

const ReferralConfigModel =
  models.ReferralConfig || model<IReferralConfig>("ReferralConfig", ReferralConfigSchema);

/** There is exactly one config document. Creates it with sane defaults if missing. */
export async function getReferralConfig() {
  let config = await ReferralConfigModel.findOne();
  if (!config) {
    const Product = (await import("./Product")).default;
    const fallback = await Product.findOne().sort({ price: 1 });
    if (!fallback) return null; // no products seeded yet
    config = await ReferralConfigModel.create({ rewardProductId: fallback._id });
  }
  return config;
}

export default ReferralConfigModel;
