import Link from "next/link";
import { simTypes } from "@/lib/siteConfig";

const stats = [
  { value: "35+", label: "Global AI Agents" },
  { value: "12", label: "Simulation Types" },
  { value: "20", label: "Agents Per Run" },
  { value: "∞", label: "Scenarios Possible" },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose Your Simulation",
    description: "Select from 12 categories: PR crisis, election, markets, sports, policy, product launch, geopolitical, relationship futures, health signals, loved one legacy view, $1K profit paths, or fully custom.",
  },
  {
    step: "02",
    title: "Complete the Intelligence Form",
    description: "Fill in a comprehensive W2-style intake form. The more detail you provide, the more accurate the simulation.",
  },
  {
    step: "03",
    title: "Deploy 20 Global AI Agents",
    description: "OMNISIM deploys 20 diverse agents — from a Lagos teacher to a Singapore crypto trader — each reacting authentically to your scenario.",
  },
  {
    step: "04",
    title: "Receive Intelligence Report",
    description: "Get a full prediction: sentiment breakdown, individual agent reactions, risk analysis, opportunities, and strategic recommendations.",
  },
];

const useCases = [
  { icon: "🏛️", title: "Governments", text: "Test policy decisions before announcements. Measure public acceptance. Avoid political backlash." },
  { icon: "🏦", title: "Hedge Funds & Traders", text: "Simulate market sentiment on breaking macro events. Trade before the crowd reacts." },
  { icon: "📰", title: "PR & Communications", text: "Simulate how a crisis statement will land globally. Never walk into a PR disaster blind." },
  { icon: "⚽", title: "Sports Analysts", text: "Model match outcomes with probabilistic agent simulations. Beyond stats — into intangibles." },
  { icon: "🚀", title: "Startups & Enterprises", text: "Test product launches across global markets before spending a dollar on ads." },
  { icon: "🌎", title: "Intelligence Agencies", text: "Model geopolitical event outcomes, escalation scenarios, and diplomatic ripple effects." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-32 sm:px-8">
        <div className="simulation-field" aria-hidden="true" />
        <div className="matrix-rain" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${3 + i * 5.6}%`,
                animationDelay: `${(i % 6) * -1.8}s`,
                animationDuration: `${10 + (i % 5) * 1.8}s`,
              }}
            >
              {i % 3 === 0 ? "011010AI391010OMNISIM24" : i % 3 === 1 ? "TRUEFALSE0101RISKPATH" : "HUMANVAR4729FUTURE"}
            </span>
          ))}
        </div>        <div className="sim-node-rail" aria-hidden="true" />

        <div className="hero-copy relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-sm border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.03)] px-5 py-2.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#00FF7F", boxShadow: "0 0 8px #00FF7F" }}
            />
            <span className="font-orbitron text-[9px] tracking-[0.5em] text-[#00F5FF]">
              SYSTEM ONLINE — 35 AGENTS READY
            </span>
          </div>

          <h1 className="omnisim-wordmark font-orbitron text-7xl font-black leading-none tracking-tight sm:text-9xl lg:text-[11rem]" data-text="OMNISIM">
            <span>OMNI</span><span>SIM</span>
          </h1>

          <p className="mt-6 font-orbitron text-xs font-black tracking-[0.18em] sm:tracking-[0.32em]" style={{ color: "#B8FFD8", textShadow: "0 0 18px rgba(43,255,143,0.45), 0 2px 12px rgba(0,0,0,0.75)" }}>
            SIMULATE BEFORE IT HAPPENS
          </p>

          <p className="mx-auto mt-8 max-w-2xl rounded-2xl border px-5 py-4 text-sm font-semibold leading-8 sm:leading-9" style={{ color: "#F4FFF8", background: "rgba(2,8,5,0.58)", borderColor: "rgba(125,255,192,0.22)", textShadow: "0 2px 12px rgba(0,0,0,0.78)", boxShadow: "0 18px 44px rgba(0,0,0,0.22), 0 0 30px rgba(43,255,143,0.08)" }}>
            The world&apos;s most powerful AI simulation platform. Deploy 35+ intelligent global agents to
            predict public reactions, election outcomes, market movements, sports results, and geopolitical
            events — before they happen.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/simulate" className="btn-solid">
              LAUNCH SIMULATION ⚡
            </Link>
            <Link href="/about" className="btn-neon">
              HOW IT WORKS
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="cyber-card py-6 text-center">
                <p
                  className="font-orbitron text-3xl font-black md:text-4xl"
                  style={{ color: "#00F5FF", textShadow: "0 0 15px rgba(0,245,255,0.4)" }}
                >
                  {s.value}
                </p>
                <p className="mt-2 font-orbitron text-[8px] tracking-widest text-white/25">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden border-y border-[rgba(0,245,255,0.07)] bg-[rgba(0,245,255,0.015)] py-3">
        <div className="ticker-track">
          {[
            "PUBLIC REACTION", "◡", "ELECTION OUTCOME", "◡", "MARKET MOVEMENT", "◡",
            "SPORTS SIMULATION", "◡", "POLICY IMPACT", "◡", "PRODUCT LAUNCH", "◡",
            "GEOPOLITICAL EVENT", "◡", "RELATIONSHIP FUTURE", "◡", "HEALTH SIGNAL", "◡", "LOVED ONE LEGACY VIEW", "◡", "$1K PROFIT PATH", "◡", "CUSTOM SCENARIO", "◡",
            "PUBLIC REACTION", "◡", "ELECTION OUTCOME", "◡", "MARKET MOVEMENT", "◡",
            "SPORTS SIMULATION", "◡", "POLICY IMPACT", "◡", "PRODUCT LAUNCH", "◡",
            "GEOPOLITICAL EVENT", "◡", "RELATIONSHIP FUTURE", "◡", "HEALTH SIGNAL", "◡", "LOVED ONE LEGACY VIEW", "◡", "$1K PROFIT PATH", "◡", "CUSTOM SCENARIO", "◡",
          ].map((item, i) => (
            <span key={i} className="font-orbitron text-[9px] tracking-[0.4em] text-white/10 whitespace-nowrap">
              {item}&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* SIMULATION TYPES */}
      <section className="px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="section-label">SIMULATION TYPES</p>
            <h2 className="home-heading mt-4 font-orbitron text-3xl font-black md:text-4xl">
              What can OMNISIM simulate?
            </h2>
            <p className="home-copy mx-auto mt-4 max-w-2xl text-sm font-semibold leading-8">
              Twelve categories of world-class simulations. Each powered by 20 diverse global AI agents and a comprehensive intelligence intake form.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {simTypes.map((sim) => (
              <Link
                key={sim.id}
                href={`/simulate/${sim.id}`}
                className="cyber-card group flex flex-col gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,245,255,0.3)]"
              >
                <div className="text-4xl">{sim.icon}</div>
                <div>
                  <p className="font-orbitron text-sm font-bold text-white group-hover:text-[#00F5FF] transition-colors">
                    {sim.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-white/35">{sim.description}</p>
                </div>
                <p className="mt-auto font-orbitron text-[8px] tracking-widest text-white/20">
                  {sim.usedBy}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[rgba(0,245,255,0.06)] bg-[rgba(0,245,255,0.01)] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="section-label">METHODOLOGY</p>
            <h2 className="home-heading mt-4 font-orbitron text-3xl font-black md:text-4xl">
              How OMNISIM works
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="cyber-card p-6">
                <p
                  className="font-orbitron text-6xl font-black"
                  style={{ color: "rgba(0,245,255,0.06)" }}
                >
                  {item.step}
                </p>
                <p className="mt-2 font-orbitron text-sm font-bold text-white">{item.title}</p>
                <p className="mt-3 text-xs leading-7 text-white/35">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="border-t border-[rgba(0,245,255,0.06)] px-5 py-28 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <p className="section-label">USE CASES</p>
            <h2 className="home-heading mt-4 font-orbitron text-3xl font-black md:text-4xl">
              Who uses OMNISIM?
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <div key={uc.title} className="cyber-card p-6">
                <div className="mb-3 text-3xl">{uc.icon}</div>
                <p className="font-orbitron text-sm font-bold text-white">{uc.title}</p>
                <p className="mt-3 text-xs leading-7 text-white/40">{uc.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-[rgba(0,245,255,0.06)] bg-[rgba(0,245,255,0.01)] px-5 py-36 text-center sm:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="section-label">READY TO SIMULATE?</p>
          <h2 className="home-heading mt-6 font-orbitron text-4xl font-black md:text-5xl">
            Stop guessing.<br />
            <span style={{ color: "#00F5FF", textShadow: "0 0 20px rgba(0,245,255,0.4)" }}>
              Start simulating.
            </span>
          </h2>
          <p className="home-copy mx-auto mt-6 max-w-xl text-sm font-semibold leading-9">
            Governments, hedge funds, PR firms, and sports analysts already rely on simulation intelligence.
            Now you have access to the most powerful system ever built for individuals and organizations alike.
          </p>
          <div className="mt-12">
            <Link href="/simulate" className="btn-solid text-base px-10 py-4">
              SIMULATE NOW ⚡
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
