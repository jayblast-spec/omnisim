import Link from "next/link";
import { simTypes } from "@/lib/siteConfig";

const stats = [
  { value: "35+", label: "Global AI Agents" },
  { value: "11", label: "Simulation Types" },
  { value: "20", label: "Agents Per Run" },
  { value: "∞", label: "Scenarios Possible" },
];

const howItWorks = [
  {
    step: "01",
    title: "Choose Your Simulation",
    description: "Select from 11 categories: PR crisis, election, markets, sports, policy, product launch, geopolitical, relationship futures, loved one legacy view, $1K profit paths, or fully custom.",
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
        <div className="absolute inset-0 cyber-grid" style={{ opacity: 0.35 }} />
        <div
          className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(191,0,255,0.08), transparent)", filter: "blur(40px)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,245,255,0.06), transparent)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-sm border border-[rgba(0,245,255,0.15)] bg-[rgba(0,245,255,0.03)] px-5 py-2.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "#00FF7F", boxShadow: "0 0 8px #00FF7F" }}
            />
            <span className="font-orbitron text-[9px] tracking-[0.5em] text-[#00F5FF]">
              SYSTEM ONLINE — 35 AGENTS READY
            </span>
          </div>

          <h1 className="font-orbitron text-7xl font-black leading-none tracking-tight sm:text-9xl lg:text-[11rem]">
            <span className="text-white">OMNI</span>
            <span
              style={{
                color: "#00F5FF",
                textShadow: "0 0 20px #00F5FF, 0 0 60px rgba(0,245,255,0.25)",
              }}
            >
              SIM
            </span>
          </h1>

          <p className="mt-6 font-orbitron text-xs tracking-[0.6em] text-white/30">
            SIMULATE BEFORE IT HAPPENS
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-9 text-white/45">
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
            "GEOPOLITICAL EVENT", "◡", "RELATIONSHIP FUTURE", "◡", "LOVED ONE LEGACY VIEW", "◡", "$1K PROFIT PATH", "◡", "CUSTOM SCENARIO", "◡",
            "PUBLIC REACTION", "◡", "ELECTION OUTCOME", "◡", "MARKET MOVEMENT", "◡",
            "SPORTS SIMULATION", "◡", "POLICY IMPACT", "◡", "PRODUCT LAUNCH", "◡",
            "GEOPOLITICAL EVENT", "◡", "RELATIONSHIP FUTURE", "◡", "LOVED ONE LEGACY VIEW", "◡", "$1K PROFIT PATH", "◡", "CUSTOM SCENARIO", "◡",
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
            <h2 className="mt-4 font-orbitron text-3xl font-black text-white md:text-4xl">
              What can OMNISIM simulate?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/40">
              Eleven categories of world-class simulations. Each powered by 20 diverse global AI agents and a comprehensive intelligence intake form.
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
            <h2 className="mt-4 font-orbitron text-3xl font-black text-white md:text-4xl">
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
            <h2 className="mt-4 font-orbitron text-3xl font-black text-white md:text-4xl">
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
          <h2 className="mt-6 font-orbitron text-4xl font-black text-white md:text-5xl">
            Stop guessing.<br />
            <span style={{ color: "#00F5FF", textShadow: "0 0 20px rgba(0,245,255,0.4)" }}>
              Start simulating.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-9 text-white/40">
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
