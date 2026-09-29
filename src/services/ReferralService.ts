import { Referral, RewardStatusModel } from "@/models/Referral";
import User from "@/models/User";
import Product from "@/models/Product";
import Purchase from "@/models/Purchase";
import Database from "@/models/Database";
import Order from "@/models/Order";
import { Types } from "mongoose";

// Ensure models are registered
import "@/models/User";
import "@/models/Product";
import "@/models/Database";
import "@/models/Order";
import "@/models/Purchase";

/**
 * Call this when a new account is created with a referral code in the URL.
 * Only creates a PENDING referral — it does not count toward anyone's
 * total yet. Counting happens in markReferralSuccessfulForOrder, driven
 * only by a server-verified paid order (see PaymentService webhook flow).
 */
export async function recordReferralSignup(referredUserId: string, referralCode: string) {
  const referrer = await User.findOne({ referralCode });
  if (!referrer) return null;
  if (referrer._id.toString() === referredUserId) return null; // block self-referral

  const existing = await Referral.findOne({ referredUserId });
  if (existing) return existing; // one referral credit per referred user, ever

  return Referral.create({
    referrerUserId: referrer._id,
    referredUserId,
    referralCode,
    status: "PENDING",
  });
}

/**
 * Call this ONLY from the Cashfree webhook handler, after payment is
 * verified and the order is marked PAID, and only if the order was not
 * later refunded/cancelled. Never call this from client-reported state.
 */
export async function markReferralSuccessfulForOrder(referredUserId: string, orderId: string) {
  const referral = await Referral.findOne({ referredUserId, status: "PENDING" });
  if (!referral) return;

  referral.status = "SUCCESSFUL";
  referral.orderId = new Types.ObjectId(orderId);
  referral.convertedAt = new Date();
  await referral.save();

  await recalculateRewardProgress(referral.referrerUserId.toString());
}

/** If an order tied to a referral is refunded, the credit must be reversed. */
export async function invalidateReferralForOrder(orderId: string) {
  const referral = await Referral.findOne({ orderId, status: "SUCCESSFUL" });
  if (!referral) return;
  referral.status = "INVALID";
  await referral.save();
  await recalculateRewardProgress(referral.referrerUserId.toString());
}

async function recalculateRewardProgress(referrerUserId: string) {
  const successfulCount = await Referral.countDocuments({
    referrerUserId,
    status: "SUCCESSFUL",
  });

  const reward = await RewardStatusModel.findOne({ userId: referrerUserId });
  if (!reward) return; // reward record is created at signup with the configured default product

  reward.successfulReferrals = successfulCount;
  if (successfulCount >= reward.requiredReferrals && reward.status === "LOCKED") {
    reward.status = "UNLOCKED";
    reward.unlockedAt = new Date();
    
    // Auto-create purchase for the reward product
    if (reward.rewardProductId) {
      try {
        const product = await Product.findById(reward.rewardProductId);
        if (product && product.databaseId) {
          // Check if they already have this product
          const existingPurchase = await Purchase.findOne({
            userId: referrerUserId,
            productId: product._id,
            status: "ACTIVE",
          });
          
          if (!existingPurchase) {
            // Create a reward order
            const crypto = require("crypto");
            const rewardOrderId = `REWARD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
            
            const order = await Order.create({
              orderId: rewardOrderId,
              userId: referrerUserId,
              productId: product._id,
              amount: 0, // Free reward
              currency: product.currency || "INR",
              status: "PAID",
            });
            
            await Purchase.create({
              userId: referrerUserId,
              productId: product._id,
              databaseId: product.databaseId,
              orderId: order._id,
              status: "ACTIVE",
              purchaseDate: new Date(),
            });
            
            console.log(`Auto-created reward purchase for user ${referrerUserId} for product ${product.name}`);
          }
        }
      } catch (error) {
        console.error("Error creating reward purchase:", error);
      }
    }
    
    // TODO: trigger EmailService notification
  }
  await reward.save();
}
