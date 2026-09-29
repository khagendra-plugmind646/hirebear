import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { Referral, RewardStatusModel } from "@/models/Referral";
import Purchase from "@/models/Purchase";

export default async function AdminDashboard() {
  await connectDB();

  const [totalUsers, paidOrders, basic, standard, referralConversions, rewardsUnlocked, downloads] =
    await Promise.all([
      User.countDocuments(),
      Order.find({ status: "PAID" }).populate("productId").lean(),
      Product.findOne({ slug: "basic" }).lean(),
      Product.findOne({ slug: "standard" }).lean(),
      Referral.countDocuments({ status: "SUCCESSFUL" }),
      RewardStatusModel.countDocuments({ status: "UNLOCKED" }),
      Purchase.aggregate([{ $group: { _id: null, total: { $sum: "$downloadCount" } } }]),
    ]);

  const revenue = paidOrders.reduce((sum, o: any) => sum + o.amount, 0);
  const basicSales = paidOrders.filter((o: any) => o.productId?.slug === "basic").length;
  const standardSales = paidOrders.filter((o: any) => o.productId?.slug === "standard").length;

  const stats = [
    ["Total Users", totalUsers],
    ["Total Orders", paidOrders.length],
    ["Revenue", `₹${revenue.toLocaleString("en-IN")}`],
    ["Basic Sales", basicSales],
    ["Standard Sales", standardSales],
    ["Referral Conversions", referralConversions],
    ["Rewards Unlocked", rewardsUnlocked],
    ["Downloads", downloads[0]?.total ?? 0],
  ] as const;

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Overview</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map(([label, value]) => (
          <div key={label} className="card">
            <p style={{ color: "var(--sub)", fontSize: 13, marginBottom: 8 }}>{label}</p>
            <p style={{ fontSize: 24, fontWeight: 800 }}>{value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
