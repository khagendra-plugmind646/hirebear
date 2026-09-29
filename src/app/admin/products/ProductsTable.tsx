"use client";
import { useState } from "react";

type Product = {
  _id: string; name: string; slug: string; price: number; contactCount: number;
  active: boolean; fileName: string;
};

export default function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ name: "", slug: "", price: "", contactCount: "" });
  const [creating, setCreating] = useState(false);

  async function toggleActive(p: Product) {
    const res = await fetch(`/api/admin/products/${p._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
    }
  }

  async function updatePrice(p: Product, price: number) {
    const res = await fetch(`/api/admin/products/${p._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
    }
  }

  async function uploadFile(p: Product, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/admin/products/${p._id}/upload`, { method: "POST", body: fd });
    if (!res.ok) {
      alert("Upload failed — only .xlsx files are accepted.");
      return;
    }
    alert(`Replaced file for ${p.name}. Remember to enable the product if it was inactive.`);
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        price: Number(form.price),
        contactCount: Number(form.contactCount),
      }),
    });
    setCreating(false);
    if (!res.ok) {
      alert((await res.json()).error || "Could not create product");
      return;
    }
    const created = await res.json();
    setProducts((prev) => [...prev, created]);
    setForm({ name: "", slug: "", price: "", contactCount: "" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
            {["Name", "Slug", "Price", "Contacts", "File", "Status", ""].map((h) => (
              <th key={h} style={{ padding: "10px 8px", fontSize: 12.5, color: "var(--sub)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "10px 8px", fontWeight: 600 }}>{p.name}</td>
              <td style={{ padding: "10px 8px", color: "var(--sub)" }}>{p.slug}</td>
              <td style={{ padding: "10px 8px" }}>
                <input
                  className="input" style={{ width: 90, padding: "6px 8px" }}
                  type="number" defaultValue={p.price}
                  onBlur={(e) => updatePrice(p, Number(e.target.value))}
                />
              </td>
              <td style={{ padding: "10px 8px" }}>{p.contactCount}+</td>
              <td style={{ padding: "10px 8px" }}>
                <label className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>
                  Upload
                  <input type="file" accept=".xlsx" hidden
                    onChange={(e) => e.target.files?.[0] && uploadFile(p, e.target.files[0])} />
                </label>
              </td>
              <td style={{ padding: "10px 8px" }}>
                <span style={{ color: p.active ? "#1a7f37" : "var(--sub)", fontWeight: 600, fontSize: 13.5 }}>
                  {p.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td style={{ padding: "10px 8px" }}>
                <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => toggleActive(p)}>
                  {p.active ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={createProduct} className="card" style={{ maxWidth: 420 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>New product</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <input className="input" placeholder="Name (e.g. Premium)" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Slug (e.g. premium)" required
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <input className="input" placeholder="Price (₹)" type="number" required
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" placeholder="Contact count" type="number" required
            value={form.contactCount} onChange={(e) => setForm({ ...form, contactCount: e.target.value })} />
        </div>
        <button className="btn btn-primary" disabled={creating}>
          {creating ? "Creating…" : "Create product"}
        </button>
        <p style={{ fontSize: 12.5, color: "var(--sub)", marginTop: 10 }}>
          New products start Inactive — upload a file, then enable it.
        </p>
      </form>
    </div>
  );
}
