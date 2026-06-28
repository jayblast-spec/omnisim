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
    <nav className="fixed top-0 z-50 w-full border-b border-[rgba(0,245,255,0.1)] bg-[rgba(3,2,11,0.85)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <span
              className="font-orbitron text-xl font-black tracking-[0.18em] text-white"
              style={{ textShadow: "0 0 12px rgba(0,245,255,0.6)" }}
            >
              OMNI
            </span>
            <span
              className="font-orbitron text-xl font-black tracking-[0.18em]"
              style={{ color: "#00F5FF", textShadow: "0 0 12px #00F5FF, 0 0 30px rgba(0,245,255,0.4)" }}
            >
              SIM
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-orbitron text-[10px] tracking-[0.35em] transition-colors"
              style={{
                color: pathname === link.href ? "#00F5FF" : "rgba(255,255,255,0.5)",
                textShadow: pathname === link.href ? "0 0 8px #00F5FF" : "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/simulate" className="btn-neon hidden text-[10px] md:inline-flex">
          LAUNCH SIMULATION
        </Link>

        <Link
          href="/simulate"
          className="font-orbitron text-[10px] tracking-widest text-[#00F5FF] md:hidden"
        >
          SIMULATE
        </Link>
      </div>
    </nav>
  );
}
