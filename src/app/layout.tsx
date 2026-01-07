import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { pretendard } from "./pretendard";

export const metadata: Metadata = {
  title: {
    default: "KANBAN",
    template: "%s | KANBAN",
  },
  description: "KANBAN",
  openGraph: {
    siteName: "KANBAN",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: 테마 변경으로 인한 속성 불일치 경고를 무시
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.className} antialiased min-h-dvh flex flex-col`}
      >
        <Providers>
          <main className="flex-1 pb-[env(safe-area-inset-bottom)]">
            <div className="container mx-auto pt-10 px-4 pb-32">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
