# Product Module → Backend Integration — Task Checklist

## Done
- [x] Inspected existing Product Module (data.ts, ShopCatalogue, Overlays, ProductShowcase, Routines, product detail page, admin/sitemap/layout).
- [x] Created centralized API service `src/lib/productApi.ts` (API_BASE, fetchProducts, fetchProductBySlug, normalizeProduct, image resolution `/images/xxx.png` → `${API_BASE}/images/xxx.png`, null → placeholder).
- [x] Created shared cached hook `src/lib/useProducts.ts`.
- [x] Wired `ShopCatalogue.tsx` to `fetchProducts` with loading/error/empty states; kept search/filter/sort; used `product.slug ?? product.id` for product detail links.
- [x] Wired `Overlays.tsx` (search/saved) to `useProducts()`.
- [x] Wired `ProductShowcase.tsx` and `Routines.tsx` to `useProducts()`.
- [x] Wired `products/[slug]/page.tsx` to `useProducts` (data + related products).
- [x] `src/app/products/[slug]/page.tsx`: product lookup matches by slug (then id).
- [x] `src/app/products/[slug]/page.tsx`: related-product links → `/products/${p.slug ?? p.id}`.
- [x] `src/app/products/[slug]/page.tsx`: JSON-LD `url` → slug.
- [x] TypeScript check passed (`npx tsc --noEmit` → EXITCODE=0).
- [x] Project running: frontend `http://localhost:3000/shop` → HTTP 200; backend `http://localhost:8080/api/store/products` → HTTP 200 with live product JSON.
- [x] Fixed `next/image` unconfigured-host error: backend `/images/xxx.png` paths now resolve to the frontend's own `public/images/` files (the backend returns image paths but 403s on serving them; the equivalent `.png` files already exist locally). Verified `http://localhost:3000/images/...` → HTTP 200 `image/png`. Also added `http` remote patterns for `localhost`/`127.0.0.1` in `next.config.mjs` for future backend-served images.

## Deferred (server-side static SEO — intentionally not changed)
- [ ] `products/[slug]/layout.tsx` metadata uses static `@/data` (server component; no backend access at build time).
- [ ] `sitemap.ts` uses static `@/data`.
