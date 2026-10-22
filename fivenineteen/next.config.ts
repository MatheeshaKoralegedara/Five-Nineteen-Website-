import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.fivenineteen.com.lk" },
    { protocol: "https", hostname: "*.r2.dev" },
  ],
},
};

export default nextConfig;
