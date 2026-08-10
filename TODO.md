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

## API reliability fixes — Product module (`src/lib/productApi.ts`)
- [x] Images now always come from the frontend (`public/images/`): `normalizeProduct` keeps `/images/xxx.png` relative paths so Next.js serves them locally; falls back to name/slug-keyed frontend images when the backend image is null/empty. No backend static requests.
- [x] `fetchProducts` now uses `/api/store/products` as the primary source (as requested). When that endpoint 403s/500s (currently returns 500 on this backend), it falls back to the confirmed-working `/api/products`.
- [x] Category range tabs (`?category=Ayurveda` etc.) now work correctly: the backend's `/api/products` ignores the `category` query and returns every product, so `fetchProducts` now enforces the category filter client-side using the backend's `categoryName` field.
- [x] Added `categoryName` to `ProductDTO` and updated `normalizeProduct` to map `categoryName` → product `range`/`category` (the backend sends `categoryName`, not `category`).
- [x] `fetchProductBySlug` is now resilient: if `/api/store/products/{slug}` returns 500, it falls back to looking the product up from the full catalogue via `fetchProducts()`. Verified `/products/ashwagandha-capsules` → HTTP 200.

## Verification
- [x] All key pages return HTTP 200 while dev server is running: `/`, `/shop`, `/shop/ayurveda`, `/shop/nutraceuticals`, `/products/ashwagandha-capsules`.
- [x] `npx tsc --noEmit` → exit 0 (no type errors).
- [x] Backend probe: `/api/store/products` → 500 (broken upstream); `/api/products?category=Ayurveda` → 200 returning all 18 products with `categoryName`; `/api/product-variants` → 200 providing prices/MRP/stock.

## Auth API verification (register / login)
- [x] Confirmed backend auth works and is correctly proxied via Next.js `/api/auth/*`.
- [x] **Register**: `POST /api/auth/register` → 200 `{ token, message, user{...} }`. Business errors are returned cleanly (409 `"Mobile number already exists"`).
- [x] **Login**: `POST /api/auth/login` → 200 `{ token, message, user{...} }` with a registered user's credentials (verified direct to 8080 and through the proxy at 3000).
- [x] Root cause of "Request failed: 403"/"Bad credentials": the old `test-auth.json` credentials were dummy placeholders that don't exist in the backend DB. Updated `test-auth.json` to a working registered account and clarified the flow.

## Full API health check (live server on port 3000)
- [x] `GET /api/products` via proxy → 200 (products render; images come from frontend `public/images/`).
- [x] `POST /api/auth/login` via proxy → 200 with valid registered credentials.
- [x] `GET /api/faqs` via proxy → 200.
- [x] `GET /shop` → 200; product detail pages resolve.
- [~] `GET /api/admin/analytics/summary` → 403 without a token (expected — admin requires a JWT bearer header; the front-end `adminApi.ts` attaches it).
- [~] `GET /api/cart/{userId}` → 500 "Cart not found" for a fresh user who has no cart row yet (expected backend behavior; the front-end `AppContext` handles the empty-cart fallback). `POST /api/cart/add` requires the bearer token + an existing user.

## Cart integration fix (`src/components/AppContext.tsx`)
- [x] Diagnosed "Cart not found": backend `GET /api/cart/{userId}` returns `500 "Cart not found"` only when a logged-in user has **no cart row yet** (hasn't added any item). Verified `POST /api/cart/add` → 201 (creates cart + adds item) and `GET /api/cart/{userId}` → 200 with items once the cart exists.
- [x] Fixed the on-mount cart load to treat "Cart not found" as an **empty cart** (clear the bag) rather than surfacing it as an error — the cart is created on the first add-to-cart.
- [x] `addToBag` now **re-fetches the cart** via `GET /api/cart/{userId}` after a successful `POST /api/cart/add`, so the bag always reflects the backend's authoritative item list.
- [x] Verified end-to-end via the proxy on port 3000: login → get cart → add → get cart returns 200 with the item.

## Goals filter fix (`src/lib/productApi.ts`)
- [x] Diagnosed: selecting a wellness goal in the shop returned **no products**. Root cause: the backend catalogue sends all product data **except a `benefits` field**, so `normalizeProduct` was leaving `goals: []` on every product. The shop's `p.goals.includes(goal)` filter thus matched nothing.
- [x] Added a frontend fallback: `fallbackGoalsFor(name, slug)` looks up the product's goals from the frontend's own catalogue (`@/data` products array, matched by slug then name) so every backend product is assigned its original wellness goals.
- [x] `normalizeProduct` now resolves goals from the backend's `benefits` when present, otherwise from the frontend fallback. Backend `benefits` still takes precedence (non-breaking).
- [x] Verified `npx tsc --noEmit` → exit 0 (no type errors). No API routes or other logic were changed.

## Deferred (server-side static SEO — intentionally not changed)
- [ ] `products/[slug]/layout.tsx` metadata uses static `@/data` (server component; no backend access at build time).
- [ ] `sitemap.ts` uses static `@/data`.
