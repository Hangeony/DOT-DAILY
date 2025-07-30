import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */

  // 성능 최적화 설정 - 단순화
  experimental: {
    optimizeCss: true, // CSS 최적화만 유지
  },

  // Webpack 최적화 설정 - 단순화
  webpack: (config, { dev, isServer }) => {
    // 프로덕션 빌드에서만 최적화 적용
    if (!dev && !isServer) {
      // Tree shaking 강화
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // 번들 분할 최적화 (성능 향상)
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 244000, // 최대 번들 크기 제한
        cacheGroups: {
          // 드래그 앤 드롭 라이브러리 (큰 번들)
          dnd: {
            test: /[\\/]node_modules[\\/]@hello-pangea[\\/]/,
            name: "dnd",
            chunks: "all",
            priority: 50,
            enforce: true,
          },
          // 애니메이션 라이브러리
          animation: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: "animation",
            chunks: "all",
            priority: 45,
            enforce: true,
          },
          // React 관련 라이브러리
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            chunks: "all",
            priority: 40,
            enforce: true,
          },
          // 상태 관리 라이브러리
          state: {
            test: /[\\/]node_modules[\\/](zustand|@tanstack)[\\/]/,
            name: "state",
            chunks: "all",
            priority: 30,
            enforce: true,
          },
          // 기타 라이브러리
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
            priority: 10,
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // 이미지 최적화
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
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
