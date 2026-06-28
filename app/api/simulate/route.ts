import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseClient";
import { selectAgentsForSimulation } from "@/lib/agentProfiles";
import type { AgentProfile } from "@/lib/agentProfiles";

export interface AgentResult {
  agentId: string;
  agentName: string;
  location: string;
  age: number;
  occupation: string;
  politicalLeaning: string;
  economicStatus: string;
  mediaDiet: string;
  values: string[];
  sentiment: "positive" | "negative" | "neutral";
  intensity: number;
  reaction: string;
  likelyAction: string;
}

type FormValue = string | string[];

function fv(val: FormValue | undefined): string {
  if (!val) return "Not specified";
  return Array.isArray(val) ? val.join(", ") : val;
}

// ─── Population Intelligence Layer ───────────────────────────────────────────
// Real-world population weights by city/country (millions)
function getRegionPopulation(location: string): number {
  const loc = location.toLowerCase();
  if (/china|beijing|shanghai|hong kong|shenzhen/.test(loc)) return 1411;
  if (/india|mumbai|delhi|bangalore|kolkata|chennai|hyderabad/.test(loc)) return 1417;
  if (/nigeria|lagos|abuja|kano/.test(loc)) return 220;
  if (/usa|united states|new york|chicago|los angeles|washington|houston|atlanta/.test(loc)) return 335;
  if (/brazil|s[aã]o paulo|rio|brasilia/.test(loc)) return 215;
  if (/indonesia|jakarta|surabaya/.test(loc)) return 277;
  if (/pakistan|karachi|lahore|islamabad/.test(loc)) return 231;
  if (/bangladesh|dhaka/.test(loc)) return 170;
  if (/russia|moscow|saint petersburg/.test(loc)) return 145;
  if (/mexico|ciudad de mexico|monterrey/.test(loc)) return 130;
  if (/ethiopia|addis ababa/.test(loc)) return 123;
  if (/japan|tokyo|osaka|kyoto/.test(loc)) return 125;
  if (/philippines|manila|cebu/.test(loc)) return 115;
  if (/egypt|cairo|alexandria/.test(loc)) return 104;
  if (/congo|kinshasa/.test(loc)) return 100;
  if (/vietnam|hanoi|ho chi minh/.test(loc)) return 97;
  if (/iran|tehran|isfahan/.test(loc)) return 88;
  if (/turkey|istanbul|ankara/.test(loc)) return 85;
  if (/germany|berlin|munich|frankfurt/.test(loc)) return 84;
  if (/uk|london|manchester|birmingham|united kingdom/.test(loc)) return 68;
  if (/france|paris|lyon|marseille/.test(loc)) return 68;
  if (/kenya|nairobi|mombasa/.test(loc)) return 55;
  if (/south africa|johannesburg|cape town|durban/.test(loc)) return 60;
  if (/colombia|bogot[aá]|medellin/.test(loc)) return 51;
  if (/argentina|buenos aires|c[oó]rdoba/.test(loc)) return 45;
  if (/ukraine|kyiv|kharkiv/.test(loc)) return 43;
  if (/canada|toronto|vancouver|montreal/.test(loc)) return 38;
  if (/saudi|riyadh|jeddah|mecca/.test(loc)) return 35;
  if (/australia|sydney|melbourne|brisbane/.test(loc)) return 26;
  if (/uae|dubai|abu dhabi/.test(loc)) return 10;
  if (/sweden|stockholm/.test(loc)) return 10;
  if (/israel|tel aviv|jerusalem/.test(loc)) return 9;
  if (/singapore/.test(loc)) return 6;
  if (/new zealand|auckland|wellington/.test(loc)) return 5;
  if (/norway|oslo/.test(loc)) return 5;
  return 40; // conservative default
}

function calcPopulationWeightedSentiment(agents: AgentResult[]): { positive: number; neutral: number; negative: number } {
  if (!agents.length) return { positive: 0, neutral: 0, negative: 0 };
  let total = 0, pos = 0, neu = 0, neg = 0;
  for (const a of agents) {
    const w = getRegionPopulation(a.location);
    total += w;
    if (a.sentiment === "positive") pos += w;
    else if (a.sentiment === "neutral") neu += w;
    else neg += w;
  }
  if (!total) return { positive: 0, neutral: 0, negative: 0 };
  return {
    positive: Math.round((pos / total) * 100),
    neutral: Math.round((neu / total) * 100),
    negative: Math.round((neg / total) * 100),
  };
}

// ─── Self-Learning Historical Intelligence ───────────────────────────────────
async function fetchHistoricalIntelligence(type: string): Promise<{ context: string; count: number }> {
  try {
    const db = createServiceClient();
    const { data } = await db
      .from("simulations")
      .select("result")
      .eq("type", type)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!data || !data.length) return { context: "", count: 0 };

    const insights = data
      .map((s: { result: Record<string, unknown> }, i: number) => {
        const r = s.result;
        const score = r?.confidenceScore ?? "?";
        const label = r?.confidenceLabel ?? "";
        const pred = String(r?.prediction ?? "").slice(0, 160);
        const popSent = r?.populationWeightedSentiment as { positive?: number; negative?: number } | undefined;
        const popLine = popSent ? ` | Pop-weighted: +${popSent.positive}% -${popSent.negative}%` : "";
        return `[Archive ${i + 1}] ${label} ${score}%${popLine} — ${pred}`;
      })
      .join("\n");

    return {
      context: `\n\nHISTORICAL INTELLIGENCE ARCHIVE — ${data.length} prior ${type} simulations accumulated in memory:\n${insights}\n\nUse these prior findings to identify patterns, calibrate confidence, and build on accumulated knowledge. If patterns repeat, increase confidence. If contradictions exist, note them.`,
      count: data.length,
    };
  } catch {
    return { context: "", count: 0 };
  }
}

// ─── Scenario Text Builders ───────────────────────────────────────────────────
function buildScenarioText(type: string, data: Record<string, FormValue>): string {
  switch (type) {
    case "public-reaction":
      return `PUBLIC REACTION SIMULATION\n\nSUBJECT: ${fv(data.subjectName)} (${fv(data.subjectType)}, ${fv(data.industry)})\nCURRENT PERCEPTION: ${fv(data.currentPerception)}\nAUDIENCE REACH: ${fv(data.subjectReach)}\n\nINCIDENT: ${fv(data.eventDescription)}\nTYPE: ${fv(data.incidentType)} | REVEALED VIA: ${fv(data.revelationMethod)}\nEXPECTED COVERAGE: ${fv(data.mediaCoverage)}\n\nBACKGROUND: ${fv(data.backgroundContext)}\nPATTERN: ${fv(data.patternStatus)}\nPLANNED RESPONSE: ${fv(data.plannedResponse)}\n\nTARGET REGIONS: ${fv(data.targetRegions)}\nPRIMARY QUESTION: ${fv(data.primaryQuestion)}\nTIMEFRAME: ${fv(data.timeframe)}`;
    case "election":
      return `ELECTION SIMULATION\n\nELECTION: ${fv(data.electionName)} (${fv(data.electionType)}) in ${fv(data.country)}\nSYSTEM: ${fv(data.electionSystem)}\n\nCANDIDATES:\n${fv(data.candidates)}\nLEADING: ${fv(data.leadingCandidate)} | TRAILING: ${fv(data.trailingCandidate)}\nWILD CARD: ${fv(data.wildCardCandidate)} | INCUMBENT: ${fv(data.incumbentStatus)}\n\nMAJOR ISSUES: ${fv(data.majorIssues)}\nPOLITICAL CLIMATE: ${fv(data.politicalClimate)}\nCURRENT POLLING: ${fv(data.currentPolling)}\n\nKEY VOTER BLOCS: ${fv(data.voterDemographics)}\nECONOMIC CONDITIONS: ${fv(data.economicConditions)}\nSCANDALS: ${fv(data.scandals)}`;
    case "markets":
      return `MARKET MOVEMENT SIMULATION\n\nSCENARIO: ${fv(data.marketScenario)}\nASSET CLASSES: ${fv(data.assetClass)}\nSPECIFIC ASSETS: ${fv(data.specificAssets)}\n\nTRIGGER EVENT: ${fv(data.triggerEvent)}\n\nCURRENT MARKET STATE: ${fv(data.currentMarketState)}\nECONOMIC ENVIRONMENT: ${fv(data.economicContext)}\nCENTRAL BANK: ${fv(data.centralBankStance)}\nINFLATION: ${fv(data.inflationRate)}\nGEOPOLITICAL RISKS: ${fv(data.geopoliticalFactors)}\n\nINVESTOR SENTIMENT: ${fv(data.investorSentiment)}\nTIMEFRAME: ${fv(data.timeframe)}`;
    case "sports":
      return `SPORTS MATCH SIMULATION\n\nEVENT: ${fv(data.eventName)} (${fv(data.sport)})\nCOMPETITION: ${fv(data.competition)} | VENUE: ${fv(data.venue)}\n\nTEAM A: ${fv(data.teamA)}\nFORM: ${fv(data.teamAForm)} | RECORD: ${fv(data.teamARecord)}\nKEY PLAYERS: ${fv(data.teamAKeyPlayers)}\nSTRENGTHS: ${fv(data.teamAStrengths)}\n\nTEAM B: ${fv(data.teamB)}\nFORM: ${fv(data.teamBForm)} | RECORD: ${fv(data.teamBRecord)}\nKEY PLAYERS: ${fv(data.teamBKeyPlayers)}\nSTRENGTHS: ${fv(data.teamBStrengths)}\n\nHEAD-TO-HEAD: ${fv(data.headToHead)}\nCURRENT ODDS: ${fv(data.currentOdds)}\nINJURIES: ${fv(data.injuries)}\nPRESSURE: ${fv(data.pressureLevel)}`;
    case "policy":
      return `POLICY IMPACT SIMULATION\n\nPOLICY: ${fv(data.policyName)} (${fv(data.policyType)})\nISSUED BY: ${fv(data.issuingBody)} | SCOPE: ${fv(data.jurisdiction)}\n\nDESCRIPTION: ${fv(data.policyDescription)}\nKEY PROVISIONS: ${fv(data.keyProvisions)}\nAFFECTED SECTORS: ${fv(data.affectedSectors)}\n\nPOLITICAL CONTEXT: ${fv(data.politicalContext)}\nOPPOSITION: ${fv(data.opposition)}\nSUPPORT: ${fv(data.support)}\n\nTARGET REGIONS: ${fv(data.targetRegions)}\nTIMEFRAME: ${fv(data.timeframe)}`;
    case "product-launch":
      return `PRODUCT LAUNCH SIMULATION\n\nPRODUCT: ${fv(data.productName)} by ${fv(data.companyName)}\nCATEGORY: ${fv(data.productCategory)} | PRICE: ${fv(data.pricePoint)}\n\nDESCRIPTION: ${fv(data.productDescription)}\nUNIQUE VALUE PROP: ${fv(data.uniqueValueProp)}\nTARGET CUSTOMER: ${fv(data.targetCustomer)}\n\nCOMPETITION: ${fv(data.competition)}\nLAUNCH MARKETS: ${fv(data.launchMarkets)}\nMARKETING BUDGET: ${fv(data.marketingBudget)}\nTARGET DEMOGRAPHICS: ${fv(data.targetDemographics)}`;
    case "geopolitical":
      return `GEOPOLITICAL EVENT SIMULATION\n\nEVENT: ${fv(data.eventName)} (${fv(data.eventType)})\nPARTIES INVOLVED: ${fv(data.involvedParties)}\nGEOGRAPHIC SCOPE: ${fv(data.geographicScope)}\n\nTRIGGER: ${fv(data.trigger)}\nIMMEDIATE ACTIONS: ${fv(data.immediateActions)}\nINITIAL INTERNATIONAL REACTION: ${fv(data.internationalReaction)}\n\nHISTORICAL CONTEXT: ${fv(data.historicalContext)}\nCURRENT TENSIONS: ${fv(data.currentTensions)}\nECONOMIC STAKES: ${fv(data.economicStakes)}\nESCALATION RISK: ${fv(data.escalationRisk)}\n\nTIMEFRAME: ${fv(data.timeframe)}`;
    default:
      return `CUSTOM SIMULATION\n\nSCENARIO: ${fv(data.scenarioTitle)} (${fv(data.scenarioCategory)})\nGEOGRAPHIC SCOPE: ${fv(data.geographicScope)}\n\nFULL DESCRIPTION: ${fv(data.scenarioDescription)}\nKEY ENTITIES: ${fv(data.keyEntities)}\nSTAKEHOLDERS: ${fv(data.stakeholders)}\n\nCONTEXT: ${fv(data.context)}\nOUTCOME QUESTION: ${fv(data.outcomeQuestion)}\nTIMEFRAME: ${fv(data.timeframe)}`;
  }
}

// ─── Agent Runner ─────────────────────────────────────────────────────────────
async function runAgent(agent: AgentProfile, scenarioText: string): Promise<AgentResult> {
  const systemPrompt = `You are ${agent.name}, ${agent.age} years old, ${agent.occupation} from ${agent.location}.\nPolitical leaning: ${agent.politicalLeaning}\nEconomic status: ${agent.economicStatus}\nMedia diet: ${agent.mediaDiet}\nValues: ${agent.values.join(", ")}\nDisposition: ${agent.disposition}\n\nRespond authentically as this exact person.`;

  const userMessage = `Scenario:\n\n${scenarioText}\n\nAs ${agent.name}, respond authentically. Return ONLY valid JSON:\n{\n  "sentiment": "positive" or "negative" or "neutral",\n  "intensity": <1-10>,\n  "reaction": "<2-3 sentence first-person reaction>",\n  "likelyAction": "<one specific action you would take>"\n}`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
      max_tokens: 300,
      temperature: 0.85,
    }),
  });

  if (!resp.ok) throw new Error(`Agent error ${resp.status}`);

  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message?.content?.trim() || "";

  const base = {
    agentId: agent.id, agentName: agent.name, location: agent.location,
    age: agent.age, occupation: agent.occupation, politicalLeaning: agent.politicalLeaning,
    economicStatus: agent.economicStatus, mediaDiet: agent.mediaDiet, values: agent.values,
  };

  try {
    const match = content.match(/\{[\s\S]*\}/);
    const p = JSON.parse(match?.[0] || content) as { sentiment?: string; intensity?: number | string; reaction?: string; likelyAction?: string };
    return {
      ...base,
      sentiment: (["positive", "negative", "neutral"].includes(p.sentiment || "") ? p.sentiment : "neutral") as AgentResult["sentiment"],
      intensity: Math.min(10, Math.max(1, Number(p.intensity) || 5)),
      reaction: p.reaction || "No reaction generated.",
      likelyAction: p.likelyAction || "Monitor the situation.",
    };
  } catch {
    return { ...base, sentiment: "neutral", intensity: 5, reaction: content.slice(0, 300) || "Unable to generate.", likelyAction: "Monitor the situation." };
  }
}

async function runAgentBatch(agents: AgentProfile[], scenarioText: string): Promise<AgentResult[]> {
  const results: AgentResult[] = [];
  const batchSize = 5;
  for (let i = 0; i < agents.length; i += batchSize) {
    const settled = await Promise.allSettled(agents.slice(i, i + batchSize).map((a) => runAgent(a, scenarioText)));
    for (const r of settled) { if (r.status === "fulfilled") results.push(r.value); }
    if (i + batchSize < agents.length) await new Promise((res) => setTimeout(res, 150));
  }
  return results;
}

// ─── Master Synthesis ─────────────────────────────────────────────────────────
async function generateFinalPrediction(
  type: string,
  scenarioText: string,
  agentResults: AgentResult[],
  sentimentData: { positive: number; negative: number; neutral: number },
  populationWeightedSentiment: { positive: number; neutral: number; negative: number },
  historicalContext: string
) {
  const agentSummary = agentResults
    .map((a) => `${a.agentName} (${a.location}, ${a.politicalLeaning}, pop:${getRegionPopulation(a.location)}M, ${a.sentiment} ${a.intensity}/10): ${a.reaction.slice(0, 110)} → ${a.likelyAction.slice(0, 55)}`)
    .join("\n");

  const totalRepresentedPop = agentResults.reduce((s, a) => s + getRegionPopulation(a.location), 0);

  const prompt = `You are OMNISIM — the world's most advanced real-time geopolitical and scenario intelligence system. You learn from every simulation and accumulate understanding across all prior runs.

SCENARIO TYPE: ${type.toUpperCase()}
WORLD POPULATION: 8.1 billion humans
AGENT SAMPLE: ${agentResults.length} agents representing ~${totalRepresentedPop}M people
RAW AGENT SENTIMENT: ${sentimentData.positive}% positive | ${sentimentData.neutral}% neutral | ${sentimentData.negative}% negative
POPULATION-WEIGHTED GLOBAL SENTIMENT: ${populationWeightedSentiment.positive}% positive | ${populationWeightedSentiment.neutral}% neutral | ${populationWeightedSentiment.negative}% negative
(Population-weighted sentiment reflects actual scale of human populations represented by each agent's region)

SCENARIO:
${scenarioText.slice(0, 900)}

AGENT REACTIONS WITH POPULATION WEIGHTS:
${agentSummary}${historicalContext}

Synthesize all data — agent reactions, population weights, AND historical archive — into a world-class intelligence brief. Return ONLY valid JSON:
{
  "executiveSummary": "<3 paragraphs separated by \\n\\n. Para 1: what this scenario fundamentally represents and its global stakes at scale of 8.1B humans. Para 2: dominant dynamics and fracture lines revealed by population-weighted agent analysis. Para 3: critical inflection point — what single variable determines the final outcome and why>",
  "prediction": "<5-6 sentence multi-dimensional prediction: primary outcome at global scale, secondary effects, population-level impact, who wins and loses, what signals confirm this trajectory>",
  "confidenceLabel": "HIGH CONFIDENCE" or "MODERATE CONFIDENCE" or "LOW CONFIDENCE" or "VOLATILE — UNPREDICTABLE",
  "confidenceScore": <0-100>,
  "confidenceReasoning": "<2-3 sentences: what specific evidence from agent reactions AND historical archive supports this confidence level, and what uncertainty remains>",
  "scenarioBranches": [
    { "label": "Most Likely", "probability": <40-65>, "description": "<2-3 sentences concrete outcome at population scale>", "trigger": "<what must hold true>" },
    { "label": "Alternative Path", "probability": <20-35>, "description": "<2-3 sentences alternative outcome>", "trigger": "<what catalyst shifts this>" },
    { "label": "Black Swan", "probability": <5-15>, "description": "<2-3 sentences extreme unexpected outcome>", "trigger": "<what shock event produces this>" }
  ],
  "keyFactors": [
    { "factor": "<3-5 word title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences on how this drives outcome at scale>" },
    { "factor": "<title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences>" },
    { "factor": "<title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences>" },
    { "factor": "<title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences>" }
  ],
  "risks": [
    { "risk": "<3-5 word title>", "severity": "critical" or "high" or "medium", "probability": <0-100>, "mitigation": "<specific concrete action>" },
    { "risk": "<title>", "severity": "critical" or "high" or "medium", "probability": <0-100>, "mitigation": "<action>" },
    { "risk": "<title>", "severity": "critical" or "high" or "medium", "probability": <0-100>, "mitigation": "<action>" }
  ],
  "opportunities": [
    { "opportunity": "<3-5 word title>", "potential": "high" or "medium" or "low", "window": "<time window>", "howToCapture": "<specific action>" },
    { "opportunity": "<title>", "potential": "high" or "medium" or "low", "window": "<time window>", "howToCapture": "<action>" },
    { "opportunity": "<title>", "potential": "high" or "medium" or "low", "window": "<time window>", "howToCapture": "<action>" }
  ],
  "strategicActions": [
    "<Action 1: specific directive with clear what/when/who>",
    "<Action 2>",
    "<Action 3>",
    "<Action 4>",
    "<Action 5>"
  ],
  "recommendation": "<3-4 sentence high-level strategic synthesis drawing on accumulated intelligence — the single most important conclusion and what to do about it now>",
  "timeline": [
    { "phase": "Immediate (0–48 hours)", "events": "<2-3 sentences>" },
    { "phase": "Short-Term (1–4 weeks)", "events": "<2-3 sentences>" },
    { "phase": "Medium-Term (1–3 months)", "events": "<2-3 sentences>" },
    { "phase": "Long-Term (3–12 months)", "events": "<2-3 sentences>" }
  ]
}`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Groq synthesis error ${resp.status}: ${errText}`);
  }

  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message?.content?.trim() || "";

  try {
    const match = content.match(/\{[\s\S]*\}/);
    const p = JSON.parse(match?.[0] || content) as {
      executiveSummary?: string; prediction?: string; confidenceLabel?: string;
      confidenceScore?: number; confidenceReasoning?: string;
      scenarioBranches?: unknown[]; keyFactors?: unknown[]; risks?: unknown[];
      opportunities?: unknown[]; strategicActions?: string[]; recommendation?: string; timeline?: unknown[];
    };
    return {
      executiveSummary: p.executiveSummary || "",
      prediction: p.prediction || "Simulation complete.",
      confidenceLabel: p.confidenceLabel || "MODERATE CONFIDENCE",
      confidenceScore: Math.min(100, Math.max(0, Number(p.confidenceScore) || 65)),
      confidenceReasoning: p.confidenceReasoning || "",
      scenarioBranches: Array.isArray(p.scenarioBranches) ? p.scenarioBranches : [],
      keyFactors: Array.isArray(p.keyFactors) ? p.keyFactors : ["Multiple factors identified"],
      risks: Array.isArray(p.risks) ? p.risks : ["Monitor situation closely"],
      opportunities: Array.isArray(p.opportunities) ? p.opportunities : ["Strategic positioning available"],
      strategicActions: Array.isArray(p.strategicActions) ? p.strategicActions : [],
      recommendation: p.recommendation || "Review agent reactions for detailed insights.",
      timeline: Array.isArray(p.timeline) ? p.timeline : [],
    };
  } catch {
    return {
      executiveSummary: "", prediction: content.slice(0, 500) || "Analysis complete.",
      confidenceLabel: "MODERATE CONFIDENCE", confidenceScore: 65, confidenceReasoning: "",
      scenarioBranches: [], keyFactors: ["Review agent reactions"], risks: ["Monitor closely"],
      opportunities: ["Detailed breakdown in agent tab"], strategicActions: [],
      recommendation: "Review the agent reactions tab for specific insights.", timeline: [],
    };
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type?: string; data?: Record<string, FormValue> };
    const { type, data } = body;
    if (!type || !data) return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });

    // Fetch historical intelligence in parallel with scenario prep
    const [historicalIntel, agents] = await Promise.all([
      fetchHistoricalIntelligence(type),
      Promise.resolve(selectAgentsForSimulation(type, 20)),
    ]);

    const scenarioText = buildScenarioText(type, data);
    const agentResults = await runAgentBatch(agents, scenarioText);

    const total = agentResults.length || 1;
    const sentimentData = {
      positive: Math.round((agentResults.filter((a) => a.sentiment === "positive").length / total) * 100),
      negative: Math.round((agentResults.filter((a) => a.sentiment === "negative").length / total) * 100),
      neutral: Math.round((agentResults.filter((a) => a.sentiment === "neutral").length / total) * 100),
    };

    const populationWeightedSentiment = calcPopulationWeightedSentiment(agentResults);

    const prediction = await generateFinalPrediction(
      type, scenarioText, agentResults, sentimentData, populationWeightedSentiment, historicalIntel.context
    );

    const id = crypto.randomUUID();
    const simulationResult = {
      id, type, ...prediction, sentimentData, populationWeightedSentiment,
      historicalIntelligenceUsed: historicalIntel.count,
      agentResults, createdAt: new Date().toISOString(),
    };

    try {
      const db = createServiceClient();
      await db.from("simulations").insert({ id, type, scenario_data: data, result: simulationResult, status: "complete" });
    } catch (dbErr) {
      console.error("Supabase store error:", dbErr);
    }

    return NextResponse.json(simulationResult);
  } catch (err) {
    console.error("Simulation error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Simulation failed" }, { status: 500 });
  }
}
