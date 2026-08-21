"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import ProductEditModal from "@/components/ProductEditModal";

import type {
  AdminProduct,
  ProductVariant,
} from "@/lib/adminApi";

import {
  fetchAdminProducts,
  fetchAdminVariants,
  deleteAdminProduct,
} from "@/lib/adminApi";

import { products as frontendProducts } from "@/data";

/* -------------------------------------------------------------------------- */
/* Admin row                                                                  */
/* -------------------------------------------------------------------------- */

type AdminProductRow = {
  product: AdminProduct;
  variant: ProductVariant | null;
};

/* -------------------------------------------------------------------------- */
/* Frontend image resolver                                                    */
/* -------------------------------------------------------------------------- */

function getProductImage(
  productName: string,
): string | null {
  const normalizedName = productName
    .trim()
    .toLowerCase();

  const frontendProduct = frontendProducts.find(
    (product) =>
      product.name.trim().toLowerCase() ===
      normalizedName,
  );

  return frontendProduct?.image ?? null;
}

/* -------------------------------------------------------------------------- */
/* View Modal                                                                 */
/* -------------------------------------------------------------------------- */

function ViewModal({
  row,
  onClose,
}: {
  row: AdminProductRow;
  onClose: () => void;
}) {
  const { product, variant } = row;

  const productImage = getProductImage(
    product.productName,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4">
          <h2 className="text-[16px] font-extrabold text-[#2E0569]">
            Product Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF]"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* PRODUCT IMAGE */}
          <div className="flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[18px] bg-[#F4EEFF]">
              {productImage ? (
                <img
                  src={productImage}
                  alt={product.productName}
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <span className="text-[24px] font-extrabold text-[#8C52FF]">
                  {product.productName
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-[17px] font-extrabold text-[#2E0569]">
              {product.productName}
            </p>

            <p className="text-[12px] font-semibold text-[#8C52FF]">
              {product.categoryName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoTile
              label="Product ID"
              value={String(product.productId)}
            />

            <InfoTile
              label="Category ID"
              value={String(product.categoryId)}
            />

            <InfoTile
              label="MRP"
              value={
                variant
                  ? `₹${Number(
                      variant.mrp,
                    ).toLocaleString("en-IN")}`
                  : "-"
              }
            />

            <InfoTile
              label="Selling Price"
              value={
                variant
                  ? `₹${Number(
                      variant.sellingPrice,
                    ).toLocaleString("en-IN")}`
                  : "-"
              }
            />

            <InfoTile
              label="SKU"
              value={variant?.sku ?? "-"}
            />

            <InfoTile
              label="Status"
              value={product.productStatus}
            />
          </div>

          {product.description && (
            <div>
              <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
                Description
              </p>

              <p className="text-[13px] text-[#716A78]">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Tile                                                                  */
/* -------------------------------------------------------------------------- */

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[12px] border border-[#E9E3EE] bg-[#FAFAFA] px-3 py-2.5">
      <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#9B93A1]">
        {label}
      </p>

      <p className="mt-0.5 text-[13px] font-extrabold text-[#2E0569]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Delete Confirmation                                                        */
/* -------------------------------------------------------------------------- */

function DeleteConfirm({
  name,
  onConfirm,
  onClose,
  deleting,
}: {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
  deleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECEA]">
          <Trash2
            size={20}
            className="text-[#C0392B]"
          />
        </div>

        <p className="mb-1 text-[16px] font-extrabold text-[#2E0569]">
          Delete Product?
        </p>

        <p className="mb-5 text-[13px] text-[#716A78]">
          <span className="font-extrabold text-[#2E0569]">
            {name}
          </span>{" "}
          will be removed.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-[12px] border border-[#E9E3EE] py-2.5 text-[13px] font-extrabold text-[#716A78]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-[12px] bg-[#C0392B] py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
          >
            {deleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function AdminProductsPage() {
  const [rows, setRows] =
    useState<AdminProductRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [editTarget, setEditTarget] =
    useState<AdminProductRow | null>(null);

  const [viewTarget, setViewTarget] =
    useState<AdminProductRow | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AdminProductRow | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /* Load products                                                          */
  /* ---------------------------------------------------------------------- */

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const [products, variants] =
        await Promise.all([
          fetchAdminProducts(),
          fetchAdminVariants(),
        ]);

      const mapped: AdminProductRow[] =
        products.map((product) => {
          const variant =
            variants.find(
              (v) =>
                v.productId ===
                  product.productId &&
                v.isActive,
            ) ?? null;

          return {
            product,
            variant,
          };
        });

      setRows(mapped);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Search                                                                 */
  /* ---------------------------------------------------------------------- */

  const displayed = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) => {
      const product = row.product;

      return [
        product.productName,
        product.categoryName,
        product.slug,
        product.brand ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [rows, search]);

  /* ---------------------------------------------------------------------- */
  /* Saved                                                                  */
  /* ---------------------------------------------------------------------- */

  function handleSaved(
    updatedProduct: AdminProduct,
    updatedVariant: ProductVariant | null,
  ) {
    setRows((previous) => {
      const index = previous.findIndex(
        (row) =>
          row.product.productId ===
          updatedProduct.productId,
      );

      const nextRow: AdminProductRow = {
        product: updatedProduct,
        variant: updatedVariant,
      };

      if (index === -1) {
        return [nextRow, ...previous];
      }

      const next = [...previous];
      next[index] = nextRow;

      return next;
    });

    setEditTarget(null);
  }

  /* ---------------------------------------------------------------------- */
  /* Delete                                                                 */
  /* ---------------------------------------------------------------------- */

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);

      await deleteAdminProduct(
        deleteTarget.product.productId,
      );

      setRows((previous) =>
        previous.filter(
          (row) =>
            row.product.productId !==
            deleteTarget.product.productId,
        ),
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete product.",
      );
    } finally {
      setDeleting(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <div>
      {/* HEADER */}

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-.04em] text-[#2E0569]">
            Products
          </h1>

          <p className="mt-1 text-[13px] text-[#716A78]">
            {rows.length} products in catalogue
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError(
              "For a new product, the Category ID must be supplied. The backend currently does not expose a category list endpoint.",
            );
          }}
          className="flex shrink-0 items-center gap-2 rounded-[12px] bg-[#8C52FF] px-4 py-2.5 text-[13px] font-extrabold text-white"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-[12px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-3"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* SEARCH */}

      <div className="mb-5 flex min-h-10 max-w-sm items-center gap-2 rounded-[12px] border border-[#E9E3EE] bg-white px-3">
        <Search
          size={14}
          className="shrink-0 text-[#8C52FF]"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search by name or category..."
          className="w-full bg-transparent text-[13px] font-semibold text-[#2E0569] outline-none placeholder:text-[#9B93A1]"
        />
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-[20px] border border-[#E9E3EE] bg-white">
        {loading ? (
          <div className="px-4 py-12 text-center text-[13px] font-semibold text-[#9B93A1]">
            Loading products...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#E9E3EE] bg-[#FAFAFA]">
                <tr>
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock Qty",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#8B8292]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF4]">
                {displayed.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-[13px] font-semibold text-[#9B93A1]"
                    >
                      No products found.
                    </td>
                  </tr>
                )}

                {displayed.map((row) => {
                  const {
                    product,
                    variant,
                  } = row;

                  const productImage =
                    getProductImage(
                      product.productName,
                    );

                  return (
                    <tr
                      key={product.productId}
                      className="transition-colors hover:bg-[#FAFAFA]"
                    >
                      {/* PRODUCT */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#F4EEFF]">
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={
                                  product.productName
                                }
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <span className="text-[12px] font-extrabold text-[#8C52FF]">
                                {product.productName
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <span className="whitespace-nowrap font-extrabold text-[#2E0569]">
                            {product.productName}
                          </span>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#8C52FF]">
                        {product.categoryName}
                      </td>

                      {/* PRICE */}

                      <td className="whitespace-nowrap px-4 py-3 font-extrabold text-[#2E0569]">
                        {variant ? (
                          <>
                            ₹
                            {Number(
                              variant.sellingPrice,
                            ).toLocaleString(
                              "en-IN",
                            )}
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* STOCK */}

                      <td className="px-4 py-3 font-semibold text-[#2E0569]">
                        -
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                            product.productStatus ===
                            "ACTIVE"
                              ? "bg-[#EAF4E4] text-[#315C20]"
                              : "bg-[#FDECEA] text-[#8B1A1A]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.productStatus ===
                              "ACTIVE"
                                ? "bg-[#4CAF50]"
                                : "bg-[#E53935]"
                            }`}
                          />

                          {product.productStatus}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <ActionBtn
                            title="View"
                            onClick={() =>
                              setViewTarget(row)
                            }
                            className="text-[#8C52FF] hover:bg-[#F4EEFF]"
                          >
                            <Eye size={14} />
                          </ActionBtn>

                          <ActionBtn
                            title="Edit"
                            onClick={() =>
                              setEditTarget(row)
                            }
                            className="text-[#2E0569] hover:bg-[#F4EEFF]"
                          >
                            <Pencil size={14} />
                          </ActionBtn>

                          <ActionBtn
                            title="Delete"
                            onClick={() =>
                              setDeleteTarget(row)
                            }
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
        )}
      </div>

      {/* EDIT */}

      {editTarget && (
        <ProductEditModal
          product={editTarget.product}
          variant={editTarget.variant}
          onClose={() =>
            setEditTarget(null)
          }
          onSaved={handleSaved}
        />
      )}

      {/* VIEW */}

      {viewTarget && (
        <ViewModal
          row={viewTarget}
          onClose={() =>
            setViewTarget(null)
          }
        />
      )}

      {/* DELETE */}

      {deleteTarget && (
        <DeleteConfirm
          name={
            deleteTarget.product.productName
          }
          deleting={deleting}
          onConfirm={handleDelete}
          onClose={() =>
            setDeleteTarget(null)
          }
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Action Button                                                              */
/* -------------------------------------------------------------------------- */

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
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-[8px] transition ${className}`}
    >
      {children}
    </button>
  );
}