// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const pretendard = localFont({
  src: "../fonts/Pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Apple SD Gothic Neo",
    "Pretendard Variable",
    "Pretendard",
    "system-ui",
    "sans-serif",
  ],
});

const kkonghae = localFont({
  src: "../fonts/kkonghae.woff2",
  variable: "--font-kkonghae",
  display: "swap",
  preload: true,
  fallback: ["Cafe24Ssurround", "KCC-Ganpan", "cursive", "fantasy"],
});

export const metadata: Metadata = {
  title: "DOT.DAILY",
  description: "투두 + 회고 기록 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // 접근성을 위해 확대 허용
  userScalable: true, // 사용자 확대/축소 허용
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Critical CSS - 최소한만 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body { margin: 0; padding: 0; font-family: var(--font-pretendard), -apple-system, BlinkMacSystemFont, sans-serif; }
              .w-full { width: 100%; }
              .max-w-md { max-width: 28rem; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .min-h-screen { min-height: 100vh; }
              .bg-surface-base { background-color: #f8fafc; }
              .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
              .overflow-hidden { overflow: hidden; }
              .relative { position: relative; }
            `,
          }}
        />

        {/* 폰트 preload */}
        <link
          rel="preload"
          href="/fonts/Pretendard/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/kkonghae.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* SVG preload 제거 - 인라인 SVG 사용으로 불필요 */}
        <link
          rel="preload"
          href="/dropdown.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />

        {/* Resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className={`${pretendard.variable} ${kkonghae.variable} font-sans`}>
        <Providers>
          <div className="w-full max-w-md mx-auto min-h-screen bg-surface-base shadow-lg overflow-hidden relative">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
