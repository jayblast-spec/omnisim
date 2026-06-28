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

export interface SpecialistResult {
  specialistId: string;
  name: string;
  domain: string;
  color: string;
  analysis: string;
  keyInsight: string;
  riskFlag: string;
  opportunityFlag: string;
  confidenceModifier: number;
}

export interface CascadeEffect {
  step: number;
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  domain: string;
}

export interface CounterIntelligence {
  challenges: string[];
  missedFactor: string;
  flipScenario: string;
}

type FormValue = string | string[];

function fv(val: FormValue | undefined): string {
  if (!val) return "Not specified";
  return Array.isArray(val) ? val.join(", ") : val;
}

// ─── Population Intelligence Layer ───────────────────────────────────────────
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
  return 40;
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

// ─── Elite Specialist Domain Agents ──────────────────────────────────────────
const SPECIALISTS = [
  {
    id: "economist",
    name: "Dr. Elena Voss",
    domain: "Global Economics & Market Dynamics",
    color: "#00F5FF",
    systemPrompt: `You are Dr. Elena Voss, Chief Economist at the World Economic Intelligence Institute. You have 25 years analyzing global macroeconomic patterns, market cascades, currency dynamics, and supply chain disruptions. You think in GDP multipliers, velocity of money, behavioral economics at scale, and second-order market effects. You have advised 14 heads of state and 3 IMF directors. Your analysis cuts through noise to find the economic truth that others miss.`,
  },
  {
    id: "geopolitical",
    name: "General Marcus Chen",
    domain: "Geopolitical Strategy & Power Dynamics",
    color: "#BF00FF",
    systemPrompt: `You are General Marcus Chen, former Deputy Director of Strategic Intelligence at a major Western alliance. You have 30 years analyzing power structures, alliance dynamics, military posturing, and geopolitical game theory. You think in leverage points, red lines, deterrence theory, and multi-actor strategic calculations. You see the moves that others miss — hidden alliances, strategic feints, real motivations beneath public statements.`,
  },
  {
    id: "sociologist",
    name: "Dr. Amara Osei",
    domain: "Social Dynamics & Mass Behavior",
    color: "#00FF7F",
    systemPrompt: `You are Dr. Amara Osei, Director of Global Social Dynamics Research at Cambridge. You have 20 years studying mass psychology, social movements, polarization dynamics, and collective behavior at scale. You understand how information spreads through social networks, how sentiment becomes action, and how populations fracture or cohere under pressure. You have predicted 3 major social upheavals before they happened by reading signal patterns others missed.`,
  },
  {
    id: "media",
    name: "Alexandra Pierce",
    domain: "Media Intelligence & Narrative Control",
    color: "#FFD700",
    systemPrompt: `You are Alexandra Pierce, former head of Strategic Communications at a G7 intelligence agency. You have 18 years analyzing how narratives form, spread, mutate, and collapse in the global information ecosystem. You understand media cycles, manufactured consent, information warfare, social media amplification dynamics, and how narrative control shapes reality perception at population scale.`,
  },
  {
    id: "blackswan",
    name: "Dr. Viktor Kazakov",
    domain: "Black Swan Risk & Systemic Fragility",
    color: "#FF0077",
    systemPrompt: `You are Dr. Viktor Kazakov, founder of the Global Tail Risk Institute. You specialize in identifying hidden systemic fragilities, non-linear cascade risks, and tail-event probability in complex adaptive systems. You think in system fragility maps, correlation breakdown scenarios, and the specific conditions under which unlikely events become inevitable. Your job is to find what everyone else is missing.`,
  },
] as const;

async function runSpecialist(specialist: (typeof SPECIALISTS)[number], scenarioText: string): Promise<SpecialistResult> {
  const userMessage = `SCENARIO:\n${scenarioText.slice(0, 800)}\n\nAnalyze this scenario exclusively through your domain expertise. Return ONLY valid JSON:\n{\n  "analysis": "<3-4 sentence deep-domain analysis from your unique lens>",\n  "keyInsight": "<1 sentence — the single most important insight only your domain reveals>",\n  "riskFlag": "<1 sentence — primary risk you see that others would miss>",\n  "opportunityFlag": "<1 sentence — primary opportunity you see that others would miss>",\n  "confidenceModifier": <integer -15 to +15 — how much does your domain analysis shift overall prediction confidence>\n}`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: specialist.systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.72,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) throw new Error(`Specialist ${specialist.id} error ${resp.status}`);
  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message?.content?.trim() || "{}";

  try {
    const p = JSON.parse(content) as {
      analysis?: string; keyInsight?: string; riskFlag?: string;
      opportunityFlag?: string; confidenceModifier?: number;
    };
    return {
      specialistId: specialist.id, name: specialist.name, domain: specialist.domain, color: specialist.color,
      analysis: p.analysis || "Domain analysis complete.",
      keyInsight: p.keyInsight || "Key signals identified.",
      riskFlag: p.riskFlag || "Risks logged.",
      opportunityFlag: p.opportunityFlag || "Opportunities noted.",
      confidenceModifier: Math.min(15, Math.max(-15, Number(p.confidenceModifier) || 0)),
    };
  } catch {
    return {
      specialistId: specialist.id, name: specialist.name, domain: specialist.domain, color: specialist.color,
      analysis: "Domain analysis complete.", keyInsight: "Key signals identified.",
      riskFlag: "Risks logged.", opportunityFlag: "Opportunities noted.", confidenceModifier: 0,
    };
  }
}

async function runSpecialistBatch(scenarioText: string): Promise<SpecialistResult[]> {
  const results = await Promise.allSettled(SPECIALISTS.map((s) => runSpecialist(s, scenarioText)));
  return results
    .filter((r): r is PromiseFulfilledResult<SpecialistResult> => r.status === "fulfilled")
    .map((r) => r.value);
}

// ─── Mathematical Confidence Calibration ─────────────────────────────────────
function calcMathematicalConfidence(
  agentResults: AgentResult[],
  specialistResults: SpecialistResult[],
  baseScore: number
): number {
  if (!agentResults.length) return baseScore;

  // Std deviation of agent intensities — low stdDev = high consensus = confidence bonus
  const intensities = agentResults.map((a) => a.intensity);
  const mean = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  const variance = intensities.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / intensities.length;
  const stdDev = Math.sqrt(variance);
  const consensusBonus = stdDev < 1.5 ? 8 : stdDev < 2.5 ? 4 : stdDev < 3.5 ? 0 : -6;

  // Sentiment dominance bonus
  const total = agentResults.length;
  const posRatio = agentResults.filter((a) => a.sentiment === "positive").length / total;
  const negRatio = agentResults.filter((a) => a.sentiment === "negative").length / total;
  const dominance = Math.max(posRatio, negRatio);
  const dominanceBonus = dominance > 0.75 ? 7 : dominance > 0.6 ? 4 : dominance > 0.5 ? 1 : -3;

  // Specialist modifier (sum of all, capped)
  const specialistModifier = Math.min(15, Math.max(-15,
    specialistResults.reduce((s, r) => s + r.confidenceModifier, 0)
  ));

  return Math.min(98, Math.max(12, Math.round(baseScore + consensusBonus + dominanceBonus + specialistModifier)));
}

// ─── Counter-Intelligence Layer ───────────────────────────────────────────────
async function runCounterIntelligence(
  scenarioText: string,
  prediction: string,
  confidenceLabel: string
): Promise<CounterIntelligence> {
  const prompt = `You are the Devil's Advocate — a contrarian intelligence analyst whose sole purpose is to challenge the main prediction and expose its fatal flaws. Be specific and surgically critical.

MAIN PREDICTION: ${prediction.slice(0, 400)}
CONFIDENCE LEVEL: ${confidenceLabel}
SCENARIO: ${scenarioText.slice(0, 400)}

Return ONLY valid JSON:
{
  "challenges": [
    "<Challenge 1: specific flaw in the main prediction's core assumption>",
    "<Challenge 2: contrary evidence or dynamic that was underweighted>",
    "<Challenge 3: alternative interpretation of the same data that leads to the opposite conclusion>"
  ],
  "missedFactor": "<The single most important variable the main analysis completely missed or ignored>",
  "flipScenario": "<2-3 sentences: the world where this prediction is completely wrong — what does it look like and what caused it>"
}`;

  try {
    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.82,
        response_format: { type: "json_object" },
      }),
    });
    if (!resp.ok) throw new Error("Counter-intel call failed");
    const data = (await resp.json()) as { choices: { message: { content: string } }[] };
    const p = JSON.parse(data.choices[0]?.message?.content?.trim() || "{}") as {
      challenges?: string[]; missedFactor?: string; flipScenario?: string;
    };
    return {
      challenges: Array.isArray(p.challenges) ? p.challenges.slice(0, 3) : ["Core assumptions require additional scrutiny."],
      missedFactor: p.missedFactor || "Structural tail risks may be underweighted.",
      flipScenario: p.flipScenario || "Alternative trajectories cannot be ruled out without further data.",
    };
  } catch {
    return {
      challenges: [
        "Core assumptions may not hold under sustained pressure.",
        "Counter-signals exist in the population data that deserve deeper investigation.",
        "Historical precedent suggests this trajectory has been challenged before.",
      ],
      missedFactor: "Systemic fragility and second-order cascade effects may be underweighted.",
      flipScenario: "If key assumptions break down, the opposite outcome becomes more probable than the model suggests. Monitor leading indicators carefully.",
    };
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
  specialistResults: SpecialistResult[],
  sentimentData: { positive: number; negative: number; neutral: number },
  populationWeightedSentiment: { positive: number; neutral: number; negative: number },
  historicalContext: string
) {
  const agentSummary = agentResults
    .map((a) => `${a.agentName} (${a.location}, ${a.politicalLeaning}, pop:${getRegionPopulation(a.location)}M, ${a.sentiment} ${a.intensity}/10): ${a.reaction.slice(0, 110)} → ${a.likelyAction.slice(0, 55)}`)
    .join("\n");

  const totalRepresentedPop = agentResults.reduce((s, a) => s + getRegionPopulation(a.location), 0);

  const specialistSummary = specialistResults
    .map((s) => `[${s.name} | ${s.domain}] ${s.analysis} KEY INSIGHT: ${s.keyInsight} RISK: ${s.riskFlag} OPP: ${s.opportunityFlag} ConfMod: ${s.confidenceModifier >= 0 ? "+" : ""}${s.confidenceModifier}`)
    .join("\n");

  const totalSpecialistMod = specialistResults.reduce((s, r) => s + r.confidenceModifier, 0);

  const prompt = `You are OMNISIM — the world's most advanced real-time geopolitical and scenario intelligence system. You learn from every simulation, accumulate cross-domain expertise, and synthesize intelligence at a level no single human analyst can match.

SCENARIO TYPE: ${type.toUpperCase()}
WORLD POPULATION: 8.1 billion humans
AGENT SAMPLE: ${agentResults.length} agents representing ~${totalRepresentedPop}M people
RAW AGENT SENTIMENT: ${sentimentData.positive}% positive | ${sentimentData.neutral}% neutral | ${sentimentData.negative}% negative
POPULATION-WEIGHTED GLOBAL SENTIMENT: ${populationWeightedSentiment.positive}% positive | ${populationWeightedSentiment.neutral}% neutral | ${populationWeightedSentiment.negative}% negative

SCENARIO:
${scenarioText.slice(0, 800)}

FIELD AGENT REACTIONS WITH POPULATION WEIGHTS:
${agentSummary}${historicalContext}

ELITE SPECIALIST PANEL (5 domain experts — integrate their analysis into synthesis):
${specialistSummary}
(Combined specialist confidence modifier: ${totalSpecialistMod >= 0 ? "+" : ""}${totalSpecialistMod})

Synthesize all data — agent reactions, population weights, specialist domain analysis, AND historical archive — into a world-class multi-layer intelligence brief. Return ONLY valid JSON:
{
  "executiveSummary": "<3 paragraphs separated by \\n\\n. Para 1: what this scenario fundamentally represents and its global stakes. Para 2: dominant dynamics and fracture lines revealed by population-weighted agent analysis integrated with specialist domain insights. Para 3: the critical inflection point — what single variable determines the final outcome, and why each specialist domain converges or diverges on this>",
  "prediction": "<5-6 sentence multi-dimensional prediction: primary outcome at global scale, secondary effects, population-level impact, who wins and loses, what signals confirm this trajectory>",
  "confidenceLabel": "HIGH CONFIDENCE" or "MODERATE CONFIDENCE" or "LOW CONFIDENCE" or "VOLATILE — UNPREDICTABLE",
  "confidenceScore": <0-100>,
  "confidenceReasoning": "<2-3 sentences: what specific evidence from agents AND specialists supports this confidence level, and what uncertainty remains>",
  "cascadeEffects": [
    { "step": 1, "title": "<2-4 word title>", "description": "<1-2 sentences — 1st order direct effect>", "probability": <0-100>, "timeframe": "<e.g. 48 hours>", "domain": "<economic|political|social|military|media>" },
    { "step": 2, "title": "<2-4 word title>", "description": "<1-2 sentences — 2nd order effect caused by step 1>", "probability": <0-100>, "timeframe": "<e.g. 2 weeks>", "domain": "<domain>" },
    { "step": 3, "title": "<2-4 word title>", "description": "<1-2 sentences — 3rd order effect caused by step 2>", "probability": <0-100>, "timeframe": "<e.g. 3 months>", "domain": "<domain>" }
  ],
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
  "recommendation": "<3-4 sentence high-level strategic synthesis drawing on all specialist domains and accumulated intelligence — the single most important conclusion and what to do about it now>",
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
      max_tokens: 2500,
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
      cascadeEffects?: unknown[];
      scenarioBranches?: unknown[]; keyFactors?: unknown[]; risks?: unknown[];
      opportunities?: unknown[]; strategicActions?: string[]; recommendation?: string; timeline?: unknown[];
    };
    return {
      executiveSummary: p.executiveSummary || "",
      prediction: p.prediction || "Simulation complete.",
      confidenceLabel: p.confidenceLabel || "MODERATE CONFIDENCE",
      confidenceScore: Math.min(100, Math.max(0, Number(p.confidenceScore) || 65)),
      confidenceReasoning: p.confidenceReasoning || "",
      cascadeEffects: Array.isArray(p.cascadeEffects) ? p.cascadeEffects : [],
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
      cascadeEffects: [],
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

    // Parallel: fetch history + select agents
    const [historicalIntel, agents] = await Promise.all([
      fetchHistoricalIntelligence(type),
      Promise.resolve(selectAgentsForSimulation(type, 20)),
    ]);

    const scenarioText = buildScenarioText(type, data);

    // Parallel: run field agents + specialist panel simultaneously
    const [agentResults, specialistResults] = await Promise.all([
      runAgentBatch(agents, scenarioText),
      runSpecialistBatch(scenarioText),
    ]);

    const total = agentResults.length || 1;
    const sentimentData = {
      positive: Math.round((agentResults.filter((a) => a.sentiment === "positive").length / total) * 100),
      negative: Math.round((agentResults.filter((a) => a.sentiment === "negative").length / total) * 100),
      neutral: Math.round((agentResults.filter((a) => a.sentiment === "neutral").length / total) * 100),
    };

    const populationWeightedSentiment = calcPopulationWeightedSentiment(agentResults);

    // Master synthesis (includes cascade effects)
    const prediction = await generateFinalPrediction(
      type, scenarioText, agentResults, specialistResults, sentimentData, populationWeightedSentiment, historicalIntel.context
    );

    // Mathematical confidence calibration (overrides LLM base score)
    const calibratedConfidence = calcMathematicalConfidence(agentResults, specialistResults, prediction.confidenceScore);

    // Counter-intelligence layer (Devil's Advocate)
    const counterIntelligence = await runCounterIntelligence(scenarioText, prediction.prediction, prediction.confidenceLabel);

    const id = crypto.randomUUID();
    const simulationResult = {
      id, type, ...prediction,
      confidenceScore: calibratedConfidence,
      sentimentData, populationWeightedSentiment,
      historicalIntelligenceUsed: historicalIntel.count,
      specialistResults,
      counterIntelligence,
      agentResults,
      createdAt: new Date().toISOString(),
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
