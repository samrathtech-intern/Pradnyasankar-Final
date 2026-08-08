/**
 * Product API service
 *
 * Integration point with the backend (confirmed live at NEXT_PUBLIC_API_BASE_URL):
 * - GET /api/store/products — no authentication required.
 *
 * Expected response: a JSON array of product objects, e.g.
 * [
 *   {
 *     productId: 3,
 *     productName: "Paracetamol 500mg",
 *     slug: "paracetamol-500mg",
 *     category: "Pain Relief Medicines",
 *     brand: "Dolo",
 *     description: "Pain relief medicine",
 *     composition: "Paracetamol 500mg",
 *     dosageForm: "Tablet",
 *     prescriptionRequired: false,
 *     manufacturer: "Micro Labs",
 *     status: "New",
 *     isVeg: true,
 *     variantId: 2,
 *     variantName: "Strip of 10 Tablets",
 *     packSize: "10 Tablets",
 *     strength: "500 mg",
 *     price: 22.5,
 *     mrp: 25.0,
 *     discountPercentage: 10.0,
 *     image: "/images/xxx.png" | null,
 *     averageRating: 0,
 *     reviewCount: 0,
 *     stock: 519,
 *     available: true
 *   },
 *   ...
 * ]
 *
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to point to the backend.
 */

import type { Product } from "@/data";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/** Existing placeholder shown when a product has no image. */
export const PLACEHOLDER_IMAGE = "/logo.png";

/**
 * Fallback images keyed by lower-cased product name (and slug) to the images
 * the frontend used before. The backend database currently only has `null`
 * image URLs, so these keep the existing UI visuals intact until images are
 * migrated to the backend.
 */
const FALLBACK_IMAGES: Record<string, string> = {
  // by product name (lowercase)
  "ashwagandha capsules": "/images/ashwagandha-capsules.png",
  "plant protein": "/images/plant-protein.png",
  "daily greens": "/images/daily-greens.png",
  "immunity booster": "/images/immunity-booster.png",
  multivitamin: "/images/multivitamin.png",
  "triphala capsules": "/images/triphala.png",
  chyawanprash: "/images/chyawanprash.png",
  "herbal hair oil": "/images/herbal-hair-oil.png",
  "herbal hair serum": "/images/herbal-hair-serum.png",
  "herbal face serum": "/images/face-serum.png",
  "glow cream": "/images/glow-cream.png",
  "digestive support": "/images/digestive-support.png",
  "vitamin c": "/images/vitamin-c.png",
  "zinc + selenium": "/images/zinc-selenium.png",
  "joint support": "/images/joint-support.png",
  "sleep support": "/images/sleep-support.png",
  "probiotic gut balance": "/images/probiotic-gut-balance.png",
  // by slug (lowercase)
  "ashwagandha-capsules": "/images/ashwagandha-capsules.png",
  "plant-protein": "/images/plant-protein.png",
  "daily-greens": "/images/daily-greens.png",
  "immunity-booster": "/images/immunity-booster.png",
  triphala: "/images/triphala.png",
  "herbal-hair-oil": "/images/herbal-hair-oil.png",
  "herbal-hair-serum": "/images/herbal-hair-serum.png",
  "face-serum": "/images/face-serum.png",
  "glow-cream": "/images/glow-cream.png",
  "digestive-support": "/images/digestive-support.png",
  "tulsi-giloy": "/images/tulsi-giloy.png",
  "vitamin-c": "/images/vitamin-c.png",
  "zinc-selenium": "/images/zinc-selenium.png",
  "joint-support": "/images/joint-support.png",
  "sleep-support": "/images/sleep-support.png",
  "probiotic-gut-balance": "/images/probiotic-gut-balance.png",
};

/** Resolves the frontend fallback image for a product name/slug, else placeholder. */
export function fallbackImageFor(name: string, slug?: string): string {
  const key = name.trim().toLowerCase();
  if (FALLBACK_IMAGES[key]) return FALLBACK_IMAGES[key];
  if (slug && FALLBACK_IMAGES[slug.trim().toLowerCase()]) {
    return FALLBACK_IMAGES[slug.trim().toLowerCase()];
  }
  return PLACEHOLDER_IMAGE;
}

export interface ProductDTO {
  productId?: number;
  productName?: string;
  slug?: string;
  category?: string;
  brand?: string;
  description?: string;
  composition?: string;
  dosageForm?: string;
  prescriptionRequired?: boolean;
  manufacturer?: string;
  status?: string;
  isVeg?: boolean;
  variantId?: number;
  variantName?: string;
  packSize?: string;
  strength?: string;
  price?: number;
  mrp?: number;
  discountPercentage?: number;
  image?: string | null;
  averageRating?: number;
  reviewCount?: number;
  stock?: number;
  available?: boolean;
  // Additional additive fields (non-breaking)
  keyIngredients?: string;
  benefits?: string;
  directions?: string;
  warnings?: string;
  storage?: string;
  gst?: number;
  licence?: string;
  manufacturerAddress?: string;
}

/**
 * Resolves a backend product image path to a working URL.
 *
 * The backend returns image *paths* such as `/images/xxx.png` in the product
 * JSON, but (in the current deployment) does not actually serve those static
 * files over HTTP — requests to `${API_BASE}/images/xxx.png` return 403.
 * Since the frontend ships the equivalent images in `public/images/`, we map
 * backend `/images/xxx.png` paths to the same-application local path so the
 * existing UI visuals are preserved and no remote host needs configuring.
 *
 * Resolution order:
 * - `/images/xxx.png` → `/images/xxx.png` (served by the frontend from public/)
 * - Absolute http(s) URL → returned as-is
 * - Other relative path → `${API_BASE}{path}`
 * - Missing/null/empty → existing placeholder
 */
export function resolveProductImage(image?: string | null): string {
  if (image && typeof image === "string" && image.trim()) {
    const trimmed = image.trim();
    if (trimmed.startsWith("/images/")) {
      // Keep the path relative so Next.js serves it from the frontend's
      // public/images/ directory (these files exist locally and avoid the
      // backend's 403 on static image requests).
      return trimmed;
    }
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `${API_BASE}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
  }
  return PLACEHOLDER_IMAGE;
}

/**
 * Maps a backend product DTO to the app's internal Product shape.
 * productId is used as the React key (id). All API fields are mapped directly
 * and made available on the returned object; UI-only fields get safe defaults.
 */
export function normalizeProduct(dto: ProductDTO): Product {
  const category = String(dto.category ?? "General");
  // Image resolution:
  // - If the backend provides an image path, resolve it (relative /images/xxx.png
  //   → backend absolute URL; full URL → used as-is).
  // - If the backend image is missing/null/empty, keep the existing frontend
  //   fallback image (keyed by product name/slug) so the UI visuals stay intact.
  const hasBackendImage =
    dto.image && typeof dto.image === "string" && dto.image.trim().length > 0;
  const image = hasBackendImage
    ? resolveProductImage(dto.image)
    : fallbackImageFor(String(dto.productName ?? ""), dto.slug);

  return {
    // productId is the React key (fallback to slug/productName for safety)
    id: String(dto.productId ?? dto.slug ?? dto.productName ?? "product"),
    name: String(dto.productName ?? "Untitled product"),
    range: category,
    // dosageForm drives the format chip when present, else pack/variant label
    format: String(dto.dosageForm ?? dto.variantName ?? dto.packSize ?? "General"),
    image,
    descriptor: String(dto.description ?? ""),
    goals: typeof dto.benefits === "string" ? dto.benefits.split(",").map((s) => s.trim()).filter(Boolean) : [],
    status: dto.status || "New",
    mrp: typeof dto.mrp === "number" ? dto.mrp : dto.price ?? 0,
    price: typeof dto.price === "number" ? dto.price : 0,
    isVeg: dto.isVeg ?? true,
    inStock: (dto.available ?? true) && (dto.stock ?? 0) > 0,
    // Directly mapped API fields (additive, non-breaking)
    slug: dto.slug ? String(dto.slug) : undefined,
    category,
    brand: dto.brand ? String(dto.brand) : undefined,
    rating: typeof dto.averageRating === "number" ? dto.averageRating : undefined,
    discountPercentage:
      typeof dto.discountPercentage === "number"
        ? dto.discountPercentage
        : undefined,
    stock: typeof dto.stock === "number" ? dto.stock : undefined,
    available: dto.available,
    packSize: dto.packSize ? String(dto.packSize) : undefined,
    composition: dto.composition ? String(dto.composition) : undefined,
    dosageForm: dto.dosageForm ? String(dto.dosageForm) : undefined,
    manufacturer: dto.manufacturer ? String(dto.manufacturer) : undefined,
    keyIngredients: dto.keyIngredients ? String(dto.keyIngredients) : undefined,
    directions: dto.directions ? String(dto.directions) : undefined,
    warnings: dto.warnings ? String(dto.warnings) : undefined,
    storage: dto.storage ? String(dto.storage) : undefined,
    gst: typeof dto.gst === "number" ? dto.gst : undefined,
    licence: dto.licence ? String(dto.licence) : undefined,
  };
}

/**
 * Fetches the store product catalogue from the backend.
 * Optionally filters by product category via `?category={categoryName}`.
 * Normalises both a bare array and a wrapped `{ products: [...] }` response.
 * Throws a descriptive error when the request fails.
 */
export async function fetchProducts(categoryName?: string): Promise<Product[]> {
  const query = categoryName && categoryName.trim()
    ? `?category=${encodeURIComponent(categoryName.trim())}`
    : "";
  const res = await fetch(`${API_BASE}/api/store/products${query}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to load products: ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));

  const list: unknown = Array.isArray(data) ? data : data?.products;

  if (!Array.isArray(list)) {
    throw new Error("Unexpected product response shape");
  }

  return list.map((item, index) => {
    if (item && typeof item === "object") {
      return normalizeProduct(item as ProductDTO);
    }
    // Edge case: non-object entry — return a safe minimal product
    return normalizeProduct({
      productId: index,
      productName: `Product ${index + 1}`,
    });
  });
}

/**
 * Fetches a single product by its slug from the backend.
 * GET /api/store/products/{slug}
 * Resolves both a bare object and a wrapped `{ product: {...} }` response.
 * Returns null when the product is not found (404).
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${API_BASE}/api/store/products/${encodeURIComponent(slug)}`,
    { method: "GET", headers: { Accept: "application/json" } },
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to load product: ${res.status}`);
  }

  const data = await res.json().catch(() => ({}));

  const dto: unknown = data && typeof data === "object" && "product" in data
    ? (data as { product: unknown }).product
    : data;

  if (!dto || typeof dto !== "object") {
    return null;
  }

  return normalizeProduct(dto as ProductDTO);
}

