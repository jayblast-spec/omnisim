import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OMNISIM - How It Works",
  description: "Learn how OMNISIM's 35 global AI agents simulate real-world scenarios with unprecedented accuracy.",
};

const agentExamples = [
  { name: "Maya Chen", role: "Tech Worker, San Francisco", code: "US", country: "United States", pol: "Progressive" },
  { name: "Carlos Rivera", role: "Veteran, San Antonio", code: "US", country: "United States", pol: "Conservative" },
  { name: "Ngozi Adeola", role: "Teacher, Lagos", code: "NG", country: "Nigeria", pol: "Pan-African" },
  { name: "Li Wei", role: "Engineer, Shenzhen", code: "CN", country: "China", pol: "Nationalist" },
  { name: "Elena Petrova", role: "Administrator, Moscow", code: "RU", country: "Russia", pol: "Statist" },
  { name: "Thomas Harrington", role: "Banker, New York", code: "US", country: "United States", pol: "Libertarian" },
  { name: "Amara Diallo", role: "NGO Director, Dakar", code: "SN", country: "Senegal", pol: "Progressive" },
  { name: "Fatima Al-Hassan", role: "Marketing, Dubai", code: "AE", country: "United Arab Emirates", pol: "Moderate" },
  { name: "Kevin Park", role: "Crypto Trader, Singapore", code: "SG", country: "Singapore", pol: "Libertarian" },
  { name: "Roberto Santos", role: "Union Org., Sao Paulo", code: "BR", country: "Brazil", pol: "Left-Wing" },
  { name: "Priya Sharma", role: "IT Manager, Bangalore", code: "IN", country: "India", pol: "Centrist" },
  { name: "Pierre Dubois", role: "Professor, Paris", code: "FR", country: "France", pol: "Social Liberal" },
];

const principles = [
  { title: "Diversity First", text: "Every simulation deploys agents across political spectrum, economic class, geography, age, and media diet. No echo chambers." },
  { title: "Authentic Perspective", text: "Each agent has a richly defined identity - occupation, values, disposition, media consumption. They react as that person would, not as a generic AI." },
  { title: "Parallel Processing", text: "All 20 agents run simultaneously via Groq's ultra-fast inference. Results aggregated in seconds, not hours." },
  { title: "Intelligence Synthesis", text: "A master synthesizer analyzes all agent reactions and generates a unified prediction, confidence rating, risks, opportunities, and strategic recommendation." },
];

function Star({ cx, cy, r = 4, fill = "#ffde00" }: { cx: number; cy: number; r?: number; fill?: string }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? r : r * 0.42;
    return `${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`;
  }).join(" ");

  return <polygon points={points} fill={fill} />;
}

function FlagMark({ code, country }: { code: string; country: string }) {
  const frameClass = "block h-8 w-12 overflow-hidden rounded-[3px] border border-white/40 shadow-[0_0_18px_rgba(0,255,65,0.18)]";

  return (
    <div aria-label={`${country} flag`} className="mb-3 inline-flex items-center gap-3 rounded-[4px] border border-[rgba(0,255,65,0.28)] bg-[rgba(0,255,65,0.07)] p-1.5">
      {code === "US" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="United States flag">
          <rect width="48" height="32" fill="#b22234" />
          {[2, 6, 10, 14, 18, 22, 26, 30].map((y) => <rect key={y} y={y} width="48" height="2" fill="#fff" />)}
          <rect width="20" height="17" fill="#3c3b6e" />
          {[4, 10, 16].map((x) => [4, 9, 14].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#fff" />))}
        </svg>
      )}
      {code === "NG" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="Nigeria flag">
          <rect width="16" height="32" fill="#008751" /><rect x="16" width="16" height="32" fill="#fff" /><rect x="32" width="16" height="32" fill="#008751" />
        </svg>
      )}
      {code === "CN" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="China flag">
          <rect width="48" height="32" fill="#de2910" /><Star cx={10} cy={9} r={5} /><Star cx={19} cy={5} r={2} /><Star cx={23} cy={10} r={2} /><Star cx={22} cy={16} r={2} /><Star cx={17} cy={20} r={2} />
        </svg>
      )}
      {code === "RU" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="Russia flag">
          <rect width="48" height="32" fill="#fff" /><rect y="10.67" width="48" height="10.67" fill="#0039a6" /><rect y="21.34" width="48" height="10.66" fill="#d52b1e" />
        </svg>
      )}
      {code === "SN" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="Senegal flag">
          <rect width="16" height="32" fill="#00853f" /><rect x="16" width="16" height="32" fill="#fdef42" /><rect x="32" width="16" height="32" fill="#e31b23" /><Star cx={24} cy={16} r={5} fill="#00853f" />
        </svg>
      )}
      {code === "AE" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="United Arab Emirates flag">
          <rect width="48" height="32" fill="#fff" /><rect x="12" width="36" height="10.67" fill="#009a44" /><rect x="12" y="21.34" width="36" height="10.66" fill="#000" /><rect width="12" height="32" fill="#ff0000" />
        </svg>
      )}
      {code === "SG" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="Singapore flag">
          <rect width="48" height="16" fill="#ef3340" /><rect y="16" width="48" height="16" fill="#fff" /><circle cx="11" cy="8" r="6" fill="#fff" /><circle cx="13" cy="8" r="5" fill="#ef3340" /><Star cx={21} cy={5} r={1.6} fill="#fff" /><Star cx={24} cy={8} r={1.6} fill="#fff" /><Star cx={21} cy={11} r={1.6} fill="#fff" />
        </svg>
      )}
      {code === "BR" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="Brazil flag">
          <rect width="48" height="32" fill="#009b3a" /><polygon points="24,4 44,16 24,28 4,16" fill="#ffdf00" /><circle cx="24" cy="16" r="7" fill="#002776" /><path d="M17 15c5 2 10 2 14 0" stroke="#fff" strokeWidth="1.4" fill="none" />
        </svg>
      )}
      {code === "IN" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="India flag">
          <rect width="48" height="10.67" fill="#ff9933" /><rect y="10.67" width="48" height="10.67" fill="#fff" /><rect y="21.34" width="48" height="10.66" fill="#138808" /><circle cx="24" cy="16" r="4" fill="none" stroke="#000080" strokeWidth="1" /><circle cx="24" cy="16" r="1" fill="#000080" />
        </svg>
      )}
      {code === "FR" && (
        <svg viewBox="0 0 48 32" className={frameClass} role="img" aria-label="France flag">
          <rect width="16" height="32" fill="#0055a4" /><rect x="16" width="16" height="32" fill="#fff" /><rect x="32" width="16" height="32" fill="#ef4135" />
        </svg>
      )}
      <span className="font-orbitron text-[9px] font-black tracking-widest" style={{ color: "#DDFEEB" }}>{country}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24 pt-28">
      <section className="px-5 py-16 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="section-label">ABOUT OMNISIM</p>
          <h1 className="page-heading mt-4 font-orbitron text-4xl font-black md:text-5xl">
            How the simulation engine works
          </h1>
          <p className="page-copy mx-auto mt-6 max-w-2xl text-sm font-semibold leading-9">
            OMNISIM is not a chatbot. It is a multi-agent intelligence system that deploys 35 distinct
            global personas - each with a unique worldview, media diet, values, and disposition - and
            forces them to react authentically to your scenario.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center section-label">THE AGENT NETWORK</p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {agentExamples.map((agent) => (
              <div key={agent.name} className="cyber-card p-4">
                <FlagMark code={agent.code} country={agent.country} />
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