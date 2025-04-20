import type { Metadata, Viewport } from "next";
import "./globals.css";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { fontVariables } from "@/assets/fonts";
import { PHProvider } from "@/app/ph-provider";
import SuspendedPostHogPageView from "@/app/ph-page-view";
import { IS_PRODUCTION } from "@/config/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title.default,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title.default,
    description: siteConfig.description,
    creator: siteConfig.author.twitter,
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: siteConfig.themeColor.light,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: siteConfig.themeColor.dark,
    },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {!IS_PRODUCTION && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        )}
      </head>
      <body
        className={`${fontVariables} antialiased min-h-dvh h-full flex flex-col font-inter overflow-x-hidden`}
      >
        <TooltipProvider delayDuration={250}>
          <PHProvider>
            <ThemeProvider>
              <Header />
              <main className="flex-grow h-full">{children}</main>
              <footer className="py-4 fixed">
                {/* <div className="container mx-auto px-4 text-center text-gray-600">
              © {new Date().getFullYear()} Daniel • All rights reserved
            </div> */}
              </footer>
              <ScrollToTop tooltipText="Back to top" />
            </ThemeProvider>
            <SuspendedPostHogPageView />
          </PHProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
