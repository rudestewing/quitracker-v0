/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable static generation in development for better cache control
  ...(process.env.NODE_ENV === "development" && {
    experimental: {
      isrFlushToDisk: false,
    },
    generateEtags: false,
    poweredByHeader: false,
  }),
  async headers() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value:
                "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
            },
            {
              key: "Pragma",
              value: "no-cache",
            },
            {
              key: "Expires",
              value: "0",
            },
            {
              key: "Surrogate-Control",
              value: "no-store",
            },
          ],
        },
        {
          source: "/sw.js",
          headers: [
            {
              key: "Cache-Control",
              value:
                "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
            },
            {
              key: "Service-Worker-Allowed",
              value: "/",
            },
          ],
        },
        {
          source: "/_next/static/(.*)",
          headers: [
            {
              key: "Cache-Control",
              value:
                "no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0",
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
