import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimWorldBackground from "@/components/SimWorldBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "OMNISIM — Simulate Before It Happens",
  description:
    "Run major decisions through OmniSim before reality charges you for guessing. Simulate human reactions, risk paths, hidden pressure points, and smarter next moves.",
  openGraph: {
    title: "OMNISIM — Simulate Before It Happens",
    description:
      "Before you risk money, reputation, time, health, love, or a major decision, test the likely futures with OmniSim.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body>
        <SimWorldBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
