import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";`nimport SimWorldBackground from "@/components/SimWorldBackground";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
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
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}