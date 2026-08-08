/** @type {import('next').NextConfig} */
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
};
export default nextConfig;
