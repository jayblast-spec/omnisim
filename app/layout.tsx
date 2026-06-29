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
    "The world's most powerful AI simulation platform. Deploy intelligent agents to simulate real-world scenarios before they unfold.",
  openGraph: {
    title: "OMNISIM — Simulate Before It Happens",
    description:
      "Simulate PR crises, elections, market movements, sports matches, relationship futures, profit paths, and geopolitical events.",
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
