import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  // 성능 최적화 설정
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  // 이미지 최적화
  images: {
    formats: ["image/webp", "image/avif"],
  },
  // 압축 활성화
  compress: true,
  // Chrome DevTools 요청 처리
  async redirects() {
    return [
      {
        source: '/.well-known/appspecific/com.chrome.devtools.json',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
