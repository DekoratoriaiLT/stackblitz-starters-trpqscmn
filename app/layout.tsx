// @ts-expect-error Next.js processes global CSS imports without TypeScript declarations.
import "./globals.css";
import type { Viewport, Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"

import Navbar from "./components/Navbar/Navbar";
import Background from "./components/Background/Background";
import Footer from "./components/Footer/Footer";

import { MantineProvider } from "@mantine/core";
// @ts-expect-error Mantine ships CSS for bundler processing without TypeScript declarations.
import "@mantine/core/styles.css";
// @ts-expect-error Mantine ships CSS for bundler processing without TypeScript declarations.
import "@mantine/carousel/styles.css";

import { AuthProvider } from "./contexts/AuthContext";
import { BusinessAuthProvider } from "./contexts/BusinessAuthContext";
import { CartProvider } from "./contexts/CartContext";

import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "Interjero ir Fasado Dekoratoriai – Interjero dekoratoriai",
  description:
    "Interjero ir Fasado Dekoratoriai – profesionalūs interjero dekoratoriai, siūlome aukštos kokybės gipso sprendimus jūsų namams ir verslui.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt" suppressHydrationWarning>
      <head>
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Interjero ir Fasado Dekoratoriai",
              url: "https://www.dekoratoriai.lt",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.dekoratoriai.lt/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Navigation Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: [
                "Lubų apvadai",
                "Sienų apvadai",
                "Grindų apvadai",
                "Langų juostos",
                "Sienų panelės",
              ],
              url: [
                "https://www.dekoratoriai.lt/produktai/lubu-apvadai",
                "https://www.dekoratoriai.lt/produktai/sienu-apvadai",
                "https://www.dekoratoriai.lt/produktai/grindu-apvadai",
                "https://www.dekoratoriai.lt/produktai/lauko-palanges",
                "https://www.dekoratoriai.lt/produktai/sienu-paneles",
              ],
            }),
          }}
        />
      </head>

      <body
        className={`${inter.variable} font-inter antialiased relative min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <BusinessAuthProvider>
            <CartProvider>
              <MantineProvider>
                <Background />
                <Navbar />

                <main
                  role="main"
                  id="main-content"
                  className="relative z-10 flex-grow text-slate-900"
                >
                  {children}
                </main>

                <Footer />
              </MantineProvider>
            </CartProvider>
          </BusinessAuthProvider>
        </AuthProvider>

        {/* Vercel Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}