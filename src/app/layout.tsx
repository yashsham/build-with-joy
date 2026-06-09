import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Hermosa Luxe Home Service — At-Home Salon & Spa",
  description: "India's luxe at-home salon & spa. Female salon, spa, waxing, facial, bridal, makeup, mehendi & more — booked to your doorstep.",
  keywords: "salon at home, spa at home, bridal makeup, mehendi artist, home services, Bareilly salon, luxury beauty services",
};

import { AppProvider } from "@/lib/context";
import LoginModal from "@/components/LoginModal";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="antialiased">
        <AppProvider>
          {children}
          <LoginModal />
          <MobileBottomNav />
          <Toaster theme="dark" position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
