"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  Product,
  ProductRequest,
  ProductVariant,
  ProductVariantRequest,
  updateAdminProduct,
  updateAdminVariant,
  createAdminVariant,
} from "@/lib/adminApi";

type Props = {
  product: Product | null;
  variant: ProductVariant | null;
  onClose: () => void;
  onSaved: (
    product: Product,
    variant: ProductVariant | null,
  ) => void;
};

const inputCls =
  "w-full rounded-[10px] border border-[#E9E3EE] bg-[#FAFAFA] px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF] focus:bg-white";

export default function ProductEditModal({
  product,
  variant,
  onClose,
  onSaved,
}: Props) {
  const isNew = !product;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [productName, setProductName] = useState(
    product?.productName ?? "",
  );

  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? 0,
  );

  const [slug, setSlug] = useState(
    product?.slug ?? "",
  );

  const [brand, setBrand] = useState(
    product?.brand ?? "",
  );

  const [manufacturer, setManufacturer] = useState(
    product?.manufacturer ?? "",
  );

  const [description, setDescription] = useState(
    product?.description ?? "",
  );

  const [composition, setComposition] = useState(
    product?.composition ?? "",
  );

  const [dosageForm, setDosageForm] = useState(
    product?.dosageForm ?? "",
  );

  const [prescriptionRequired, setPrescriptionRequired] =
    useState(product?.prescriptionRequired ?? false);

  const [productStatus, setProductStatus] = useState<
    "ACTIVE" | "INACTIVE" | "DISCONTINUED"
  >(
    product?.productStatus ?? "ACTIVE",
  );

  /* Variant */

  const [sku, setSku] = useState(
    variant?.sku ?? "",
  );

  const [variantName, setVariantName] = useState(
    variant?.variantName ?? "Default",
  );

  const [strength, setStrength] = useState(
    variant?.strength ?? "",
  );

  const [packSize, setPackSize] = useState(
    variant?.packSize ?? "",
  );

  const [unitOfMeasure, setUnitOfMeasure] = useState(
    variant?.unitOfMeasure ?? "",
  );

  const [mrp, setMrp] = useState(
    variant?.mrp ?? 0,
  );

  const [sellingPrice, setSellingPrice] = useState(
    variant?.sellingPrice ?? 0,
  );

  const [gstPercentage, setGstPercentage] = useState(
    variant?.gstPercentage ?? 0,
  );

  const [reorderLevel, setReorderLevel] = useState(
    variant?.reorderLevel ?? 0,
  );

  const [weight, setWeight] = useState(
    variant?.weight ?? 0,
  );

  const [dimensions, setDimensions] = useState(
    variant?.dimensions ?? "",
  );

  const [isActive, setIsActive] = useState(
    variant?.isActive ?? true,
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  async function handleSave() {
    setError("");

    if (!productName.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!categoryId) {
      setError("Category ID is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (sellingPrice < 0 || mrp < 0) {
      setError("Price cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      /* -------------------------------------------------------------- */
      /* PRODUCT                                                        */
      /* -------------------------------------------------------------- */

      const productPayload: ProductRequest = {
        categoryId,
        productName: productName.trim(),
        slug: slug.trim(),
        brand: brand.trim() || undefined,
        manufacturer: manufacturer.trim() || undefined,
        description: description.trim() || undefined,
        composition: composition.trim() || undefined,
        dosageForm: dosageForm.trim() || undefined,
        prescriptionRequired,
        productStatus,
      };

      let savedProduct: Product;

      if (product) {
        savedProduct = await updateAdminProduct(
          product.productId,
          productPayload,
        );
      } else {
        savedProduct = await createProductNotAvailable(
          productPayload,
        );
      }

      /* -------------------------------------------------------------- */
      /* VARIANT                                                        */
      /* -------------------------------------------------------------- */

      const variantPayload: ProductVariantRequest = {
        productId: savedProduct.productId,

        sku:
          sku.trim() ||
          `${savedProduct.slug}-default`,

        variantName:
          variantName.trim() || "Default",

        strength:
          strength.trim() || undefined,

        packSize:
          packSize.trim() || undefined,

        unitOfMeasure:
          unitOfMeasure.trim() || undefined,

        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        gstPercentage: Number(gstPercentage),
        reorderLevel: Number(reorderLevel),

        weight:
          weight
            ? Number(weight)
            : undefined,

        dimensions:
          dimensions.trim() || undefined,

        isActive,
      };

      let savedVariant: ProductVariant | null = null;

      if (variant) {
        savedVariant = await updateAdminVariant(
          variant.variantId,
          variantPayload,
        );
      } else {
        savedVariant = await createAdminVariant(
          variantPayload,
        );
      }

      onSaved(savedProduct, savedVariant);

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save product.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex w-full max-w-2xl flex-col rounded-[24px] bg-white shadow-2xl max-h-[92vh]">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4 shrink-0">
          <div>
            <h2 className="text-[17px] font-extrabold text-[#2E0569]">
              {isNew ? "Add Product" : "Edit Product"}
            </h2>

            <p className="text-[12px] text-[#9B93A1] mt-0.5">
              {isNew
                ? "Create a new product and variant."
                : `Editing: ${product?.productName}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF]"
          >
            <X size={15} />
          </button>
        </div>

        {/* BODY */}

        <div className="overflow-y-auto px-6 py-5 space-y-6">

          {error && (
            <div className="rounded-[10px] bg-[#FDECEA] px-4 py-3 text-[13px] font-semibold text-[#8B1A1A]">
              {error}
            </div>
          )}

          {/* PRODUCT */}

          <Section title="Product Information">

            <Field label="Product Name">
              <input
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);

                  if (isNew) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, ""),
                    );
                  }
                }}
                className={inputCls}
                placeholder="Ashwagandha Capsules"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">

              <Field label="Category ID">
                <input
                  type="number"
                  value={categoryId || ""}
                  onChange={(e) =>
                    setCategoryId(
                      Number(e.target.value),
                    )
                  }
                  className={inputCls}
                  placeholder="1"
                />
              </Field>

              <Field label="Slug">
                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value)
                  }
                  className={inputCls}
                />
              </Field>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <Field label="Brand">
                <input
                  value={brand}
                  onChange={(e) =>
                    setBrand(e.target.value)
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="Manufacturer">
                <input
                  value={manufacturer}
                  onChange={(e) =>
                    setManufacturer(e.target.value)
                  }
                  className={inputCls}
                />
              </Field>

            </div>

            <Field label="Description">
              <textarea
                rows={3}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className={`${inputCls} resize-none`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">

              <Field label="Composition">
                <input
                  value={composition}
                  onChange={(e) =>
                    setComposition(e.target.value)
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="Dosage Form">
                <input
                  value={dosageForm}
                  onChange={(e) =>
                    setDosageForm(e.target.value)
                  }
                  className={inputCls}
                />
              </Field>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <Field label="Product Status">
                <select
                  value={productStatus}
                  onChange={(e) =>
                    setProductStatus(
                      e.target.value as
                        | "ACTIVE"
                        | "INACTIVE"
                        | "DISCONTINUED",
                    )
                  }
                  className={inputCls}
                >
                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="INACTIVE">
                    INACTIVE
                  </option>

                  <option value="DISCONTINUED">
                    DISCONTINUED
                  </option>
                </select>
              </Field>

              <Field label="Prescription Required">
                <select
                  value={
                    prescriptionRequired
                      ? "true"
                      : "false"
                  }
                  onChange={(e) =>
                    setPrescriptionRequired(
                      e.target.value === "true",
                    )
                  }
                  className={inputCls}
                >
                  <option value="false">
                    No
                  </option>

                  <option value="true">
                    Yes
                  </option>
                </select>
              </Field>

            </div>

          </Section>

          {/* VARIANT */}

          <Section title="Product Variant">

            <div className="grid grid-cols-2 gap-4">

              <Field label="SKU">
                <input
                  value={sku}
                  onChange={(e) =>
                    setSku(e.target.value)
                  }
                  className={inputCls}
                  placeholder="ashwagandha-default"
                />
              </Field>

              <Field label="Variant Name">
                <input
                  value={variantName}
                  onChange={(e) =>
                    setVariantName(e.target.value)
                  }
                  className={inputCls}
                  placeholder="Default"
                />
              </Field>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <Field label="Strength">
                <input
                  value={strength}
                  onChange={(e) =>
                    setStrength(e.target.value)
                  }
                  className={inputCls}
                  placeholder="500mg"
                />
              </Field>

              <Field label="Pack Size">
                <input
                  value={packSize}
                  onChange={(e) =>
                    setPackSize(e.target.value)
                  }
                  className={inputCls}
                  placeholder="60 capsules"
                />
              </Field>

            </div>

            <Field label="Unit of Measure">
              <input
                value={unitOfMeasure}
                onChange={(e) =>
                  setUnitOfMeasure(e.target.value)
                }
                className={inputCls}
                placeholder="Capsules"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">

              <Field label="MRP (₹)">
                <input
                  type="number"
                  min={0}
                  value={mrp}
                  onChange={(e) =>
                    setMrp(Number(e.target.value))
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="Selling Price (₹)">
                <input
                  type="number"
                  min={0}
                  value={sellingPrice}
                  onChange={(e) =>
                    setSellingPrice(
                      Number(e.target.value),
                    )
                  }
                  className={inputCls}
                />
              </Field>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <Field label="GST Percentage">
                <input
                  type="number"
                  min={0}
                  value={gstPercentage}
                  onChange={(e) =>
                    setGstPercentage(
                      Number(e.target.value),
                    )
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="Reorder Level">
                <input
                  type="number"
                  min={0}
                  value={reorderLevel}
                  onChange={(e) =>
                    setReorderLevel(
                      Number(e.target.value),
                    )
                  }
                  className={inputCls}
                />
              </Field>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <Field label="Weight">
                <input
                  type="number"
                  min={0}
                  value={weight}
                  onChange={(e) =>
                    setWeight(
                      Number(e.target.value),
                    )
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="Dimensions">
                <input
                  value={dimensions}
                  onChange={(e) =>
                    setDimensions(e.target.value)
                  }
                  className={inputCls}
                  placeholder="10 x 10 x 20 cm"
                />
              </Field>

            </div>

            <label className="flex items-center gap-2 text-[13px] font-semibold text-[#2E0569]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) =>
                  setIsActive(e.target.checked)
                }
              />

              Active Variant
            </label>

          </Section>

        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-end gap-3 border-t border-[#E9E3EE] px-6 py-4 shrink-0">

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-[12px] border border-[#E9E3EE] px-5 py-2.5 text-[13px] font-extrabold text-[#716A78]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[12px] bg-[#8C52FF] px-5 py-2.5 text-[13px] font-extrabold text-white disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : isNew
                ? "Add Product"
                : "Save Changes"}
          </button>

        </div>

      </div>
    </div>
  );
}

/**
 * Your backend ProductController currently supports product creation,
 * so replace this implementation with createAdminProduct import if
 * you want Add Product enabled.
 */
async function createProductNotAvailable(
  request: ProductRequest,
): Promise<Product> {
  const { createAdminProduct } = await import(
    "@/lib/adminApi"
  );

  return createAdminProduct(request);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">
        {title}
      </p>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-extrabold text-[#2E0569]">
        {label}
      </label>

      {children}
    </div>
  );
}