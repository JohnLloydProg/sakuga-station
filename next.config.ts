import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://jxxd7vli0wushjuq.public.blob.vercel-storage.com/**")]
  }
};

export default nextConfig;
