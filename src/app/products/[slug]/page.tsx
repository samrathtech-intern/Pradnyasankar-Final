"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Heart,
  Info,
  Leaf,
  Loader2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  ZoomIn,
} from "lucide-react";
import { useApp } from "@/components/AppContext";
import { PageLayout } from "@/components/PageLayout";
import { Reveal } from "@/components/Reveal";
import { NotifyMeFull } from "@/components/NotifyMe";
import { useEffect } from "react";
import { useProducts } from "@/lib/useProducts";
import { trackViewItem } from "@/lib/analytics";

/* ── static product detail content (placeholder until CMS) ─────────── */
const productDetails: Record<
  string,
  {
    gst: number;
    packSize: string;
    composition: string[];
    benefits: string[];
    directions: string;
    warnings: string[];
    storage: string;
    manufacturer: string;
    licence: string;
    disclaimer: string;
  }
> = {
  "ashwagandha-capsules": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Ashwagandha root extract (Withania somnifera) 300 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports everyday vitality and energy levels", "Part of a daily wellness routine", "Convenient capsule format for consistent use"],
    directions: "Take 1 capsule twice daily after meals with water, or as directed by a qualified health professional.",
    warnings: ["Not recommended during pregnancy or lactation without professional guidance", "Keep out of reach of children", "Do not exceed the recommended daily intake", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Ayurvedic Proprietary Medicine — Licence details to be confirmed",
    disclaimer: "This product is not intended to diagnose, treat, cure or prevent any disease. Refer to the product label for complete information.",
  },
  "plant-protein": {
    gst: 18,
    packSize: "500 g (approx. 25 servings)",
    composition: ["Pea protein isolate 20 g per serving", "Brown rice protein 5 g per serving", "Natural flavour", "Stevia leaf extract (sweetener)"],
    benefits: ["Supports daily protein intake goals", "Plant-based and suitable for vegetarians", "Easy-to-mix powder format"],
    directions: "Mix 1 scoop (approx. 30 g) with 200–250 ml of water or milk. Consume once daily or as directed.",
    warnings: ["Not a meal replacement", "Consult a healthcare professional before use if you have a medical condition", "Keep out of reach of children"],
    storage: "Store in a cool, dry place. Seal tightly after each use.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "daily-greens": {
    gst: 18,
    packSize: "250 g (approx. 25 servings)",
    composition: ["Spirulina powder 500 mg per serving", "Wheatgrass powder 500 mg per serving", "Moringa leaf powder 300 mg per serving", "Natural flavour", "Stevia leaf extract (sweetener)"],
    benefits: ["Supports daily greens intake", "Convenient powder format for everyday use", "Suitable for vegetarians and vegans"],
    directions: "Mix 1 scoop (approx. 10 g) with 200 ml of water or juice. Consume once daily, preferably in the morning.",
    warnings: ["Not a meal replacement", "Keep out of reach of children", "Consult a healthcare professional before use if you have a medical condition"],
    storage: "Store in a cool, dry place away from direct sunlight. Seal tightly after each use.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "immunity-booster": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Vitamin C (Ascorbic acid) 250 mg", "Zinc (as Zinc gluconate) 10 mg", "Elderberry extract 100 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports normal immune function", "Provides antioxidant nutrition", "Convenient daily capsule format"],
    directions: "Take 1 capsule daily after a meal with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Not recommended during pregnancy or lactation without professional guidance", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "multivitamin": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Vitamin A 600 mcg", "Vitamin C 80 mg", "Vitamin D3 10 mcg", "Vitamin E 12 mg", "Vitamin B12 2.5 mcg", "Folic acid 200 mcg", "Iron 14 mg", "Zinc 10 mg", "Magnesium stearate (lubricant)"],
    benefits: ["Supports everyday nutritional requirements", "Convenient all-in-one daily format", "Suitable for adults as part of a balanced diet"],
    directions: "Take 1 capsule daily after a meal with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Not a substitute for a varied and balanced diet", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "triphala": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Amalaki (Emblica officinalis) fruit powder 167 mg", "Bibhitaki (Terminalia bellirica) fruit powder 167 mg", "Haritaki (Terminalia chebula) fruit powder 166 mg", "Magnesium stearate (lubricant)"],
    benefits: ["Traditional Ayurvedic combination for digestive wellness", "Convenient modern capsule format", "Part of a daily Ayurvedic routine"],
    directions: "Take 1–2 capsules at bedtime with warm water, or as directed by a qualified Ayurvedic practitioner.",
    warnings: ["Not recommended during pregnancy without professional guidance", "Keep out of reach of children", "Do not exceed the recommended daily intake", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Ayurvedic Proprietary Medicine — Licence details to be confirmed",
    disclaimer: "This product is not intended to diagnose, treat, cure or prevent any disease. Refer to the product label for complete information.",
  },
  "chyawanprash": {
    gst: 12,
    packSize: "500 g",
    composition: ["Amalaki (Emblica officinalis) 40%", "Ashwagandha (Withania somnifera) root", "Pippali (Piper longum)", "Brahmi (Bacopa monnieri)", "Honey", "Ghee", "Sesame oil", "Sugar"],
    benefits: ["Traditional Ayurvedic wellness formulation", "Supports everyday vitality and immunity", "Familiar lehya format for daily use"],
    directions: "Take 1–2 teaspoons (5–10 g) daily with warm milk or water, preferably in the morning, or as directed by a qualified Ayurvedic practitioner.",
    warnings: ["Contains honey — not suitable for infants under 1 year", "Contains sugar — use with caution if managing blood sugar", "Keep out of reach of children", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed after use.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Ayurvedic Proprietary Medicine — Licence details to be confirmed",
    disclaimer: "This product is not intended to diagnose, treat, cure or prevent any disease. Refer to the product label for complete information.",
  },
  "herbal-hair-oil": {
    gst: 18,
    packSize: "200 ml",
    composition: ["Coconut oil (base)", "Bhringraj (Eclipta alba) extract", "Amla (Emblica officinalis) extract", "Brahmi (Bacopa monnieri) extract", "Neem (Azadirachta indica) extract", "Natural fragrance"],
    benefits: ["External-use hair oil for scalp and hair care", "Botanical ingredients for a traditional hair-care ritual", "Suitable for regular use as part of a hair-wellness routine"],
    directions: "Apply a small amount to the scalp and hair. Massage gently. Leave for at least 30 minutes before washing. For external use only.",
    warnings: ["For external use only", "Avoid contact with eyes", "Discontinue use if irritation occurs", "Keep out of reach of children", "Patch test recommended before first use"],
    storage: "Store in a cool, dry place away from direct sunlight.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Cosmetic — Licence details to be confirmed",
    disclaimer: "This is an external-use cosmetic product. It is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "herbal-hair-serum": {
    gst: 18,
    packSize: "50 ml",
    composition: ["Argan oil", "Bhringraj (Eclipta alba) extract", "Keratin hydrolysate", "Vitamin E (Tocopherol)", "Dimethicone (conditioning agent)", "Natural fragrance"],
    benefits: ["Lightweight serum for hair smoothing and shine", "External-use format for modern hair-care routines", "Suitable for all hair types"],
    directions: "Apply a few drops to damp or dry hair, focusing on mid-lengths and ends. Do not rinse. For external use only.",
    warnings: ["For external use only", "Avoid contact with eyes", "Discontinue use if irritation occurs", "Keep out of reach of children"],
    storage: "Store in a cool, dry place away from direct sunlight.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Cosmetic — Licence details to be confirmed",
    disclaimer: "This is an external-use cosmetic product. It is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "face-serum": {
    gst: 18,
    packSize: "30 ml",
    composition: ["Aloe vera (Aloe barbadensis) gel", "Niacinamide 5%", "Hyaluronic acid", "Saffron (Crocus sativus) extract", "Rose (Rosa damascena) water", "Vitamin C (Ascorbyl glucoside)"],
    benefits: ["Botanical external-care serum for skin-focused routines", "Lightweight formula suitable for daily use", "Suitable for all skin types"],
    directions: "Apply 2–3 drops to cleansed face and neck. Gently pat until absorbed. Use morning and/or evening. For external use only.",
    warnings: ["For external use only", "Avoid contact with eyes", "Discontinue use if irritation occurs", "Keep out of reach of children", "Patch test recommended before first use"],
    storage: "Store in a cool, dry place away from direct sunlight.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Cosmetic — Licence details to be confirmed",
    disclaimer: "This is an external-use cosmetic product. It is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "glow-cream": {
    gst: 18,
    packSize: "50 g",
    composition: ["Shea butter", "Aloe vera (Aloe barbadensis) gel", "Turmeric (Curcuma longa) extract", "Saffron (Crocus sativus) extract", "Vitamin E (Tocopherol)", "Natural fragrance"],
    benefits: ["Moisturising cream for everyday skin care", "Botanical ingredients for a skin-glow routine", "Suitable for daily external use"],
    directions: "Apply a small amount to cleansed face and neck. Massage gently until absorbed. Use morning and/or evening. For external use only.",
    warnings: ["For external use only", "Avoid contact with eyes", "Discontinue use if irritation occurs", "Keep out of reach of children", "Patch test recommended before first use"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Cosmetic — Licence details to be confirmed",
    disclaimer: "This is an external-use cosmetic product. It is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "digestive-support": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Ginger (Zingiber officinale) extract 150 mg", "Peppermint (Mentha piperita) extract 100 mg", "Fennel (Foeniculum vulgare) seed powder 100 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports digestive comfort as part of a wellness routine", "Botanical capsule format for everyday digestive wellness", "Convenient daily supplement"],
    directions: "Take 1 capsule twice daily after meals with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Not recommended during pregnancy without professional guidance", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "tulsi-giloy": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Tulsi (Ocimum tenuiflorum) leaf extract 250 mg", "Giloy (Tinospora cordifolia) stem extract 250 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Traditional Ayurvedic botanicals in a convenient capsule format", "Supports everyday immunity and wellness routines", "Suitable for daily use"],
    directions: "Take 1 capsule twice daily after meals with water, or as directed by a qualified Ayurvedic practitioner.",
    warnings: ["Not recommended during pregnancy or lactation without professional guidance", "Keep out of reach of children", "Do not exceed the recommended daily intake", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Ayurvedic Proprietary Medicine — Licence details to be confirmed",
    disclaimer: "This product is not intended to diagnose, treat, cure or prevent any disease. Refer to the product label for complete information.",
  },
  "vitamin-c": {
    gst: 12,
    packSize: "60 Tablets",
    composition: ["Vitamin C (Ascorbic acid) 500 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports normal immune function", "Provides antioxidant nutrition", "Convenient tablet format for daily use"],
    directions: "Take 1 tablet daily after a meal with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "High doses may cause digestive discomfort in sensitive individuals", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "zinc-selenium": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Zinc (as Zinc gluconate) 15 mg", "Selenium (as Sodium selenate) 55 mcg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports normal immune function", "Provides essential mineral nutrition", "Convenient capsule format for daily use"],
    directions: "Take 1 capsule daily after a meal with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Consult a healthcare professional if you are on medication or have a medical condition"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "joint-support": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Boswellia (Boswellia serrata) extract 200 mg", "Turmeric (Curcuma longa) extract 150 mg", "Collagen peptides 100 mg", "Vitamin D3 10 mcg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports joint comfort and mobility as part of a wellness routine", "Botanical and nutritional capsule format", "Suitable for adults with active lifestyles"],
    directions: "Take 1 capsule twice daily after meals with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Not recommended during pregnancy without professional guidance", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "sleep-support": {
    gst: 12,
    packSize: "60 Capsules",
    composition: ["Ashwagandha root extract (Withania somnifera) 200 mg", "L-Theanine 100 mg", "Magnesium (as Magnesium glycinate) 100 mg", "Chamomile (Matricaria chamomilla) extract 50 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports relaxation and calm as part of an evening wellness routine", "Botanical and nutritional capsule format", "Suitable for adults"],
    directions: "Take 1–2 capsules 30–60 minutes before bedtime with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Not recommended during pregnancy or lactation without professional guidance", "Consult a healthcare professional if you are on medication", "Do not operate heavy machinery after use"],
    storage: "Store in a cool, dry place away from direct sunlight. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
  "probiotic-gut-balance": {
    gst: 12,
    packSize: "30 Capsules",
    composition: ["Lactobacillus acidophilus 2 billion CFU", "Bifidobacterium longum 1 billion CFU", "Lactobacillus rhamnosus 1 billion CFU", "Fructooligosaccharides (prebiotic) 100 mg", "Microcrystalline cellulose (filler)", "Magnesium stearate (lubricant)"],
    benefits: ["Supports digestive wellness as part of a daily routine", "Probiotic and prebiotic combination capsule format", "Suitable for adults"],
    directions: "Take 1 capsule daily after a meal with water, or as directed by a qualified health professional.",
    warnings: ["Do not exceed the recommended daily intake", "Keep out of reach of children", "Consult a healthcare professional before use if you have a compromised immune system", "Consult a healthcare professional if you are on medication"],
    storage: "Store in a cool, dry place away from direct sunlight. Refrigeration recommended after opening. Keep the container tightly closed.",
    manufacturer: "Pradnyasanskar Enterprises Pvt. Ltd., India",
    licence: "Nutraceutical — Licence details to be confirmed",
    disclaimer: "This product is a food supplement and is not intended to diagnose, treat, cure or prevent any disease.",
  },
};

const TABS = ["Composition", "Benefits & Use", "Directions", "Warnings", "Trust & Details"] as const;
type Tab = (typeof TABS)[number];

function VegMarker({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={`inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] border ${
        isVeg ? "border-[#3A7D2C] bg-white" : "border-[#B03A2E] bg-white"
      }`}
    >
      <span className={`h-[7px] w-[7px] rounded-full ${
        isVeg ? "bg-[#3A7D2C]" : "bg-[#B03A2E]"
      }`} />
    </span>
  );
}

function statusStyle(status: string) {
  if (status === "Featured") return "bg-[#2E0569] text-white";
  if (status === "New") return "bg-[#EAF4E4] text-[#315C20]";
  return "bg-[#FFF1DA] text-[#9A5D0A]";
}

function PincodeCheck() {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "unavailable">("idle");

  function check() {
    if (pin.length !== 6) return;
    setStatus("checking");
    setTimeout(() => {
      // Simulate: pincodes starting with 4 or 5 are serviceable (Maharashtra / Karnataka)
      setStatus(/^[45]/.test(pin) ? "ok" : "unavailable");
    }, 700);
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Enter 6-digit pincode"
          className="min-h-11 flex-1 rounded-full border border-[#E9E3EE] bg-white px-4 text-[13px] font-semibold text-[#2E0569] outline-none transition focus:border-[#8C52FF] placeholder:text-[#9B93A1]"
        />
        <button
          onClick={check}
          disabled={pin.length !== 6 || status === "checking"}
          className="min-h-11 rounded-full bg-[#2E0569] px-5 text-[11px] font-extrabold uppercase tracking-[.1em] text-white transition hover:bg-[#8C52FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "checking" ? "…" : "Check"}
        </button>
      </div>
      {status === "ok" && (
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#315C20]">
          <span className="h-2 w-2 rounded-full bg-[#4CAF50]" />
          Delivery available to {pin} — estimated 3–5 business days.
        </p>
      )}
      {status === "unavailable" && (
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#8B8292]">
          <span className="h-2 w-2 rounded-full bg-[#9B93A1]" />
          Delivery not available to {pin} at this time.
        </p>
      )}
    </div>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { products, loading, error } = useProducts();
  // Match by slug first (the canonical detail URL), falling back to id (productId).
  const product = products.find((p) => p.slug === slug) ?? products.find((p) => p.id === slug);

  const detail = productDetails[slug];
  const { bag, saved, addToBag, toggleSaved } = useApp();
  const bagItem = bag.find((item) => item.id === product?.id);
  const inBag = !!bagItem;
  const isSaved = product ? saved.includes(product.id) : false;

  const [activeTab, setActiveTab] = useState<Tab>("Composition");
  const [zoomed, setZoomed] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      trackViewItem({ id: product.id, name: product.name, range: product.range, format: product.format, price: product.price });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Do not 404 while the catalogue is still loading from the API.
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FFFDF7] px-8 text-center">
        <Loader2 size={34} className="animate-spin text-[#8C52FF]" />
        <p className="mt-5 text-[18px] font-extrabold text-[#2E0569]">Loading product…</p>
        <p className="mt-2 text-[13px] text-[#716A78]">Fetching the latest product details from the store.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FFFDF7] px-8 text-center">
        <p className="text-[22px] font-extrabold text-[#2E0569]">Couldn't load this product.</p>
        <p className="mt-3 text-[14px] text-[#716A78]">{error}</p>
        <Link href="/shop" className="btn-primary mt-6">Back to shop</Link>
      </div>
    );
  }

  if (!product) return notFound();

  const related = products
    .filter((p) => p.id !== product.id && (p.range === product.range || p.goals.some((g) => product.goals.includes(g))))
    .slice(0, 4);

  const rangeHref = product.range === "Ayurveda" ? "/shop/ayurveda" : product.range === "Nutraceuticals" ? "/shop/nutraceuticals" : "/shop";

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* Breadcrumb */}
      <div className="border-b border-[#E9E3EE] bg-white">
        <div className="container-page flex items-center gap-2 py-4 text-[11px] font-semibold text-[#8B8292]">
          <Link href="/" className="hover:text-[#2E0569] transition">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#2E0569] transition">Shop</Link>
          <span>/</span>
          <Link href={rangeHref} className="hover:text-[#2E0569] transition">{product.range}</Link>
          <span>/</span>
          <span className="text-[#2E0569]">{product.name}</span>
        </div>
      </div>

      <div className="container-page py-10 lg:py-16">
        {/* Back link */}
        <Link
          href={rangeHref}
          className="mb-8 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[.1em] text-[#8C52FF] transition hover:text-[#2E0569]"
        >
          <ArrowLeft size={14} /> Back to {product.range}
        </Link>

        {/* Main product grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ── Image panel ── */}
          <Reveal>
            <div className="relative">
              <div
                className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-[32px] border border-[#E9E3EE] bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]"
                onClick={() => setZoomed(true)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-10 transition duration-500 group-hover:scale-[1.04]"
                  priority
                />
                <span className={`absolute left-5 top-5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] ${statusStyle(product.status)}`}>
                  {product.status}
                </span>
                <span className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[10px] font-extrabold text-[#2E0569] backdrop-blur-sm">
                  <ZoomIn size={13} /> Tap to zoom
                </span>
              </div>
            </div>
          </Reveal>

          {/* ── Purchase block ── */}
          <Reveal delay={0.08}>
            <div className="flex flex-col">
              {/* Range + format */}
              <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[.14em]">
                <span className="text-[#8C52FF]">{product.range}</span>
                <span className="text-[#D8CEE1]">·</span>
                <VegMarker isVeg={product.isVeg} />
                <span className="text-[#8B8292]">{product.format}</span>
              </div>

              {/* Name */}
              <h1 className="mt-4 text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.05] tracking-[-.04em] text-[#2E0569]">
                {product.name}
              </h1>

              {/* Descriptor */}
              <p className="mt-4 text-[15px] leading-[1.8] text-[#716A78]">{product.descriptor}</p>

              {/* Goals */}
              <div className="mt-5 flex flex-wrap gap-2">
                {product.goals.map((g) => (
                  <span key={g} className="rounded-full border border-[#E9E3EE] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.1em] text-[#6D5A7C]">
                    {g}
                  </span>
                ))}
              </div>

              {/* Price block */}
              {detail ? (
                <div className="mt-7 rounded-[22px] border border-[#E9E3EE] bg-white p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[32px] font-extrabold tracking-[-.04em] text-[#2E0569]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.mrp !== product.price && (
                      <span className="text-[16px] font-semibold text-[#8B8292] line-through">
                        ₹{product.mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                    {product.mrp !== product.price && (
                      <span className="rounded-full bg-[#EAF4E4] px-2.5 py-1 text-[10px] font-extrabold text-[#315C20]">
                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-[#8B8292]">
                    Incl. {detail.gst}% GST · {detail.packSize}
                  </p>
                </div>
              ) : (
                <div className="mt-7 rounded-[22px] border border-[#E9E3EE] bg-white p-5">
                  <p className="text-[14px] font-semibold text-[#716A78]">Price and pack details coming soon.</p>
                </div>
              )}

              {/* Quantity selector */}
              {product.inStock && (
                <div className="mt-5 flex items-center gap-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#716A78]">Quantity</p>
                  <div className="flex items-center gap-0 rounded-full border border-[#E9E3EE] bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                      className="grid h-10 w-10 place-items-center rounded-full text-[#2E0569] transition hover:bg-[#F4EEFF] disabled:cursor-not-allowed disabled:text-[#C8C0D0]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[32px] text-center text-[15px] font-extrabold text-[#2E0569]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(10, q + 1))}
                      disabled={qty >= 10}
                      aria-label="Increase quantity"
                      className="grid h-10 w-10 place-items-center rounded-full text-[#2E0569] transition hover:bg-[#F4EEFF] disabled:cursor-not-allowed disabled:text-[#C8C0D0]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {qty > 1 && (
                    <p className="text-[11px] font-semibold text-[#8B8292]">
                      ₹{(product.price * qty).toLocaleString("en-IN")} total
                    </p>
                  )}
                </div>
              )}

              {/* Pincode check */}
              <div className="mt-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#716A78]">Check delivery</p>
                <PincodeCheck />
              </div>

              {/* Stock indicator */}
              <div className={`mt-4 flex items-center gap-2 text-[12px] font-semibold ${
                product.inStock ? "text-[#315C20]" : "text-[#8B8292]"
              }`}>
                <span className={`h-2 w-2 rounded-full ${
                  product.inStock ? "bg-[#4CAF50]" : "bg-[#9B93A1]"
                }`} />
                {product.inStock ? "In stock — ready to dispatch" : "Currently out of stock"}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                {!product.inStock ? (
                  <NotifyMeFull productId={product.id} productName={product.name} />
                ) : (
                <button
                  onClick={() => addToBag(product, qty)}
                  className={`flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full text-[12px] font-extrabold uppercase tracking-[.1em] transition ${
                    inBag
                      ? "bg-[#EAF4E4] text-[#315C20]"
                      : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"
                  }`}
                >
                  {inBag ? (
                    <><ShoppingBag size={16} /> In wellness bag ({bagItem!.quantity})</>
                  ) : (
                    <><Plus size={16} /> Add to bag</>
                  )}
                </button>
                )}
                <button
                  onClick={() => toggleSaved(product.id)}
                  aria-label={isSaved ? "Remove from saved" : "Save product"}
                  className={`grid h-[52px] w-[52px] place-items-center rounded-full border transition ${
                    isSaved
                      ? "border-[#8C52FF] bg-[#8C52FF] text-white"
                      : "border-[#E9E3EE] bg-white text-[#2E0569] hover:border-[#8C52FF] hover:text-[#8C52FF]"
                  }`}
                >
                  <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Delivery info */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Truck, label: "Free shipping", sub: "On orders above ₹499" },
                  { icon: Package, label: "Easy returns", sub: "Within 7 days of delivery" },
                  { icon: ShieldCheck, label: "Authentic product", sub: "Directly from Pradnyasanskar" },
                  { icon: Leaf, label: "Quality assured", sub: "Approved formulation" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3 rounded-[16px] border border-[#E9E3EE] bg-white p-3">
                    <Icon size={16} className="mt-0.5 shrink-0 text-[#8C52FF]" />
                    <div>
                      <p className="text-[11px] font-extrabold text-[#2E0569]">{label}</p>
                      <p className="text-[10px] text-[#8B8292]">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="mt-5 text-[10px] leading-relaxed text-[#8B8292]">
                <Info size={11} className="mr-1 inline" />
                This page supports product discovery. It does not provide diagnosis, prescription or personalised medical advice. Refer to the product label for complete directions and cautions.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ── Detail tabs ── */}
        <Reveal>
          <div className="mt-16">
            {/* Tab bar */}
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 min-h-[40px] rounded-full px-5 text-[11px] font-extrabold uppercase tracking-[.1em] transition ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#2E0569] to-[#8C52FF] text-white shadow-[0_6px_20px_rgba(140,82,255,.28)]"
                      : "border border-[#E9E3EE] bg-white text-[#2E0569] hover:border-[#8C52FF]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="mt-6 rounded-[28px] border border-[#E9E3EE] bg-white p-7 sm:p-10"
              >
                {activeTab === "Composition" && (
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#2E0569]">Composition</h2>
                    {detail ? (
                      <ul className="mt-5 space-y-3">
                        {detail.composition.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-[#716A78]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C52FF]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-[14px] text-[#716A78]">Full composition details will be available on the product label and updated here before launch.</p>
                    )}
                    <p className="mt-6 rounded-[16px] bg-[#FAF7FF] p-4 text-[11px] leading-relaxed text-[#8B8292]">
                      Composition is provided for general product information. Refer to the product label for the complete and current ingredient list.
                    </p>
                  </div>
                )}

                {activeTab === "Benefits & Use" && (
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#2E0569]">Approved Benefits & Use</h2>
                    {detail ? (
                      <ul className="mt-5 space-y-3">
                        {detail.benefits.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-[#716A78]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8C52FF]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-[14px] text-[#716A78]">Approved benefit statements will be published here before launch.</p>
                    )}
                    <p className="mt-6 rounded-[16px] bg-[#FAF7FF] p-4 text-[11px] leading-relaxed text-[#8B8292]">
                      These statements are for general product discovery only and do not imply treatment, cure or prevention of any disease or condition.
                    </p>
                  </div>
                )}

                {activeTab === "Directions" && (
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#2E0569]">Directions for Use</h2>
                    {detail ? (
                      <p className="mt-5 text-[14px] leading-[1.9] text-[#716A78]">{detail.directions}</p>
                    ) : (
                      <p className="mt-4 text-[14px] text-[#716A78]">Directions will be published here before launch. Refer to the product label.</p>
                    )}
                    <p className="mt-6 rounded-[16px] bg-[#FAF7FF] p-4 text-[11px] leading-relaxed text-[#8B8292]">
                      Always follow the directions on the product label. Consult a qualified health professional if you are unsure about suitability.
                    </p>
                  </div>
                )}

                {activeTab === "Warnings" && (
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#2E0569]">Warnings & Cautions</h2>
                    {detail ? (
                      <>
                        <ul className="mt-5 space-y-3">
                          {detail.warnings.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-[#716A78]">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E05252]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 space-y-2 text-[13px] text-[#716A78]">
                          <p><strong className="text-[#2E0569]">Storage:</strong> {detail.storage}</p>
                        </div>
                      </>
                    ) : (
                      <p className="mt-4 text-[14px] text-[#716A78]">Warnings and cautions will be published here before launch. Refer to the product label.</p>
                    )}
                  </div>
                )}

                {activeTab === "Trust & Details" && (
                  <div>
                    <h2 className="text-[20px] font-extrabold text-[#2E0569]">Trust & Product Details</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {[
                        { label: "Manufacturer / Marketer", value: detail?.manufacturer ?? "Pradnyasanskar Enterprises Pvt. Ltd., India" },
                        { label: "Licence / Registration", value: detail?.licence ?? "Licence details to be confirmed" },
                        { label: "Product classification", value: product.range },
                        { label: "Format", value: product.format },
                        { label: "Pack size", value: detail?.packSize ?? "See product label" },
                        { label: "Customer care", value: "Use the Contact page for product queries and support" },
                      ].map(({ label, value }) => (
                        <div key={label} className="rounded-[16px] border border-[#E9E3EE] p-4">
                          <p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#8C52FF]">{label}</p>
                          <p className="mt-1.5 text-[13px] font-semibold text-[#2E0569]">{value}</p>
                        </div>
                      ))}
                    </div>
                    {detail && (
                      <p className="mt-6 rounded-[16px] bg-[#FAF7FF] p-4 text-[11px] leading-relaxed text-[#8B8292]">
                        {detail.disclaimer}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <Reveal>
            <div className="mt-20">
              <span className="eyebrow">You may also like</span>
              <h2 className="section-heading mt-4">Related products</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => {
                  const pInBag = bag.some((item) => item.id === p.id);
                  return (
                    <article
                      key={p.id}
                      className="group flex flex-col overflow-hidden rounded-[28px] border border-[#E9E3EE] bg-white transition duration-300 hover:-translate-y-1.5 hover:border-[#CDBAF1] hover:shadow-[0_20px_50px_rgba(46,5,105,.10)]"
                    >
<Link href={`/products/${p.slug ?? p.id}`} className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#F4EEFF] to-[#FAF6FF]">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
                        />
                        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.13em] ${statusStyle(p.status)}`}>
                          {p.status}
                        </span>
                      </Link>
                      <div className="flex flex-1 flex-col border-t border-[#E9E3EE] p-5">
                        <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[.13em]">
                          <span className="text-[#8C52FF]">{p.range}</span>
                          <div className="flex items-center gap-1.5">
                            <VegMarker isVeg={p.isVeg} />
                            <span className="text-[#8B8292]">{p.format}</span>
                          </div>
                        </div>
<Link href={`/products/${p.slug ?? p.id}`}>
                          <h3 className="mt-3 text-[18px] font-extrabold leading-tight tracking-[-.03em] text-[#2E0569] hover:text-[#8C52FF] transition">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="mt-2 line-clamp-2 text-[12px] leading-[1.7] text-[#716A78]">{p.descriptor}</p>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-[16px] font-extrabold tracking-[-.03em] text-[#2E0569]">₹{p.price.toLocaleString("en-IN")}</span>
                          {p.mrp !== p.price && (
                            <span className="text-[11px] font-semibold text-[#8B8292] line-through">₹{p.mrp.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                        <div className="mt-auto pt-4">
                          <button
                            onClick={() => addToBag(p)}
                            disabled={!p.inStock}
                            className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-[11px] font-extrabold uppercase tracking-[.1em] transition ${
                              !p.inStock ? "cursor-not-allowed bg-[#F0EAF4] text-[#9B93A1]" : pInBag ? "bg-[#EAF4E4] text-[#315C20]" : "bg-[#8C52FF] text-white hover:bg-[#2E0569]"
                            }`}
                          >
                            {!p.inStock ? "Out of stock" : pInBag ? <><ShoppingBag size={14} /> In bag</> : <><Plus size={14} /> Add to bag</>}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        <div className="pb-16" />
      </div>

      {/* ── Zoom overlay ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[#21182B]/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative h-[min(90vw,700px)] w-[min(90vw,700px)] overflow-hidden rounded-[32px] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="700px"
                className="object-contain p-8"
              />
              <button
                onClick={() => setZoomed(false)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#2E0569] shadow-md transition hover:bg-white"
                aria-label="Close zoom"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.descriptor,
            image: `https://www.pradnyasanskar.com${product.image}`,
            brand: { "@type": "Brand", name: "Pradnyasanskar" },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: product.price,
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
url: `https://www.pradnyasanskar.com/products/${product.slug ?? product.id}`,
            },
          }),
        }}
      />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <PageLayout>
      <ProductDetailContent />
    </PageLayout>
  );
}
