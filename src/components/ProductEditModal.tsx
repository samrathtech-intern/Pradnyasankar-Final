"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, Upload, Eye, EyeOff } from "lucide-react";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQty: number;
  featured: boolean;
  image: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string;
  ingredients: string;
};

type Props = {
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (p: AdminProduct) => void;
};

const CATEGORIES = ["Ayurveda", "Nutraceuticals", "External Wellness"];

export default function ProductEditModal({ product, onClose, onSave }: Props) {
  const isNew = !product?.id;
  const [form, setForm] = useState<AdminProduct>(
    product ?? {
      id: "",
      name: "",
      category: "Ayurveda",
      price: 0,
      stockQty: 0,
      featured: false,
      image: "",
      shortDescription: "",
      fullDescription: "",
      benefits: "",
      ingredients: "",
    }
  );
  const [previewImage, setPreviewImage] = useState<string>(product?.image ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function set<K extends keyof AdminProduct>(key: K, value: AdminProduct[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    set("image", url);
  }

  function handleSave() {
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, "-");
    onSave({ ...form, id });
  }

  const inStock = form.stockQty > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex w-full max-w-2xl flex-col rounded-[24px] bg-white shadow-2xl max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E9E3EE] px-6 py-4 shrink-0">
          <div>
            <h2 className="text-[17px] font-extrabold tracking-[-.03em] text-[#2E0569]">
              {isNew ? "Add Product" : "Edit Product"}
            </h2>
            <p className="text-[12px] text-[#9B93A1] mt-0.5">
              {isNew ? "Fill in the details to add a new product." : `Editing: ${product?.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EEFF] text-[#8C52FF] transition hover:bg-[#EAD9FF]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6">

          {/* Basic Information */}
          <Section title="Basic Information">
            <Field label="Product Name">
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Ashwagandha Capsules"
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Price (₹)">
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          {/* Inventory */}
          <Section title="Inventory">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Stock Quantity">
                <input
                  type="number"
                  min={0}
                  value={form.stockQty}
                  onChange={(e) => set("stockQty", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
              <Field label="Status">
                <div className={`flex h-10 items-center rounded-[10px] border px-3 text-[13px] font-extrabold ${inStock ? "border-[#C3E6B0] bg-[#EAF4E4] text-[#315C20]" : "border-[#F5C6C6] bg-[#FDECEA] text-[#8B1A1A]"}`}>
                  <span className={`mr-2 h-2 w-2 rounded-full ${inStock ? "bg-[#4CAF50]" : "bg-[#E53935]"}`} />
                  {inStock ? "In Stock" : "Out of Stock"}
                </div>
              </Field>
            </div>
            <Field label="">
              <label className="flex cursor-pointer items-center gap-2.5">
                <div
                  onClick={() => set("featured", !form.featured)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${form.featured ? "bg-[#8C52FF]" : "bg-[#D9D0E3]"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-[13px] font-semibold text-[#2E0569]">Mark as Featured</span>
              </label>
            </Field>
          </Section>

          {/* Content */}
          <Section title="Content">
            <Field label="Short Description">
              <input
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="One-line product summary"
                className={inputCls}
              />
            </Field>
            <Field label="Full Description">
              <textarea
                rows={3}
                value={form.fullDescription}
                onChange={(e) => set("fullDescription", e.target.value)}
                placeholder="Detailed product description…"
                className={`${inputCls} resize-none`}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Benefits">
                <textarea
                  rows={3}
                  value={form.benefits}
                  onChange={(e) => set("benefits", e.target.value)}
                  placeholder="List key benefits…"
                  className={`${inputCls} resize-none`}
                />
              </Field>
              <Field label="Ingredients">
                <textarea
                  rows={3}
                  value={form.ingredients}
                  onChange={(e) => set("ingredients", e.target.value)}
                  placeholder="List key ingredients…"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </Section>

          {/* Media */}
          <Section title="Media">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[14px] border border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                {previewImage ? (
                  <Image src={previewImage} alt="preview" fill className="object-contain p-2" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#C4B8D0]">
                    <Upload size={22} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-[#716A78] mb-2">
                  Upload a product image (PNG, WEBP, JPG)
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-[10px] border border-[#8C52FF] px-4 py-2 text-[12px] font-extrabold text-[#8C52FF] transition hover:bg-[#F4EEFF]"
                >
                  {previewImage ? "Replace Image" : "Upload Image"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E9E3EE] px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="rounded-[12px] border border-[#E9E3EE] px-5 py-2.5 text-[13px] font-extrabold text-[#716A78] transition hover:bg-[#FAFAFA]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-[12px] bg-[#8C52FF] px-5 py-2.5 text-[13px] font-extrabold text-white transition hover:bg-[#7A3FEE]"
          >
            {isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF]">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-[12px] font-extrabold text-[#2E0569]">{label}</label>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-[#E9E3EE] bg-[#FAFAFA] px-3 py-2.5 text-[13px] font-semibold text-[#2E0569] outline-none transition placeholder:text-[#9B93A1] focus:border-[#8C52FF] focus:bg-white";
