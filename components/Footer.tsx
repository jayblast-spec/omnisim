import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,245,255,0.08)] bg-[#03020B] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr_1fr]">
          <div>
            <div className="mb-3">
              <span className="font-orbitron text-2xl font-black text-white">OMNI</span>
              <span
                className="font-orbitron text-2xl font-black"
                style={{ color: "#00F5FF", textShadow: "0 0 10px #00F5FF" }}
              >
                SIM
              </span>
            </div>
            <p className="font-orbitron text-[10px] tracking-[0.4em] text-white/30">
              SIMULATE BEFORE IT HAPPENS
            </p>
            <p className="mt-4 text-xs leading-7 text-white/25">
              The world&apos;s most powerful AI simulation platform.
              35+ global agents. Real predictions.
            </p>
          </div>

          <div>
            <p className="mb-5 font-orbitron text-[10px] tracking-[0.4em] text-[#00F5FF]">SIMULATIONS</p>
            <div className="space-y-3">
              {[
                ["Public Reaction", "/simulate/public-reaction"],
                ["Election Outcome", "/simulate/election"],
                ["Market Movement", "/simulate/markets"],
                ["Sports Match", "/simulate/sports"],
                ["Policy Impact", "/simulate/policy"],
                ["Product Launch", "/simulate/product-launch"],
                ["Geopolitical Event", "/simulate/geopolitical"],
                ["$1K Profit Path", "/simulate/profit-path"],
                ["Relationship Future", "/simulate/relationship"],
                ["Custom Scenario", "/simulate/custom"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-xs text-white/35 transition-colors hover:text-[#00F5FF]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 font-orbitron text-[10px] tracking-[0.4em] text-[#00F5FF]">PLATFORM</p>
            <div className="space-y-3">
              {[
                ["About OMNISIM", "/about"],
                ["Simulation Hub", "/simulate"],
                ["History", "/history"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-xs text-white/35 transition-colors hover:text-[#00F5FF]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="font-orbitron text-[9px] tracking-widest text-white/20">
            &copy; 2026 OMNISIM. ALL RIGHTS RESERVED.
          </p>
          <p className="font-orbitron text-[9px] tracking-widest text-white/15">
            POWERED BY GROQ AI &middot; SUPABASE &middot; NEXT.JS
          </p>
        </div>
      </div>
    </footer>
  );
}
