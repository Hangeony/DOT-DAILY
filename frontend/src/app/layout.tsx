// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const pretendard = localFont({
  src: "../fonts/Pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "optional",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const kkonghae = localFont({
  src: "../fonts/kkonghae.woff2",
  variable: "--font-kkonghae",
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  title: "DOT.DAILY",
  description: "투두 + 회고 기록 앱",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
