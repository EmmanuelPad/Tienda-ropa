import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Asegura que los scripts se manejen correctamente
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
