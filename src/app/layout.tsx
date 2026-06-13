import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "@/styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-accent",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#c9a84c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Hermosa Luxe Home Service — At-Home Salon & Spa in Bareilly",
  description:
    "India's premium door-step beauty salon in Bareilly. Book waxing, facial, spa, bridal makeup, mehendi & more. Certified professionals at your home.",
  keywords:
    "salon at home, spa at home, bridal makeup, mehendi artist, home services, Bareilly salon, luxury beauty services, waxing at home, facial at home",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hermosa",
    startupImage: [
      {
        url: "/icons/splash.png",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  openGraph: {
    type: "website",
    title: "Hermosa Luxe Home Service",
    description:
      "Premium at-home salon & spa in Bareilly. Book waxing, facial, bridal & more.",
    siteName: "Hermosa Luxe Home Service",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Hermosa Luxe Home Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hermosa Luxe Home Service",
    description: "Premium at-home salon & spa in Bareilly.",
    images: ["/icons/icon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/favicon-32x32.png",
  },
};

import { AppProvider } from "@/lib/context";
import LoginModal from "@/components/LoginModal";
import ChooseServiceModal from "@/components/ChooseServiceModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import FirebaseProvider from "@/components/FirebaseProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <head>
        {/* Theme detection script to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('hermosa_theme') === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Hermosa" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hermosa" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Splash screens */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-startup-image" href="/icons/splash.png" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <AppProvider>
          {children}
          <LoginModal />
          <ChooseServiceModal />
          <MobileBottomNav />
          <FirebaseProvider />
          <PWAInstallPrompt />
          <Toaster theme="dark" position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
