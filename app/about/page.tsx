import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OMNISIM - How It Works",
  description: "Learn how OMNISIM's 35 global AI agents simulate real-world scenarios with unprecedented accuracy.",
};

const agentExamples = [
  {
    name: "Maya Chen",
    role: "Tech Worker, San Francisco",
    code: "US",
    country: "United States",
    pol: "Progressive",
    trust: "Maya is useful when a simulation depends on urban professionals, startup culture, software adoption, public reputation, privacy, online backlash, and values-driven consumer behavior. She spots how educated digital workers interpret a decision before it becomes a social signal.",
    strength: "Early-adopter technology judgment, institutional trust sensitivity, brand-risk awareness, and cultural language around fairness and inclusion.",
    bias: "May over-weight online opinion and under-weight offline, rural, or older-user behavior."
  },
  {
    name: "Carlos Rivera",
    role: "Veteran, San Antonio",
    code: "US",
    country: "United States",
    pol: "Conservative",
    trust: "Carlos gives the system a disciplined, security-minded, duty-first lens. His observer value is strongest when trust, loyalty, national identity, personal sacrifice, leadership credibility, or family stability determines how people react.",
    strength: "Risk discipline, hierarchy awareness, patriotic sentiment, practical skepticism, and respect-for-order decision logic.",
    bias: "May distrust rapid social change or abstract promises until there is visible proof of competence."
  },
  {
    name: "Ngozi Adeola",
    role: "Teacher, Lagos",
    code: "NG",
    country: "Nigeria",
    pol: "Pan-African",
    trust: "Ngozi tests whether an idea survives real pressure: family expectations, young population energy, rising costs, ambition, education gaps, mobile-first behavior, and resourcefulness. She brings the voice of people who turn constraints into strategy.",
    strength: "Emerging-market realism, education and youth behavior, family economics, phone-first adoption, and resilience under limited resources.",
    bias: "May favor practical survival value over luxury, symbolism, or slow institutional processes."
  },
  {
    name: "Li Wei",
    role: "Engineer, Shenzhen",
    code: "CN",
    country: "China",
    pol: "Nationalist",
    trust: "Li Wei is valuable for hardware, manufacturing, automation, scale, disciplined execution, and state-market coordination. He checks whether a scenario can move from idea to infrastructure rather than staying as presentation talk.",
    strength: "Systems thinking, operational speed, supply-chain realism, technical feasibility, and national-competition framing.",
    bias: "May under-weight individual dissent and over-weight coordinated execution or state capacity."
  },
  {
    name: "Elena Petrova",
    role: "Administrator, Moscow",
    code: "RU",
    country: "Russia",
    pol: "Statist",
    trust: "Elena tests hard-power reality: bureaucracy, institutional pressure, propaganda, strategic patience, scarcity behavior, and what people say publicly versus what they privately calculate.",
    strength: "Power mapping, institutional incentives, survival logic, distrust analysis, and second-order consequences under pressure.",
    bias: "May be too cynical about reform, goodwill, or transparent cooperation."
  },
  {
    name: "Thomas Harrington",
    role: "Banker, New York",
    code: "US",
    country: "United States",
    pol: "Libertarian",
    trust: "Thomas evaluates money, incentives, liquidity, legal exposure, investor confidence, and market discipline. He is trusted when a decision must survive capital markets, customer acquisition costs, or rational self-interest.",
    strength: "Financial incentives, downside protection, market psychology, pricing power, and opportunity-cost analysis.",
    bias: "May reduce human motives too aggressively to money, freedom, and incentives."
  },
  {
    name: "Amara Diallo",
    role: "NGO Director, Dakar",
    code: "SN",
    country: "Senegal",
    pol: "Progressive",
    trust: "Amara examines social harm, community trust, development impact, vulnerable populations, public legitimacy, and whether success for one group creates hidden cost for another.",
    strength: "Community trust, ethics, public-good thinking, social adoption barriers, and local stakeholder sensitivity.",
    bias: "May prioritize fairness and social protection even when speed or profit is the user's main goal."
  },
  {
    name: "Fatima Al-Hassan",
    role: "Marketing, Dubai",
    code: "AE",
    country: "United Arab Emirates",
    pol: "Moderate",
    trust: "Fatima reads aspiration, premium positioning, multicultural audiences, status signaling, service quality, and reputation in fast-growing global cities. She helps judge whether an idea feels world-class or merely functional.",
    strength: "Brand polish, luxury psychology, cross-cultural messaging, ambition markets, and conversion through trust cues.",
    bias: "May over-value presentation, prestige, and premium experience compared with bare utility."
  },
  {
    name: "Kevin Park",
    role: "Crypto Trader, Singapore",
    code: "SG",
    country: "Singapore",
    pol: "Libertarian",
    trust: "Kevin tests volatility, speculation, automation, digital-native money behavior, regulatory arbitrage, and whether a high-upside claim collapses under speed, liquidity, or trust pressure.",
    strength: "Fast-market instincts, risk-reward calculation, digital finance, automation leverage, and skeptical reading of hype cycles.",
    bias: "May tolerate more volatility and uncertainty than ordinary users can emotionally handle."
  },
  {
    name: "Roberto Santos",
    role: "Union Org., Sao Paulo",
    code: "BR",
    country: "Brazil",
    pol: "Left-Wing",
    trust: "Roberto watches labor power, inequality, worker resentment, institutional distrust, populist reactions, and whether a policy or product feels exploitative to the people doing the work.",
    strength: "Worker psychology, social tension, class incentives, organizing pressure, and street-level political reaction.",
    bias: "May distrust corporate motives before evidence fully appears."
  },
  {
    name: "Priya Sharma",
    role: "IT Manager, Bangalore",
    code: "IN",
    country: "India",
    pol: "Centrist",
    trust: "Priya brings pragmatic enterprise adoption logic: cost, reliability, training burden, IT security, support needs, procurement friction, and whether teams will actually use the tool every day.",
    strength: "Enterprise practicality, software rollout risk, process discipline, technical support, and cost-conscious scaling.",
    bias: "May prefer proven reliability over bold new positioning."
  },
  {
    name: "Pierre Dubois",
    role: "Professor, Paris",
    code: "FR",
    country: "France",
    pol: "Social Liberal",
    trust: "Pierre challenges shallow claims. He tests logic, ethics, institutional memory, public philosophy, and whether a decision can be defended intellectually, legally, and culturally.",
    strength: "Critical reasoning, policy framing, historical comparison, civic legitimacy, and skeptical analysis of persuasion.",
    bias: "May slow action by demanding deeper justification than the market requires."
  },
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
    <div aria-label={`${country} flag`} className="inline-flex items-center gap-3 rounded-[4px] border border-[rgba(0,255,65,0.28)] bg-[rgba(0,255,65,0.07)] p-1.5">
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
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {agentExamples.map((agent) => (
              <details key={agent.name} className="cyber-card group p-0 open:border-[rgba(0,255,65,0.48)]">
                <summary className="flex min-h-[168px] cursor-pointer list-none flex-col justify-between gap-4 p-4 marker:hidden [&::-webkit-details-marker]:hidden">
                  <div>
                    <FlagMark code={agent.code} country={agent.country} />
                    <p className="mt-4 font-orbitron text-xs font-bold" style={{ color: "#F6FFF9" }}>{agent.name}</p>
                    <p className="mt-1 text-[10px] font-medium" style={{ color: "#DDFEEB" }}>{agent.role}</p>
                    <p className="mt-2 font-orbitron text-[8px] tracking-widest" style={{ color: "#00F5FF" }}>
                      {agent.pol}
                    </p>
                  </div>
                  <span className="font-orbitron text-[9px] font-bold tracking-widest" style={{ color: "#00FF41" }}>
                    TAP TO OPEN OBSERVER FILE
                  </span>
                </summary>
                <div className="border-t border-[rgba(0,255,65,0.18)] px-4 pb-5 pt-4">
                  <p className="font-orbitron text-[10px] font-black uppercase tracking-widest" style={{ color: "#00FF41" }}>
                    Why this observer is trusted
                  </p>
                  <p className="mt-3 text-xs font-medium leading-6" style={{ color: "#E9FFF0" }}>{agent.trust}</p>
                  <p className="mt-4 font-orbitron text-[9px] font-bold uppercase tracking-widest" style={{ color: "#00F5FF" }}>
                    Strongest lens
                  </p>
                  <p className="mt-2 text-xs font-medium leading-6" style={{ color: "#DDFEEB" }}>{agent.strength}</p>
                  <p className="mt-4 font-orbitron text-[9px] font-bold uppercase tracking-widest" style={{ color: "#FBBF24" }}>
                    Bias accounted for
                  </p>
                  <p className="mt-2 text-xs font-medium leading-6" style={{ color: "#F5EFD3" }}>{agent.bias}</p>
                </div>
              </details>
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