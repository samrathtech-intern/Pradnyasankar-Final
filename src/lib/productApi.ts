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
import { products as KNOWN_PRODUCTS } from "@/data";

// The browser calls the same-origin Next.js rewrite path (`/api/store/...`),
// which forwards the request server-to-server to the backend at
// NEXT_PUBLIC_API_BASE_URL (default http://localhost:8080). This avoids CORS
// blocking, since the backend does not send Access-Control-Allow-Origin headers.
// (This mirrors the existing B2B proxy route pattern.)
export const API_BASE = "";

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

/**
 * Fallback wellness "goals" keyed by lower-cased product slug and name.
 *
 * The backend catalogue does not currently send a `benefits` field, so
 * `normalizeProduct` would leave `goals: []`. The shop catalogue filters by
 * goal (e.g. "Immunity Support"), which would then return no products. To keep
 * the goals filter working, we map each product to the goals that were defined
 * in the frontend's original product data (matched by slug/name). If the
 * backend does send `benefits` in future, those take precedence (see
 * `normalizeProduct`).
 */
const GOALS_BY_SLUG: Record<string, string[]> =
  Object.fromEntries(
    KNOWN_PRODUCTS.map((p) => [p.id.toLowerCase(), p.goals]),
  );

/** Looks up the frontend goals for a backend product by slug/name. */
export function fallbackGoalsFor(
  name: string,
  slug?: string,
): string[] {
  if (slug) {
    const bySlug = GOALS_BY_SLUG[slug.trim().toLowerCase()];
    if (bySlug && bySlug.length) return bySlug;
  }
  const byName = KNOWN_PRODUCTS.find(
    (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase(),
  );
  if (byName) return byName.goals;
  return [];
}

export interface ProductDTO {
  productId?: number;
  productName?: string;
  slug?: string;
  sku?: string;
  category?: string;
  categoryName?: string;
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
  // The backend sends the category in `categoryName` (e.g. "Ayurveda"), not
  // `category`. Map either field so the range tabs / filtering work correctly.
  const rawCategory = String(dto.category ?? dto.categoryName ?? "General").trim();
  const category = rawCategory.length > 0 ? rawCategory : "General";
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
    // Use backend `benefits` when provided; otherwise fall back to the goals
    // defined for this product in the frontend data (the backend catalogue does
    // not currently send `benefits`, so this keeps the goals filter working).
    goals:
      typeof dto.benefits === "string"
        ? dto.benefits.split(",").map((s) => s.trim()).filter(Boolean)
        : fallbackGoalsFor(String(dto.productName ?? ""), dto.slug),
    status: dto.status || "New",
    mrp: typeof dto.mrp === "number" ? dto.mrp : dto.price ?? 0,
    price: typeof dto.price === "number" ? dto.price : 0,
    isVeg: dto.isVeg ?? true,
    inStock: (dto.available ?? true) && (dto.stock ?? 0) > 0,
// Directly mapped API fields (additive, non-breaking)
    slug: dto.slug ? String(dto.slug) : undefined,
    variantId: typeof dto.variantId === "number" ? dto.variantId : undefined,
    sku: dto.sku ? String(dto.sku) : undefined,
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
  const trimmed = categoryName?.trim();
  const query = trimmed
    ? `?category=${encodeURIComponent(trimmed)}`
    : "";

  /**
   * Primary source: `/api/store/products` (requested). This endpoint is proxied
   * by Next.js to the backend. If it returns a non-2xx (e.g. 500) we fall back
   * to `/api/products`, which is confirmed to return the full catalogue. When a
   * category is requested and the backend did not actually filter server-side,
   * we enforce the filter client-side so category tabs always show only the
   * products belonging to that range.
   */
  let list: unknown[] | null = null;

  try {
    const res = await fetch(`${API_BASE}/api/store/products${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as unknown;
      const batch = Array.isArray(data) ? data : (data as { products?: unknown })?.products;
      if (Array.isArray(batch)) list = batch;
    }
  } catch {
    list = null; // network / parse error → fall back
  }

  if (list === null) {
    const fallbackRes = await fetch(`${API_BASE}/api/products${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!fallbackRes.ok) {
      throw new Error(`Failed to load products: ${fallbackRes.status}`);
    }
    const data = (await fallbackRes.json().catch(() => ({}))) as unknown;
    const batch = Array.isArray(data) ? data : (data as { products?: unknown })?.products;
    if (!Array.isArray(batch)) {
      throw new Error("Unexpected product response shape");
    }
    list = batch;
  }

  // Enforce the requested category client-side (safety net in case the backend
  // ignores the `category` query param and returns every product).
  if (trimmed) {
    const needle = trimmed.toLowerCase();
    list = list.filter((item) => {
      if (!item || typeof item !== "object") return false;
      const dto = item as ProductDTO;
      const cat = String(dto.category ?? dto.categoryName ?? "").toLowerCase();
      return cat === needle;
    });
  }

  // The backend stores pricing / sku / variant / stock data in a separate
  // `/api/product-variants` endpoint. Fetch it and merge the matching variant
  // (by productId) into each catalogue product so the UI shows real prices,
  // MRPs, stock status and variant info. If the variants endpoint fails, we
  // degrade gracefully and return the base products (₹0 / out-of-stock).
  let variants: Record<number, Record<string, unknown>> = {};
  try {
    const vres = await fetch(`${API_BASE}/api/product-variants`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (vres.ok) {
const vdata = await vres.json().catch(() => []);
      const vlist: unknown[] = Array.isArray(vdata) ? (vdata as unknown[]) : [];
      for (const v of vlist) {
        if (v && typeof v === "object" && typeof (v as { productId?: unknown }).productId === "number") {
          variants[(v as { productId: number }).productId] = v as Record<string, unknown>;
        }
      }
    }
  } catch {
    // Ignore — variants are optional enrichment.
  }

  return list.map((item, index) => {
    if (item && typeof item === "object") {
      const dto = item as ProductDTO;
      const variant = variants[typeof dto.productId === "number" ? dto.productId : -1];
      if (variant) {
        return normalizeProduct({
          ...dto,
          // Merge variant pricing / sku / variant fields into the product DTO.
          sku: (variant.sku as string) ?? dto.sku,
          variantId: typeof variant.variantId === "number" ? variant.variantId : dto.variantId,
          variantName: (variant.variantName as string) ?? dto.variantName,
          packSize: (variant.packSize as string) ?? dto.packSize,
          mrp: typeof variant.mrp === "number" ? variant.mrp : dto.mrp,
          price: typeof variant.sellingPrice === "number" ? variant.sellingPrice : dto.price,
          gst: typeof variant.gstPercentage === "number" ? variant.gstPercentage : dto.gst,
          available: Boolean(variant.isActive ?? dto.available),
          stock: typeof variant.isActive === "boolean" ? (variant.isActive ? 1 : 0) : dto.stock,
        });
      }
      return normalizeProduct(dto);
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
  try {
    const res = await fetch(
      `${API_BASE}/api/store/products/${encodeURIComponent(slug)}`,
      { method: "GET", headers: { Accept: "application/json" } },
    );

    if (res.status === 404) return null;

    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as unknown;
      const dto: unknown = data && typeof data === "object" && "product" in data
        ? (data as { product: unknown }).product
        : data;

      if (dto && typeof dto === "object") {
        return normalizeProduct(dto as ProductDTO);
      }
    }
  } catch {
    // fall through to catalogue lookup
  }

  // Fallback: the store slug endpoint can return 500 on this backend. Look the
  // product up from the full catalogue instead so product detail pages still
  // resolve by slug/id.
  try {
    const all = await fetchProducts();
    return all.find((p) => p.slug === slug) ?? all.find((p) => p.id === slug) ?? null;
  } catch {
    return null;
  }
}

