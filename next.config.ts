import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      "fra1.digitaloceanspaces.com",
      "destinyimpactchurch.org",
      "via.placeholder.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "images.pexels.com",
    ].map((hostname) => ({
      protocol: "https",
      hostname,
      port: "",
    })),
  },
};

export default nextConfig;
