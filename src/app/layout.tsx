import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { TawkChat } from "@/components/ui/TawkChat";

const SITE_URL = 'https://quantumvest-rosy.vercel.app'
const OG_IMAGE = `${SITE_URL}/images/team-handshake.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "BIT-TESLA — Tesla Quantum Market | Trade Forex, Stocks & Crypto",
  description:
    "Putting Our Clients First For Over A Decade. BIT-TESLA is a trusted trading platform for Forex, Stock Market & Crypto — generate returns on rising and falling markets worldwide.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "BIT-TESLA — Tesla Quantum Market | Trade Forex, Stocks & Crypto",
    description:
      "Putting Our Clients First For Over A Decade. BIT-TESLA is a trusted trading platform for Forex, Stock Market & Crypto — generate returns on rising and falling markets worldwide.",
    siteName: "BIT-TESLA",
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: 1600,
        height: 900,
        alt: "BIT-TESLA - Tesla Quantum Market",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIT-TESLA — Tesla Quantum Market | Trade Forex, Stocks & Crypto",
    description:
      "Putting Our Clients First For Over A Decade. BIT-TESLA is a trusted trading platform for Forex, Stock Market & Crypto — generate returns on rising and falling markets worldwide.",
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
