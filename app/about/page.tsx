import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OMNISIM — How It Works",
  description: "Learn how OMNISIM's 35 global AI agents simulate real-world scenarios with unprecedented accuracy.",
};

const agentExamples = [
  { name: "Maya Chen", role: "Tech Worker, San Francisco", flag: "🇺🇸", code: "US", country: "United States", pol: "Progressive" },
  { name: "Carlos Rivera", role: "Veteran, San Antonio", flag: "🇺🇸", code: "US", country: "United States", pol: "Conservative" },
  { name: "Ngozi Adeola", role: "Teacher, Lagos", flag: "🇳🇬", code: "NG", country: "Nigeria", pol: "Pan-African" },
  { name: "Li Wei", role: "Engineer, Shenzhen", flag: "🇨🇳", code: "CN", country: "China", pol: "Nationalist" },
  { name: "Elena Petrova", role: "Administrator, Moscow", flag: "🇷🇺", code: "RU", country: "Russia", pol: "Statist" },
  { name: "Thomas Harrington", role: "Banker, New York", flag: "🇺🇸", code: "US", country: "United States", pol: "Libertarian" },
  { name: "Amara Diallo", role: "NGO Director, Dakar", flag: "🇸🇳", code: "SN", country: "Senegal", pol: "Progressive" },
  { name: "Fatima Al-Hassan", role: "Marketing, Dubai", flag: "🇦🇪", code: "AE", country: "United Arab Emirates", pol: "Moderate" },
  { name: "Kevin Park", role: "Crypto Trader, Singapore", flag: "🇸🇬", code: "SG", country: "Singapore", pol: "Libertarian" },
  { name: "Roberto Santos", role: "Union Org., São Paulo", flag: "🇧🇷", code: "BR", country: "Brazil", pol: "Left-Wing" },
  { name: "Priya Sharma", role: "IT Manager, Bangalore", flag: "🇮🇳", code: "IN", country: "India", pol: "Centrist" },
  { name: "Pierre Dubois", role: "Professor, Paris", flag: "🇫🇷", code: "FR", country: "France", pol: "Social Liberal" },
];

const principles = [
  { title: "Diversity First", text: "Every simulation deploys agents across political spectrum, economic class, geography, age, and media diet. No echo chambers." },
  { title: "Authentic Perspective", text: "Each agent has a richly defined identity — occupation, values, disposition, media consumption. They react as that person would, not as a generic AI." },
  { title: "Parallel Processing", text: "All 20 agents run simultaneously via Groq's ultra-fast inference. Results aggregated in seconds, not hours." },
  { title: "Intelligence Synthesis", text: "A master synthesizer analyzes all agent reactions and generates a unified prediction, confidence rating, risks, opportunities, and strategic recommendation." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24 pt-28">
      {/* Hero */}
      <section className="px-5 py-16 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="section-label">ABOUT OMNISIM</p>
          <h1 className="page-heading mt-4 font-orbitron text-4xl font-black md:text-5xl">
            How the simulation engine works
          </h1>
          <p className="page-copy mx-auto mt-6 max-w-2xl text-sm font-semibold leading-9">
            OMNISIM is not a chatbot. It is a multi-agent intelligence system that deploys 35 distinct
            global personas — each with a unique worldview, media diet, values, and disposition — and
            forces them to react authentically to your scenario.
          </p>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center section-label">THE AGENT NETWORK</p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {agentExamples.map((agent) => (
              <div key={agent.name} className="cyber-card p-4">
                <div
                  aria-label={`${agent.country} field agent`}
                  className="mb-3 inline-flex h-9 min-w-16 items-center gap-2 rounded-[4px] border px-2"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,255,65,0.22), rgba(0,245,255,0.13), rgba(255,0,119,0.10))",
                    borderColor: "rgba(0,255,65,0.38)",
                    color: "#F6FFF9",
                    boxShadow: "0 0 18px rgba(0,255,65,0.14)",
                  }}
                >
                  <span
                    className="text-xl leading-none"
                    style={{ fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}
                  >
                    {agent.flag}
                  </span>
                  <span className="font-orbitron text-[10px] font-black tracking-widest" style={{ color: "#00FF41" }}>
                    {agent.code}
                  </span>
                </div>
                <p className="font-orbitron text-xs font-bold" style={{ color: "#F6FFF9" }}>{agent.name}</p>
                <p className="mt-1 text-[10px] font-medium" style={{ color: "#DDFEEB" }}>{agent.role}</p>
                <p className="mt-2 font-orbitron text-[8px] tracking-widest" style={{ color: "#00F5FF" }}>
                  {agent.pol}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-orbitron text-[9px] font-bold tracking-widest" style={{ color: "#BCEFD2" }}>
            + 23 MORE AGENTS ACROSS 30+ COUNTRIES
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-[rgba(0,245,255,0.06)] bg-[rgba(0,245,255,0.01)] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-10 text-center section-label">CORE PRINCIPLES</p>
          <div className="grid gap-6 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="cyber-card p-8">
                <p className="font-orbitron text-base font-bold" style={{ color: "#F6FFF9" }}>{p.title}</p>
                <p className="mt-4 text-sm font-medium leading-8" style={{ color: "#DDFEEB" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 text-center sm:px-8">
        <p className="section-label">READY?</p>
        <h2 className="page-heading mt-6 font-orbitron text-3xl font-black">
          See it in action.
        </h2>
        <div className="mt-10">
          <Link href="/simulate" className="btn-solid">
            LAUNCH YOUR FIRST SIMULATION
          </Link>
        </div>
      </section>
    </div>
  );
}
