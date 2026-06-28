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

async function runAgent(agent: AgentProfile, scenarioText: string): Promise<AgentResult> {
  const systemPrompt = `You are ${agent.name}, ${agent.age} years old, ${agent.occupation} from ${agent.location}.\nPolitical leaning: ${agent.politicalLeaning}\nEconomic status: ${agent.economicStatus}\nMedia diet: ${agent.mediaDiet}\nValues: ${agent.values.join(", ")}\nDisposition: ${agent.disposition}\n\nRespond authentically as this exact person. React based on your specific background, worldview, and values.`;

  const userMessage = `You have just heard about the following scenario:\n\n${scenarioText}\n\nAs ${agent.name}, how do you genuinely react?\n\nReturn ONLY valid JSON:\n{\n  "sentiment": "positive" or "negative" or "neutral",\n  "intensity": <number 1-10>,\n  "reaction": "<2-3 sentence authentic first-person reaction>",\n  "likelyAction": "<one specific action this person would take>"\n}`;

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

  if (!resp.ok) throw new Error(`Groq agent error ${resp.status}`);

  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message?.content?.trim() || "";

  const baseProfile = {
    agentId: agent.id,
    agentName: agent.name,
    location: agent.location,
    age: agent.age,
    occupation: agent.occupation,
    politicalLeaning: agent.politicalLeaning,
    economicStatus: agent.economicStatus,
    mediaDiet: agent.mediaDiet,
    values: agent.values,
  };

  try {
    const match = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] || content) as {
      sentiment?: string; intensity?: number | string; reaction?: string; likelyAction?: string;
    };
    return {
      ...baseProfile,
      sentiment: (["positive", "negative", "neutral"].includes(parsed.sentiment || "") ? parsed.sentiment : "neutral") as AgentResult["sentiment"],
      intensity: Math.min(10, Math.max(1, Number(parsed.intensity) || 5)),
      reaction: parsed.reaction || "No reaction generated.",
      likelyAction: parsed.likelyAction || "Monitor the situation.",
    };
  } catch {
    return {
      ...baseProfile,
      sentiment: "neutral",
      intensity: 5,
      reaction: content.slice(0, 300) || "Unable to generate reaction.",
      likelyAction: "Monitor the situation.",
    };
  }
}

async function runAgentBatch(agents: AgentProfile[], scenarioText: string): Promise<AgentResult[]> {
  const results: AgentResult[] = [];
  const batchSize = 5;
  for (let i = 0; i < agents.length; i += batchSize) {
    const batch = agents.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map((a) => runAgent(a, scenarioText)));
    for (const r of settled) { if (r.status === "fulfilled") results.push(r.value); }
    if (i + batchSize < agents.length) await new Promise((res) => setTimeout(res, 150));
  }
  return results;
}

async function generateFinalPrediction(
  type: string,
  scenarioText: string,
  agentResults: AgentResult[],
  sentimentData: { positive: number; negative: number; neutral: number }
) {
  const agentSummary = agentResults
    .map((a) => `${a.agentName} (${a.location}, ${a.politicalLeaning}, ${a.sentiment} ${a.intensity}/10): ${a.reaction.slice(0, 110)} → ${a.likelyAction.slice(0, 55)}`)
    .join("\n");

  const prompt = `You are OMNISIM — the world's most advanced geopolitical and scenario intelligence system. ${agentResults.length} diverse global agents from different nations, demographics, and worldviews have reacted to this scenario.

SCENARIO TYPE: ${type.toUpperCase()}
GLOBAL SENTIMENT: ${sentimentData.positive}% positive | ${sentimentData.neutral}% neutral | ${sentimentData.negative}% negative

SCENARIO:
${scenarioText.slice(0, 900)}

AGENT REACTIONS (${agentResults.length} agents):
${agentSummary}

Synthesize all agent reactions and scenario data into a world-class intelligence brief. Return ONLY valid JSON:
{
  "executiveSummary": "<3 paragraphs separated by \\n\\n. Para 1: what this scenario fundamentally represents and its global stakes. Para 2: the dominant dynamics and fracture lines revealed by agent reactions. Para 3: the critical inflection point — what variable determines the final outcome>",
  "prediction": "<5-6 sentence multi-dimensional prediction: primary outcome, secondary effects, who wins and who loses, regional variations, and what signals to watch for confirmation>",
  "confidenceLabel": "HIGH CONFIDENCE" or "MODERATE CONFIDENCE" or "LOW CONFIDENCE" or "VOLATILE — UNPREDICTABLE",
  "confidenceScore": <0-100>,
  "confidenceReasoning": "<2-3 sentences: what specific evidence supports this confidence level and what introduces the remaining uncertainty>",
  "scenarioBranches": [
    { "label": "Most Likely", "probability": <40-65>, "description": "<2-3 sentences concrete outcome>", "trigger": "<what must hold true for this to occur>" },
    { "label": "Alternative Path", "probability": <20-35>, "description": "<2-3 sentences alternative outcome>", "trigger": "<what catalyst shifts the scenario this way>" },
    { "label": "Black Swan", "probability": <5-15>, "description": "<2-3 sentences extreme unexpected outcome>", "trigger": "<what shock event produces this>" }
  ],
  "keyFactors": [
    { "factor": "<3-5 word title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences on how this factor drives the outcome>" },
    { "factor": "<3-5 word title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences>" },
    { "factor": "<3-5 word title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences>" },
    { "factor": "<3-5 word title>", "impact": <1-10>, "probability": <0-100>, "explanation": "<2 sentences>" }
  ],
  "risks": [
    { "risk": "<3-5 word title>", "severity": "critical" or "high" or "medium", "probability": <0-100>, "mitigation": "<specific concrete action to reduce this risk>" },
    { "risk": "<3-5 word title>", "severity": "critical" or "high" or "medium", "probability": <0-100>, "mitigation": "<specific action>" },
    { "risk": "<3-5 word title>", "severity": "critical" or "high" or "medium", "probability": <0-100>, "mitigation": "<specific action>" }
  ],
  "opportunities": [
    { "opportunity": "<3-5 word title>", "potential": "high" or "medium" or "low", "window": "<time window e.g. 30-90 days>", "howToCapture": "<specific action to capitalize>" },
    { "opportunity": "<3-5 word title>", "potential": "high" or "medium" or "low", "window": "<time window>", "howToCapture": "<specific action>" },
    { "opportunity": "<3-5 word title>", "potential": "high" or "medium" or "low", "window": "<time window>", "howToCapture": "<specific action>" }
  ],
  "strategicActions": [
    "<Action 1: specific directive with clear what/when/who>",
    "<Action 2>",
    "<Action 3>",
    "<Action 4>",
    "<Action 5>"
  ],
  "recommendation": "<3-4 sentence high-level strategic synthesis — the single most important conclusion and what to do about it now>",
  "timeline": [
    { "phase": "Immediate (0–48 hours)", "events": "<2-3 sentences on what unfolds in this window>" },
    { "phase": "Short-Term (1–4 weeks)", "events": "<2-3 sentences on what develops>" },
    { "phase": "Medium-Term (1–3 months)", "events": "<2-3 sentences on how the situation evolves>" },
    { "phase": "Long-Term (3–12 months)", "events": "<2-3 sentences on final state and lasting effects>" }
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
    const parsed = JSON.parse(match?.[0] || content) as {
      executiveSummary?: string;
      prediction?: string;
      confidenceLabel?: string;
      confidenceScore?: number;
      confidenceReasoning?: string;
      scenarioBranches?: unknown[];
      keyFactors?: unknown[];
      risks?: unknown[];
      opportunities?: unknown[];
      strategicActions?: string[];
      recommendation?: string;
      timeline?: unknown[];
    };
    return {
      executiveSummary: parsed.executiveSummary || parsed.prediction || "",
      prediction: parsed.prediction || "Simulation complete.",
      confidenceLabel: parsed.confidenceLabel || "MODERATE CONFIDENCE",
      confidenceScore: Math.min(100, Math.max(0, Number(parsed.confidenceScore) || 65)),
      confidenceReasoning: parsed.confidenceReasoning || "",
      scenarioBranches: Array.isArray(parsed.scenarioBranches) ? parsed.scenarioBranches : [],
      keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors : ["Multiple factors identified"],
      risks: Array.isArray(parsed.risks) ? parsed.risks : ["Monitor situation closely"],
      opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : ["Strategic positioning available"],
      strategicActions: Array.isArray(parsed.strategicActions) ? parsed.strategicActions : [],
      recommendation: parsed.recommendation || "Review agent reactions for detailed insights.",
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : [],
    };
  } catch {
    return {
      executiveSummary: "",
      prediction: content.slice(0, 500) || "Analysis complete.",
      confidenceLabel: "MODERATE CONFIDENCE",
      confidenceScore: 65,
      confidenceReasoning: "",
      scenarioBranches: [],
      keyFactors: ["Analysis complete — review agent reactions"],
      risks: ["Review individual agent reactions for risk details"],
      opportunities: ["Detailed breakdown available in agent tab"],
      strategicActions: [],
      recommendation: "Review the agent reactions tab for specific insights.",
      timeline: [],
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type?: string; data?: Record<string, FormValue> };
    const { type, data } = body;
    if (!type || !data) return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });

    const scenarioText = buildScenarioText(type, data);
    const agents = selectAgentsForSimulation(type, 20);
    const agentResults = await runAgentBatch(agents, scenarioText);

    const total = agentResults.length || 1;
    const sentimentData = {
      positive: Math.round((agentResults.filter((a) => a.sentiment === "positive").length / total) * 100),
      negative: Math.round((agentResults.filter((a) => a.sentiment === "negative").length / total) * 100),
      neutral: Math.round((agentResults.filter((a) => a.sentiment === "neutral").length / total) * 100),
    };

    const prediction = await generateFinalPrediction(type, scenarioText, agentResults, sentimentData);

    const id = crypto.randomUUID();
    const simulationResult = { id, type, ...prediction, sentimentData, agentResults, createdAt: new Date().toISOString() };

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
