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

        </div>

        {/* Mobile command rail */}
        <div
          className="md:hidden"
          aria-label="Primary navigation"
          style={{
            borderRadius: 18,
            padding: 4,
            background: "linear-gradient(135deg, rgba(0,255,65,0.16), rgba(0,245,255,0.10), rgba(191,0,255,0.10))",
            border: "1px solid rgba(0,255,65,0.24)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 12px 28px rgba(0,0,0,0.32)",
            backdropFilter: "blur(18px) saturate(160%)",
          }}
        >
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {navLinks.map((link, index) => {
              const active = isActive(pathname, link.href);
              const glow = index === 0 ? "#00FF41" : index === 1 ? "#00F5FF" : index === 2 ? "#BF00FF" : "#FFD700";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative flex min-h-[42px] min-w-[76px] flex-1 items-center justify-center overflow-hidden rounded-[14px] px-3 text-center text-[9px] font-black uppercase leading-none tracking-[0.08em] transition"
                  style={{
                    fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
                    color: active ? "#041208" : "rgba(221,254,235,0.92)",
                    background: active
                      ? `linear-gradient(135deg, ${glow}, rgba(255,255,255,0.78))`
                      : "rgba(5,18,8,0.58)",
                    border: active ? `1px solid ${glow}` : "1px solid rgba(221,254,235,0.10)",
                    boxShadow: active ? `0 0 20px ${glow}55, inset 0 1px 0 rgba(255,255,255,0.55)` : "inset 0 1px 0 rgba(255,255,255,0.06)",
                    textShadow: active ? "none" : "0 0 10px rgba(0,255,65,0.26)",
                  }}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
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

      </div>
    </nav>
  );
}
