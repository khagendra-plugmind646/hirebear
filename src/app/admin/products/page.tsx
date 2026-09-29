import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductsTable from "./ProductsTable";

export default async function AdminProductsPage() {
  await connectDB();
  const products = JSON.parse(JSON.stringify(await Product.find().sort({ price: 1 }).lean()));

  return (
    <>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Products</h1>
      <ProductsTable initialProducts={products} />
    </>
  );
}
