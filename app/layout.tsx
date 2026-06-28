import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-share-tech",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "OMNISIM — Simulate Before It Happens",
  description:
    "The world's most powerful AI simulation platform. Deploy 35+ intelligent agents to simulate real-world scenarios before they unfold.",
  openGraph: {
    title: "OMNISIM — Simulate Before It Happens",
    description:
      "Deploy 35+ AI agents to simulate PR crises, elections, market movements, sports matches, and geopolitical events.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${jetbrainsMono.variable} ${shareTechMono.variable}`}
    >
      <body className="scanlines">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
