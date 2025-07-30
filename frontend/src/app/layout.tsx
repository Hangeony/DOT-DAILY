import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";

const pretendard = localFont({
  src: "../../public/fonts/Pretendard/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: false,
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
  src: "../../public/fonts/kkonghae.woff2",
  variable: "--font-kkonghae",
  display: "swap",
  preload: false,
  fallback: ["Cafe24Ssurround", "KCC-Ganpan", "cursive", "fantasy"],
});

export const metadata: Metadata = {
  title: "DOT.DAILY",
  description: "투두 + 회고 기록 앱",
  metadataBase: new URL("https://dot-daily.vercel.app"),
  openGraph: {
    title: "DOT.DAILY",
    description: "투두 + 회고 기록 앱",
    type: "website",
    images: [
      {
        url: "/logo-vertical.svg",
        width: 200,
        height: 200,
        alt: "DOT.DAILY 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DOT.DAILY",
    description: "투두 + 회고 기록 앱",
    images: ["/logo-vertical.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // 접근성을 위해 확대 허용
  userScalable: true, // 사용자 확대/축소 허용
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            `,
          }}
        />

        {/* DNS prefetch for Google OAuth */}
        <link rel="dns-prefetch" href="https://accounts.google.com" />
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
