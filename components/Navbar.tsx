"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/",        label: "Home" },
  { href: "/about",   label: "About" },
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
      <div className="matrix-navbar relative mx-auto flex max-w-7xl flex-col gap-2 rounded px-3 py-2.5 sm:px-6 sm:py-3 md:flex-row md:items-center md:justify-between md:gap-3">

        {/* Logo + mobile launch */}
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="OmniSim home">
            <div className="matrix-navbar__mark h-8 w-8 shrink-0 rounded sm:h-9 sm:w-9" />
            <div className="min-w-0 leading-none">
              <span
                className="block truncate text-[17px] font-bold"
                style={{
                  fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                  color: "#00FF41",
                  textShadow: "0 0 12px rgba(0,255,65,0.40)",
                  letterSpacing: "-0.02em",
                }}
              >
                OMNISIM
              </span>
              <span
                className="block truncate text-[8px] tracking-[0.18em]"
                style={{
                  fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                  color: "rgba(0,255,65,0.52)",
                  textTransform: "uppercase",
                }}
              >
                FUTURE INTELLIGENCE
              </span>
            </div>
          </Link>
          <Link href="/simulate" className="matrix-launch min-h-[36px] px-3 py-1.5 text-[9px] md:hidden">
            Launch
          </Link>
        </div>

        {/* Mobile nav grid */}
        <div className="grid grid-cols-4 gap-1 md:hidden" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="min-h-[40px] min-w-0 rounded px-1.5 py-2 text-center text-[9px] font-bold uppercase leading-tight tracking-[0.06em] transition"
                style={{
                  fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                  color:      active ? "#003907" : "rgba(218,230,210,0.80)",
                  background: active ? "#00FF41" : "rgba(20,30,18,0.72)",
                  border:     active ? "1px solid rgba(0,255,65,0.90)" : "1px solid rgba(0,255,65,0.18)",
                  boxShadow:  active ? "0 0 16px rgba(0,255,65,0.35)" : "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop nav row */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-4 py-2 text-[11px] font-bold uppercase tracking-[0.10em] transition"
                style={{
                  fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                  color:      active ? "#003907" : "rgba(218,230,210,0.82)",
                  background: active ? "#00FF41" : "rgba(20,30,18,0.60)",
                  border:     active ? "1px solid rgba(0,255,65,0.90)" : "1px solid rgba(0,255,65,0.18)",
                  boxShadow:  active ? "0 0 20px rgba(0,255,65,0.35)" : "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/simulate"
          className="matrix-launch hidden text-[10px] md:inline-flex"
          style={{ padding: "0.55rem 1.1rem" }}
        >
          Launch Simulation
        </Link>
      </div>
    </nav>
  );
}
