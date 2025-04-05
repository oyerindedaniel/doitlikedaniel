import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-mono`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <footer className="py-4">
            {/* <div className="container mx-auto px-4 text-center text-gray-600">
              © {new Date().getFullYear()} Daniel • All rights reserved
            </div> */}
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
