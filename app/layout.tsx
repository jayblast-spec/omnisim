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
  title: "OMNISIM — Predict with Precision",
  description:
    "High-stakes strategy does not survive on intuition. OMNISIM stress-tests critical decisions against probabilistic futures before you commit resources.",
  openGraph: {
    title: "OMNISIM — Predict with Precision",
    description:
      "Stress-test critical decisions, expose hidden vulnerabilities, model competitive responses, and illuminate the optimal path before you commit resources.",
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
