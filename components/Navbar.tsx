"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/simulate", label: "Simulate" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full px-3 pt-3 sm:px-5">
      <div className="matrix-navbar glass-card relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="OmniSim home" onClick={() => setOpen(false)}>
          <div className="matrix-navbar__mark h-8 w-8 shrink-0 rounded-[12px] border shadow-sm sm:h-9 sm:w-9 sm:rounded-[14px]" />
          <div className="min-w-0 leading-none">
            <span className="hero-title block truncate text-[19px] font-semibold italic sm:text-[22px]" style={{ color: "#EFFFF7", textShadow: "0 0 14px rgba(43,255,143,0.32)" }}>OmniSim</span>
            <span className="block truncate text-[7.5px] font-black uppercase tracking-[0.10em] sm:text-[9px] sm:tracking-[0.16em]" style={{ color: "#7DFFC0" }}>Future Intelligence</span>
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

        <Link href="/simulate" className="matrix-launch hidden text-[10px] md:inline-flex">
          Launch Simulation
        </Link>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative z-20 flex h-10 shrink-0 items-center justify-center gap-2 rounded-[14px] border px-3 text-[#0D1117] md:hidden"
          style={{ background: "rgba(255,255,255,0.86)", borderColor: "rgba(15,23,42,0.16)", boxShadow: "0 8px 18px rgba(15,23,42,0.10)" }}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
            <span className="block h-0.5 w-4 rounded-full bg-current" />
          </span>
        </button>

        {open && (
          <div className="fixed left-3 right-3 top-[74px] z-[80] rounded-2xl border p-2 md:hidden" style={{ background: "rgba(2,18,10,0.96)", borderColor: "rgba(125,255,192,0.34)", boxShadow: "0 18px 42px rgba(0,0,0,0.36), 0 0 32px rgba(43,255,143,0.12)" }}>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="min-h-[44px] rounded-xl px-3 py-3 text-center text-[11px] font-black uppercase tracking-[0.08em] transition"
                    style={active ? { color: "#031008", background: "linear-gradient(135deg, rgba(125,255,192,0.90), rgba(38,255,135,0.70))", border: "1px solid rgba(190,255,223,0.72)" } : { color: "#D9FFE9", background: "rgba(4,32,18,0.82)", border: "1px solid rgba(125,255,192,0.22)" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/simulate"
                onClick={() => setOpen(false)}
                className="col-span-2 min-h-[44px] rounded-xl px-3 py-3 text-center text-[11px] font-black uppercase tracking-[0.08em] text-white"
                style={{ color: "#031008", background: "linear-gradient(135deg, #7DFFC0, #26FF87, #00D7FF)", boxShadow: "0 10px 24px rgba(43,255,143,0.26)" }}
              >
                Launch Simulation
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}