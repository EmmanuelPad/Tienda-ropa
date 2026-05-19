import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  // Asegura que los scripts se manejen correctamente
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
