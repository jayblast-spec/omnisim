"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/simulate", label: "Simulate" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full px-3 pt-3 sm:px-5">
      <div className="glass-card mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="OmniSim home">
          <div className="h-9 w-9 rounded-[14px] border border-white/80 bg-white/60 shadow-sm" />
          <div className="leading-none">
            <span className="hero-title block text-[22px] font-semibold italic text-[#0D1117]">OmniSim</span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6B7894]">Future Intelligence</span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[14px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition"
                style={{
                  color: active ? "#0D1117" : "#2D3748",
                  background: active ? "rgba(255,255,255,0.62)" : "transparent",
                  boxShadow: active ? "0 0 0 0.5px rgba(255,255,255,0.9) inset" : "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link href="/simulate" className="btn-gold hidden text-[10px] md:inline-flex">
          Launch Simulation
        </Link>

        <Link href="/simulate" className="btn-glass text-[10px] md:hidden">
          Simulate
        </Link>
      </div>
    </nav>
  );
}