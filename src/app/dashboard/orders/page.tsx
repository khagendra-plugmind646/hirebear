import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import "@/models/Product";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  await connectDB();
  const userId = (session.user as any).id;

  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate("productId").lean();

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Orders</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
            {["Order ID", "Product", "Amount", "Status", "Date"].map((h) => (
              <th key={h} style={{ padding: "10px 8px", fontSize: 12.5, color: "var(--sub)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any) => (
            <tr key={o._id} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "10px 8px", fontWeight: 600 }}>{o.orderId}</td>
              <td style={{ padding: "10px 8px" }}>{o.productId?.name}</td>
              <td style={{ padding: "10px 8px" }}>₹{o.amount}</td>
              <td style={{ padding: "10px 8px" }}><StatusPill status={o.status} /></td>
              <td style={{ padding: "10px 8px", color: "var(--sub)" }}>
                {new Date(o.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{ color: "var(--sub)", marginTop: 16 }}>No orders yet.</p>}
    </main>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = { PAID: "#1a7f37", PENDING: "#B98900", FAILED: "#B42318", REFUNDED: "#6B6B6B" }[status] || "#6B6B6B";
  return <span style={{ color, fontWeight: 600, fontSize: 13 }}>{status}</span>;
}
