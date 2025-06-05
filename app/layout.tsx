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
    <html lang="en">
      <head>
        {/* PWA Manifest */}
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
        <meta name="apple-touch-fullscreen" content="yes" />{" "}
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // PWA Service Worker Registration with better error handling
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ SW registered successfully');
                      console.log('📍 Scope: ', registration.scope);
                      
                      registration.addEventListener('updatefound', () => {
                        console.log('🔄 SW update found');
                        const newWorker = registration.installing;
                        if (newWorker) {
                          newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed') {
                              console.log('🆕 New content available');
                              if (navigator.serviceWorker.controller) {
                                // Show update available notification
                                console.log('🔄 Update available - reload to get latest version');
                              }
                            }
                          });
                        }
                      });
                    })
                    .catch(function(registrationError) {
                      console.error('❌ SW registration failed: ', registrationError);
                    });
                });
                
                // Handle service worker messages
                navigator.serviceWorker.addEventListener('message', event => {
                  console.log('📨 SW message:', event.data);
                });
                
                // Handle service worker controller change
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                  console.log('🔄 SW controller changed - reloading page');
                  window.location.reload();
                });
              }

              // PWA Install Detection with debugging
              let deferredPrompt;

              window.addEventListener('beforeinstallprompt', (e) => {
                console.log('🚀 beforeinstallprompt fired');
                e.preventDefault();
                deferredPrompt = e;

                // Dispatch custom event
                window.dispatchEvent(new CustomEvent('pwa-install-available', { detail: e }));
              });

              window.addEventListener('appinstalled', () => {
                console.log('✅ PWA installed successfully');
                deferredPrompt = null;
                window.dispatchEvent(new CustomEvent('pwa-installed'));
              });

              // Check install status
              function checkInstallStatus() {
                const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
                const isInWebAppiOS = window.navigator.standalone === true;
                const isInstalled = isStandalone || isInWebAppiOS;

                if (isInstalled) {
                  window.dispatchEvent(new CustomEvent('pwa-already-installed'));
                }

                return isInstalled;
              }

              // Check immediately
              checkInstallStatus();

              // Network status handling
              window.addEventListener('online', () => {
                console.log('🌐 Back online');
                // Optionally reload to get fresh content
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                  navigator.serviceWorker.controller.postMessage({ type: 'NETWORK_ONLINE' });
                }
              });

              window.addEventListener('offline', () => {
                console.log('📱 Gone offline');
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                  navigator.serviceWorker.controller.postMessage({ type: 'NETWORK_OFFLINE' });
                }
              });

              // Debug manifest
              fetch('/manifest.json')
                .then(response => {
                  if (response.ok) {
                    console.log('✅ Manifest loaded successfully');
                    return response.json();
                  }
                  throw new Error('Manifest load failed');
                })
                .then(manifest => {
                  console.log('📋 Manifest content:', manifest);
                })
                .catch(error => {
                  console.error('❌ Manifest error:', error);
                });
            `,
          }}
        />
      </body>
    </html>
  );
}
