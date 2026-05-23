import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TawkChat } from "@/components/ui/TawkChat";

const SITE_URL = 'https://quantumvest-rosy.vercel.app'
const OG_IMAGE = `${SITE_URL}/images/team-handshake.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BIT-TESLA - TESLA QUANTUM MARKET",
  description:
    "Putting Our Clients First For Over A Decade. For over a decade, we've been empowering clients by helping them take control of their financial lives. Bit-tesla is a successful online trading and investment platform for brokers interested in Foreign Exchange, Stock Market Trading, and Cryptocurrency Trading. We give our users the potential to generate financial returns on both rising and falling prices across indices, FX, commodities, shares and cryptocurrencies.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "BIT-TESLA - TESLA QUANTUM MARKET",
    description:
      "Putting Our Clients First For Over A Decade. Bit-tesla is a successful online trading and investment platform for Foreign Exchange, Stock Market Trading, and Cryptocurrency Trading.",
    siteName: "BIT-TESLA",
    images: [
      {
        url: OG_IMAGE,
        width: 1600,
        height: 900,
        alt: "BIT-TESLA - Tesla Quantum Market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIT-TESLA - TESLA QUANTUM MARKET",
    description:
      "Putting Our Clients First For Over A Decade. A trusted online trading and investment platform for Foreign Exchange, Stock Market Trading, and Cryptocurrency.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <TawkChat />
      </body>
    </html>
  );
}
