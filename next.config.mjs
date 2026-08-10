
/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

// Backend base URL used by the server-side proxy rewrites below.
// The browser never calls the backend directly — Next.js forwards these
// same-origin /api/* requests to the Spring Boot backend server-to-server,
// which avoids browser CORS blocking (the backend sends no CORS headers).
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const nextConfig = {
  images: {
    remotePatterns: [
      // Allow HTTPS for any host
      { protocol: "https", hostname: "**" },
      // Allow HTTP for the local backend serving product images (e.g. http://localhost:8080)
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
  },
async rewrites() {
    return [
      // Store (product) catalogue endpoints
      { source: "/api/store/:path*", destination: `${BACKEND_URL}/api/store/:path*` },
// Product catalogue + single product endpoints
      { source: "/api/products/:path*", destination: `${BACKEND_URL}/api/products/:path*` },
      // Product variants (pricing / sku / stock)
      { source: "/api/product-variants", destination: `${BACKEND_URL}/api/product-variants` },
      { source: "/api/product-variants/:path*", destination: `${BACKEND_URL}/api/product-variants/:path*` },
      // Auth endpoints (register / login / logout)
      { source: "/api/auth/:path*", destination: `${BACKEND_URL}/api/auth/:path*` },
      // Cart endpoints (add / get / update / remove / clear / checkout)
      // Cart - get current user's cart
{
  source: "/api/cart",
  destination: `${BACKEND_URL}/api/cart`
},

// Cart - add / update / remove / clear / checkout
{
  source: "/api/cart/:path*",
  destination: `${BACKEND_URL}/api/cart/:path*`
},
      // Admin endpoints (login / orders / analytics)
      { source: "/api/admin/:path*", destination: `${BACKEND_URL}/api/admin/:path*` },
      // FAQ endpoint
      { source: "/api/faqs", destination: `${BACKEND_URL}/api/faqs` },
      // Orders (invoice download)
      { source: "/api/orders/:path*", destination: `${BACKEND_URL}/api/orders/:path*` },
    ];
  },
};
export default nextConfig;
