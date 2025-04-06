import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { fontVariables } from "@/assets/fonts";

export const metadata: Metadata = {
  title: "Daniel's Personal Site",
  description: "Personal website and blog by Daniel",
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head>
      <body
        className={`${fontVariables} antialiased min-h-screen flex flex-col font-manrope overflow-x-hidden`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="py-4">
            {/* <div className="container mx-auto px-4 text-center text-gray-600">
              © {new Date().getFullYear()} Daniel • All rights reserved
            </div> */}
          </footer>
          <ScrollToTop tooltipText="Back to top" />
        </ThemeProvider>
      </body>
    </html>
  );
}
