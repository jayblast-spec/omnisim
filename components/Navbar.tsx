"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/simulate", label: "Simulate" },
  { href: "/history", label: "History" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full px-3 pt-3 sm:px-5">
      <div className="matrix-navbar glass-card relative mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2.5 sm:px-6 sm:py-3 md:flex-row md:items-center md:justify-between md:gap-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="OmniSim home">
            <div className="matrix-navbar__mark h-8 w-8 shrink-0 rounded-[12px] border shadow-sm sm:h-9 sm:w-9 sm:rounded-[14px]" />
            <div className="min-w-0 leading-none">
              <span className="hero-title block truncate text-[19px] font-semibold italic sm:text-[22px]" style={{ color: "#EFFFF7", textShadow: "0 0 14px rgba(43,255,143,0.32)" }}>OmniSim</span>
              <span className="block truncate text-[7.5px] font-black uppercase tracking-[0.10em] sm:text-[9px] sm:tracking-[0.16em]" style={{ color: "#7DFFC0" }}>Future Intelligence</span>
            </div>
          </Link>
          <Link href="/simulate" className="matrix-launch min-h-[38px] px-3 py-2 text-[9px] md:hidden">
            Launch
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-1 md:hidden" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-[40px] min-w-0 rounded-xl px-1.5 py-2 text-center text-[9px] font-black uppercase leading-tight tracking-[0.04em] transition"
                style={active ? {
                  color: "#031008",
                  background: "linear-gradient(135deg, rgba(125,255,192,0.94), rgba(0,215,255,0.74))",
                  border: "1px solid rgba(246,255,249,0.76)",
                  boxShadow: "0 0 0 0.5px rgba(255,255,255,0.58) inset, 0 0 18px rgba(0,215,255,0.18)",
                } : {
                  color: "#F4FFF8",
                  background: "rgba(4,32,18,0.78)",
                  border: "1px solid rgba(125,255,192,0.30)",
                  textShadow: "0 0 12px rgba(43,255,143,0.20)",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.22)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[14px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition"
                style={{
                  color: active ? "#031008" : "#F4FFF8",
                  background: active ? "linear-gradient(135deg, rgba(125,255,192,0.92), rgba(0,215,255,0.72))" : "rgba(4,32,18,0.72)",
                  border: active ? "1px solid rgba(246,255,249,0.76)" : "1px solid rgba(125,255,192,0.28)",
                  textShadow: active ? "none" : "0 0 12px rgba(43,255,143,0.22)",
                  boxShadow: active ? "0 0 0 0.5px rgba(255,255,255,0.62) inset, 0 0 22px rgba(0,215,255,0.18)" : "0 8px 18px rgba(0,0,0,0.22)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link href="/simulate" className="matrix-launch hidden text-[10px] md:inline-flex">
          Launch Simulation
        </Link>
      </div>
    </nav>
  );
}