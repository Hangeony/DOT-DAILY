import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */

  // 성능 최적화 설정
  // 실험적 기능 제거 (안정성 우선)
  experimental: {},

  // Turbopack 설정 (안정 버전으로 이동)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Webpack 설정 제거 (기본값 사용)
  // 이미지 최적화 강화
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일 캐시
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 압축 활성화
  compress: true,
  // 정적 최적화 (배포 시에만 사용)
  // output: "standalone",
  // PWA 설정 (선택사항)
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      // Back/Forward Cache 최적화
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  // Chrome DevTools 요청 처리
  async redirects() {
    return [
      {
        source: "/.well-known/appspecific/com.chrome.devtools.json",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
