import Link from "next/link";

export default function Footer() {
  return (
    <footer className="matrix-footer border-t px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr_1fr]">
          <div>
            <div className="mb-3">
              <span className="hero-title text-2xl font-semibold italic" style={{ color: "#EFFFF7", textShadow: "0 0 12px rgba(43,255,143,0.28)" }}>OMNI</span>
              <span
                className="hero-title text-2xl font-semibold italic"
                style={{ color: "#7DFFC0", textShadow: "0 0 12px rgba(125,255,192,0.45)" }}
              >
                SIM
              </span>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B8EACF]">
              SIMULATE BEFORE IT HAPPENS
            </p>
            <p className="mt-4 text-xs leading-7 text-[#B8EACF]">
              Run the future before you risk the real thing.
              Human reactions, pressure points, and smarter next moves.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7DFFC0]">SIMULATIONS</p>
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
                ["Health Signal", "/simulate/health-signal"],
                ["Loved One Legacy View", "/simulate/legacy-view"],
                ["Custom Scenario", "/simulate/custom"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-xs font-medium text-[#2D3748] transition-colors hover:text-[#7DFFC0]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7DFFC0]">PLATFORM</p>
            <div className="space-y-3">
              {[
                ["About OMNISIM", "/about"],
                ["Simulation Hub", "/simulate"],
                ["History", "/history"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-xs font-medium text-[#2D3748] transition-colors hover:text-[#7DFFC0]"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[rgba(125,255,192,0.22)] pt-8 sm:flex-row">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#B8EACF]">
            &copy; 2026 OMNISIM. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#B8EACF]">
            POWERED BY ARKNET.DIGITAL
          </p>
        </div>
      </div>
    </footer>
  );
}
