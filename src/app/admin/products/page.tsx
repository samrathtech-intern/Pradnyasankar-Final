"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { products as catalogueProducts } from "@/data";
import ProductEditModal, { AdminProduct } from "@/components/ProductEditModal";

/* ─── Seed mock data from catalogue ─────────────────────────────────────── */
const MOCK_STOCK: Record<string, number> = {
  "ashwagandha-capsules": 142,
  "plant-protein": 87,
  "daily-greens": 0,
  "immunity-booster": 56,
  multivitamin: 210,
  triphala: 0,
  chyawanprash: 33,
  "herbal-hair-oil": 74,
  "herbal-hair-serum": 0,
  "face-serum": 91,
  "glow-cream": 18,
  "digestive-support": 0,
  "tulsi-giloy": 63,
  "vitamin-c": 155,
  "zinc-selenium": 0,
  "joint-support": 44,
  "sleep-support": 29,
  "probiotic-gut-balance": 0,
};

function seedProducts(): AdminProduct[] {
  return catalogueProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.range,
    price: p.price,
    stockQty: MOCK_STOCK[p.id] ?? 50,
    featured: p.status === "Featured",
    image: p.image,
    shortDescription: p.descriptor,
    fullDescription: "",
    benefits: p.goals.join(", "),
    ingredients: "",
  }));
}

/* ─── View Modal ─────────────────────────────────────────────────────────── */
function ViewModal({ product, onClose }: { product: AdminProduct; onClose: () => void }) {
  const inStock = product.stockQty > 0;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-[24px] bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4">
          <h2 className="text-[16px] font-extrabold tracking-[-.03em] text-[#2E0569]">Product Details</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF] hover:bg-[#EAD9FF]">
            <X size={15} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF] border border-[#E9E3EE]">
              {product.image && <Image src={product.image} alt={product.name} fill className="object-contain p-2" />}
            </div>
            <div>
              <p className="text-[16px] font-extrabold text-[#2E0569]">{product.name}</p>
              <p className="text-[12px] text-[#8C52FF] font-semibold">{product.category}</p>
              <p className="text-[14px] font-extrabold text-[#2E0569] mt-1">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile label="Stock Qty" value={String(product.stockQty)} />
            <InfoTile
              label="Status"
              value={inStock ? "In Stock" : "Out of Stock"}
              valueClass={inStock ? "text-[#315C20]" : "text-[#8B1A1A]"}
            />
            <InfoTile label="Featured" value={product.featured ? "Yes" : "No"} />
          </div>
          {product.shortDescription && (
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] mb-1">Description</p>
              <p className="text-[13px] text-[#716A78]">{product.shortDescription}</p>
            </div>
          )}
          {product.benefits && (
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] mb-1">Benefits</p>
              <p className="text-[13px] text-[#716A78]">{product.benefits}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, valueClass = "text-[#2E0569]" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] px-3 py-2.5">
      <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#9B93A1]">{label}</p>
      <p className={`text-[13px] font-extrabold mt-0.5 ${valueClass}`}>{value}</p>
    </div>
  );
}

/* ─── Delete Confirm ─────────────────────────────────────────────────────── */
function DeleteConfirm({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-[24px] bg-white shadow-2xl p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEA] mb-4">
          <Trash2 size={20} className="text-[#C0392B]" />
        </div>
        <p className="text-[16px] font-extrabold text-[#2E0569] mb-1">Delete Product?</p>
        <p className="text-[13px] text-[#716A78] mb-5">
          <span className="font-extrabold text-[#2E0569]">{name}</span> will be permanently removed. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-[12px] border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#716A78] hover:bg-[#FAFAFA]">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-[12px] bg-[#C0392B] py-2.5 text-[13px] font-extrabold text-white hover:bg-[#A93226]">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────── */
export default function AdminProductsPage() {
  const [rows, setRows] = useState<AdminProduct[]>(seedProducts);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<AdminProduct | null | "new">(null);
  const [viewTarget, setViewTarget] = useState<AdminProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  const displayed = search.trim()
    ? rows.filter((p) =>
        [p.name, p.category].join(" ").toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  function handleSave(updated: AdminProduct) {
    setRows((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx === -1) return [updated, ...prev];
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
    setEditTarget(null);
  }

  function handleDelete(id: string) {
    setRows((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">Products</h1>
          <p className="mt-1 text-[13px] text-[#716A78]">
            {rows.length} products in catalogue
          </p>
        </div>
        <button
          onClick={() => setEditTarget("new")}
          className="flex shrink-0 items-center gap-2 rounded-[12px] bg-[#8C52FF] px-4 py-2.5 text-[13px] font-extrabold text-white shadow-sm transition hover:bg-[#7A3FEE]"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 flex min-h-10 max-w-sm items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
        <Search size={14} className="shrink-0 text-[#8C52FF]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category…"
          className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
              <tr>
                {["Product", "Category", "Price", "Stock Qty", "Status", "Featured", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAF4]">
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#9B93A1] font-semibold">
                    No products found.
                  </td>
                </tr>
              )}
              {displayed.map((p) => {
                const inStock = p.stockQty > 0;
                return (
                  <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                          {p.image && (
                            <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                          )}
                        </div>
                        <span className="font-extrabold text-[#2E0569] whitespace-nowrap">{p.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-[#8C52FF] font-semibold whitespace-nowrap">{p.category}</td>

                    {/* Price */}
                    <td className="px-4 py-3 font-extrabold text-[#2E0569] whitespace-nowrap">
                      ₹{p.price.toLocaleString("en-IN")}
                    </td>

                    {/* Stock Qty */}
                    <td className="px-4 py-3 font-semibold text-[#2E0569]">{p.stockQty}</td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold whitespace-nowrap ${
                          inStock
                            ? "bg-[#EAF4E4] text-[#315C20]"
                            : "bg-[#FDECEA] text-[#8B1A1A]"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-[#4CAF50]" : "bg-[#E53935]"}`} />
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    {/* Featured */}
                    <td className="px-4 py-3">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#2E0569] px-2.5 py-1 text-[10px] font-extrabold text-white">
                          <Star size={9} fill="white" /> Featured
                        </span>
                      ) : (
                        <span className="text-[#C4B8D0] text-[12px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <ActionBtn
                          title="View"
                          onClick={() => setViewTarget(p)}
                          className="text-[#8C52FF] hover:bg-[#F4EEFF]"
                        >
                          <Eye size={14} />
                        </ActionBtn>
                        <ActionBtn
                          title="Edit"
                          onClick={() => setEditTarget(p)}
                          className="text-[#2E0569] hover:bg-[#F4EEFF]"
                        >
                          <Pencil size={14} />
                        </ActionBtn>
                        <ActionBtn
                          title="Delete"
                          onClick={() => setDeleteTarget(p)}
                          className="text-[#C0392B] hover:bg-[#FDECEA]"
                        >
                          <Trash2 size={14} />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {editTarget !== null && (
        <ProductEditModal
          product={editTarget === "new" ? null : editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}
      {viewTarget && (
        <ViewModal product={viewTarget} onClose={() => setViewTarget(null)} />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function ActionBtn({
  children,
  title,
  onClick,
  className,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-[8px] transition ${className}`}
    >
      {children}
    </button>
  );
}
