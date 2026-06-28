import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/50 backdrop-blur-3xl px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr_1fr]">
          <div>
            <div className="mb-3">
              <span className="hero-title text-2xl font-semibold italic text-[#0D1117]">OMNI</span>
              <span
                className="hero-title text-2xl font-semibold italic"
                style={{ color: "#00F5FF", textShadow: "0 0 10px #00F5FF" }}
              >
                SIM
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B7894]">
              SIMULATE BEFORE IT HAPPENS
            </p>
            <p className="mt-4 text-xs leading-7 text-[#6B7894]">
              The world&apos;s most powerful AI simulation platform.
              35+ global agents. Real predictions.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B8FD4]">SIMULATIONS</p>
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
                ["Loved One Legacy View", "/simulate/legacy-view"],
                ["Custom Scenario", "/simulate/custom"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-xs font-medium text-[#2D3748] transition-colors hover:text-[#6B8FD4]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B8FD4]">PLATFORM</p>
            <div className="space-y-3">
              {[
                ["About OMNISIM", "/about"],
                ["Simulation Hub", "/simulate"],
                ["History", "/history"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-xs font-medium text-[#2D3748] transition-colors hover:text-[#6B8FD4]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/70 pt-8 sm:flex-row">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6B7894]">
            &copy; 2026 OMNISIM. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6B7894]">
            POWERED BY ARKNET.DIGITAL
          </p>
        </div>
      </div>
    </footer>
  );
}
