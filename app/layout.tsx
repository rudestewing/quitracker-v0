import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuitTracker - Habit Quit Tracker",
  description: "Track your journey to freedom from bad habits",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QuitTracker",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "QuitTracker",
    title: "QuitTracker - Habit Quit Tracker",
    description: "Track your journey to freedom from bad habits",
  },
  twitter: {
    card: "summary",
    title: "QuitTracker - Habit Quit Tracker",
    description: "Track your journey to freedom from bad habits",
  },
  generator: "v0.dev",
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Favicons */}
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
        <link
          rel="icon"
          href="/icon-192.png"
          type="image/svg+xml"
          sizes="192x192"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="QuitTracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#16a34a" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="application-name" content="QuitTracker" />
        {/* Additional Meta Tags for better PWA support */}
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <script src="/pwa-manager.js" />
        {/* Development cache clear utility - only loads in development */}
        {process.env.NODE_ENV === "development" && (
          <script src="/dev-cache-clear.js" />
        )}
      </body>
    </html>
  );
}
