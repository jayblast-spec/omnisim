import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseClient";
import { selectAgentsForSimulation } from "@/lib/agentProfiles";
import type { AgentProfile } from "@/lib/agentProfiles";

interface AgentResult {
  agentId: string;
  agentName: string;
  location: string;
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
      return `PUBLIC REACTION SIMULATION

SUBJECT: ${fv(data.subjectName)} (${fv(data.subjectType)}, ${fv(data.industry)})
CURRENT PERCEPTION: ${fv(data.currentPerception)}
AUDIENCE REACH: ${fv(data.subjectReach)}

INCIDENT: ${fv(data.eventDescription)}
TYPE: ${fv(data.incidentType)} | REVEALED VIA: ${fv(data.revelationMethod)}
EXPECTED COVERAGE: ${fv(data.mediaCoverage)}

BACKGROUND: ${fv(data.backgroundContext)}
PATTERN: ${fv(data.patternStatus)}
COMPARISON: ${fv(data.comparison)}
PLANNED RESPONSE: ${fv(data.plannedResponse)}

TARGET REGIONS: ${fv(data.targetRegions)}
TARGET DEMOGRAPHICS: ${fv(data.targetDemographics)}
PRIMARY QUESTION: ${fv(data.primaryQuestion)}
TIMEFRAME: ${fv(data.timeframe)}

MEDIA ALLIES: ${fv(data.mediaAllies)}
MEDIA ADVERSARIES: ${fv(data.mediaAdversaries)}
ADDITIONAL CONTEXT: ${fv(data.additionalNotes)}`;

    case "election":
      return `ELECTION SIMULATION

ELECTION: ${fv(data.electionName)} (${fv(data.electionType)}) in ${fv(data.country)}
SYSTEM: ${fv(data.electionSystem)}

CANDIDATES:
${fv(data.candidates)}
LEADING: ${fv(data.leadingCandidate)} | TRAILING: ${fv(data.trailingCandidate)}
WILD CARD: ${fv(data.wildCardCandidate)} | INCUMBENT: ${fv(data.incumbentStatus)}

MAJOR ISSUES: ${fv(data.majorIssues)}
POLITICAL CLIMATE: ${fv(data.politicalClimate)}
MEDIA LANDSCAPE: ${fv(data.mediaLandscape)}
CURRENT POLLING: ${fv(data.currentPolling)}

KEY VOTER BLOCS: ${fv(data.voterDemographics)}
EXPECTED TURNOUT: ${fv(data.turnoutExpectation)}
SWING GROUPS: ${fv(data.keySwingGroups)}
ECONOMIC CONDITIONS: ${fv(data.economicConditions)}
SCANDALS: ${fv(data.scandals)}
HISTORICAL CONTEXT: ${fv(data.historicalContext)}`;

    case "markets":
      return `MARKET MOVEMENT SIMULATION

SCENARIO: ${fv(data.marketScenario)}
ASSET CLASSES: ${fv(data.assetClass)}
SPECIFIC ASSETS: ${fv(data.specificAssets)}

TRIGGER EVENT: ${fv(data.triggerEvent)}

CURRENT MARKET STATE: ${fv(data.currentMarketState)}
PRICE LEVELS: ${fv(data.priceLevel)}
RECENT TREND: ${fv(data.marketTrend)}

ECONOMIC ENVIRONMENT: ${fv(data.economicContext)}
CENTRAL BANK: ${fv(data.centralBankStance)}
INFLATION: ${fv(data.inflationRate)}
GEOPOLITICAL RISKS: ${fv(data.geopoliticalFactors)}

INVESTOR SENTIMENT: ${fv(data.investorSentiment)}
INSTITUTIONAL POSITIONING: ${fv(data.institutionalPositioning)}
RETAIL SENTIMENT: ${fv(data.retailSentiment)}
TIMEFRAME: ${fv(data.timeframe)}
OUTCOME QUESTION: ${fv(data.outcomeQuestion)}`;

    case "sports":
      return `SPORTS MATCH SIMULATION

EVENT: ${fv(data.eventName)} (${fv(data.sport)})
COMPETITION: ${fv(data.competition)} | VENUE: ${fv(data.venue)}

TEAM A: ${fv(data.teamA)}
FORM: ${fv(data.teamAForm)} | RECORD: ${fv(data.teamARecord)}
KEY PLAYERS: ${fv(data.teamAKeyPlayers)}
STRENGTHS: ${fv(data.teamAStrengths)}

TEAM B: ${fv(data.teamB)}
FORM: ${fv(data.teamBForm)} | RECORD: ${fv(data.teamBRecord)}
KEY PLAYERS: ${fv(data.teamBKeyPlayers)}
STRENGTHS: ${fv(data.teamBStrengths)}

HEAD-TO-HEAD: ${fv(data.headToHead)}
CURRENT ODDS: ${fv(data.currentOdds)}
HOME ADVANTAGE: ${fv(data.homeAdvantage)}
INJURIES: ${fv(data.injuries)}
WEATHER: ${fv(data.weather)}
PRESSURE: ${fv(data.pressureLevel)}
CROWD FACTOR: ${fv(data.crowdFactor)}`;

    case "policy":
      return `POLICY IMPACT SIMULATION

POLICY: ${fv(data.policyName)} (${fv(data.policyType)})
ISSUED BY: ${fv(data.issuingBody)} | SCOPE: ${fv(data.jurisdiction)}

DESCRIPTION: ${fv(data.policyDescription)}
KEY PROVISIONS: ${fv(data.keyProvisions)}
AFFECTED SECTORS: ${fv(data.affectedSectors)}

POLITICAL CONTEXT: ${fv(data.politicalContext)}
OPPOSITION ARGUMENTS: ${fv(data.opposition)}
SUPPORT ARGUMENTS: ${fv(data.support)}
MEDIA FRAMING: ${fv(data.mediaFraming)}

TARGET REGIONS: ${fv(data.targetRegions)}
DEMOGRAPHICS: ${fv(data.targetDemographics)}
TIMEFRAME: ${fv(data.timeframe)}
PRIMARY QUESTION: ${fv(data.primaryQuestion)}`;

    case "product-launch":
      return `PRODUCT LAUNCH SIMULATION

PRODUCT: ${fv(data.productName)} by ${fv(data.companyName)}
CATEGORY: ${fv(data.productCategory)} | PRICE: ${fv(data.pricePoint)}

DESCRIPTION: ${fv(data.productDescription)}
UNIQUE VALUE PROP: ${fv(data.uniqueValueProp)}
DIFFERENTIATORS: ${fv(data.differentiators)}
TARGET CUSTOMER: ${fv(data.targetCustomer)}

COMPETITION: ${fv(data.competition)}
MARKET SHARE: ${fv(data.marketShare)}
INCUMBENT ADVANTAGE: ${fv(data.incumbentAdvantage)}
FIRST MOVER STATUS: ${fv(data.firstMoverStatus)}

LAUNCH MARKETS: ${fv(data.launchMarkets)}
CHANNELS: ${fv(data.channelStrategy)}
MARKETING BUDGET: ${fv(data.marketingBudget)}
BRAND REPUTATION: ${fv(data.brandReputation)}
TARGET DEMOGRAPHICS: ${fv(data.targetDemographics)}`;

    case "geopolitical":
      return `GEOPOLITICAL EVENT SIMULATION

EVENT: ${fv(data.eventName)} (${fv(data.eventType)})
PARTIES INVOLVED: ${fv(data.involvedParties)}
GEOGRAPHIC SCOPE: ${fv(data.geographicScope)}

TRIGGER: ${fv(data.trigger)}
IMMEDIATE ACTIONS: ${fv(data.immediateActions)}
OFFICIAL STATEMENTS: ${fv(data.officialStatements)}
INITIAL INTERNATIONAL REACTION: ${fv(data.internationalReaction)}

HISTORICAL CONTEXT: ${fv(data.historicalContext)}
CURRENT TENSIONS: ${fv(data.currentTensions)}
ALLIANCES: ${fv(data.alliances)}

ECONOMIC STAKES: ${fv(data.economicStakes)}
STRATEGIC RESOURCES: ${fv(data.resourcesInvolved)}
ESCALATION RISK: ${fv(data.escalationRisk)}

TARGET REGIONS: ${fv(data.targetRegions)}
TIMEFRAME: ${fv(data.timeframe)}
PRIMARY QUESTION: ${fv(data.primaryQuestion)}`;

    default: // custom
      return `CUSTOM SIMULATION

SCENARIO: ${fv(data.scenarioTitle)} (${fv(data.scenarioCategory)})
GEOGRAPHIC SCOPE: ${fv(data.geographicScope)}

FULL DESCRIPTION: ${fv(data.scenarioDescription)}
KEY ENTITIES: ${fv(data.keyEntities)}
STAKEHOLDERS: ${fv(data.stakeholders)}

CONTEXT: ${fv(data.context)}
HISTORICAL PRECEDENT: ${fv(data.historicalPrecedent)}
KEY VARIABLES: ${fv(data.variables)}

OUTCOME QUESTION: ${fv(data.outcomeQuestion)}
SECONDARY QUESTIONS: ${fv(data.secondaryQuestions)}

TARGET REGIONS: ${fv(data.targetRegions)}
TARGET DEMOGRAPHICS: ${fv(data.targetDemographics)}
TIMEFRAME: ${fv(data.timeframe)}`;
  }
}

async function runAgent(agent: AgentProfile, scenarioText: string): Promise<AgentResult> {
  const systemPrompt = `You are ${agent.name}, ${agent.age} years old, ${agent.occupation} from ${agent.location}.
Political leaning: ${agent.politicalLeaning}
Economic status: ${agent.economicStatus}
Media diet: ${agent.mediaDiet}
Values: ${agent.values.join(", ")}
Disposition: ${agent.disposition}

Respond authentically as this exact person. React based on your specific background, worldview, and values.`;

  const userMessage = `You have just heard about the following scenario:\n\n${scenarioText}\n\nAs ${agent.name}, how do you genuinely react?\n\nReturn ONLY valid JSON (no other text):\n{\n  "sentiment": "positive" or "negative" or "neutral",\n  "intensity": <number 1-10>,\n  "reaction": "<2-3 sentence authentic first-person reaction>",\n  "likelyAction": "<one specific action this person would take>"\n}`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.85,
    }),
  });

  if (!resp.ok) throw new Error(`Groq error ${resp.status}`);

  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message?.content?.trim() || "";

  try {
    const match = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] || content) as {
      sentiment?: string;
      intensity?: number | string;
      reaction?: string;
      likelyAction?: string;
    };
    return {
      agentId: agent.id,
      agentName: agent.name,
      location: agent.location,
      sentiment: (["positive", "negative", "neutral"].includes(parsed.sentiment || "") ? parsed.sentiment : "neutral") as AgentResult["sentiment"],
      intensity: Math.min(10, Math.max(1, Number(parsed.intensity) || 5)),
      reaction: parsed.reaction || "No reaction generated.",
      likelyAction: parsed.likelyAction || "Monitor the situation.",
    };
  } catch {
    return {
      agentId: agent.id,
      agentName: agent.name,
      location: agent.location,
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
    for (const r of settled) {
      if (r.status === "fulfilled") results.push(r.value);
    }
    if (i + batchSize < agents.length) {
      await new Promise((res) => setTimeout(res, 150));
    }
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
    .map((a) => `${a.agentName} (${a.location}, ${a.sentiment}, intensity ${a.intensity}/10): "${a.reaction}" Action: ${a.likelyAction}`)
    .join("\n");

  const prompt = `You are OMNISIM's master intelligence synthesizer. You have collected reactions from ${agentResults.length} diverse global agents to a scenario.

SCENARIO TYPE: ${type}
GLOBAL SENTIMENT: ${sentimentData.positive}% positive, ${sentimentData.neutral}% neutral, ${sentimentData.negative}% negative

SCENARIO:
${scenarioText}

AGENT REACTIONS:
${agentSummary}

Based on these global perspectives, generate a comprehensive intelligence report. Return ONLY valid JSON (no other text):
{
  "prediction": "<3-4 sentence definitive prediction of what will happen>",
  "confidenceLabel": "HIGH CONFIDENCE" or "MODERATE CONFIDENCE" or "LOW CONFIDENCE" or "VOLATILE — UNPREDICTABLE",
  "confidenceScore": <0-100>,
  "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>", "<factor 4>"],
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "opportunities": ["<opportunity 1>", "<opportunity 2>", "<opportunity 3>"],
  "recommendation": "<2-3 sentence strategic recommendation>",
  "timeline": "<2-3 sentence description of how events will unfold over the specified timeframe>"
}`;

  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 900,
      temperature: 0.7,
    }),
  });

  if (!resp.ok) throw new Error(`Groq synthesis error ${resp.status}`);

  const data = (await resp.json()) as { choices: { message: { content: string } }[] };
  const content = data.choices[0]?.message?.content?.trim() || "";

  try {
    const match = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match?.[0] || content) as {
      prediction?: string;
      confidenceLabel?: string;
      confidenceScore?: number;
      keyFactors?: string[];
      risks?: string[];
      opportunities?: string[];
      recommendation?: string;
      timeline?: string;
    };
    return {
      prediction: parsed.prediction || "Simulation complete.",
      confidenceLabel: parsed.confidenceLabel || "MODERATE CONFIDENCE",
      confidenceScore: parsed.confidenceScore || 65,
      keyFactors: parsed.keyFactors || ["Multiple factors identified"],
      risks: parsed.risks || ["Monitor situation"],
      opportunities: parsed.opportunities || ["Strategic positioning available"],
      recommendation: parsed.recommendation || "Review agent reactions for detailed insights.",
      timeline: parsed.timeline || "Events will develop over the projected timeframe.",
    };
  } catch {
    return {
      prediction: content.slice(0, 500) || "Analysis complete.",
      confidenceLabel: "MODERATE CONFIDENCE",
      confidenceScore: 65,
      keyFactors: ["Analysis complete"],
      risks: ["Review individual agent reactions"],
      opportunities: ["Detailed breakdown available in agent tab"],
      recommendation: "Review the agent reactions for specific insights.",
      timeline: "Events will unfold over the projected timeframe.",
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type?: string; data?: Record<string, FormValue> };
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const scenarioText = buildScenarioText(type, data);
    const agents = selectAgentsForSimulation(type, 20);
    const agentResults = await runAgentBatch(agents, scenarioText);

    const total = agentResults.length || 1;
    const positiveCount = agentResults.filter((a) => a.sentiment === "positive").length;
    const negativeCount = agentResults.filter((a) => a.sentiment === "negative").length;
    const neutralCount = agentResults.filter((a) => a.sentiment === "neutral").length;

    const sentimentData = {
      positive: Math.round((positiveCount / total) * 100),
      negative: Math.round((negativeCount / total) * 100),
      neutral: Math.round((neutralCount / total) * 100),
    };

    const prediction = await generateFinalPrediction(type, scenarioText, agentResults, sentimentData);

    const id = crypto.randomUUID();
    const simulationResult = {
      id,
      type,
      ...prediction,
      sentimentData,
      agentResults,
      createdAt: new Date().toISOString(),
    };

    try {
      const db = createServiceClient();
      await db.from("simulations").insert({
        id,
        type,
        scenario_data: data,
        result: simulationResult,
        status: "complete",
      });
    } catch (dbErr) {
      console.error("Supabase store error:", dbErr);
    }

    return NextResponse.json(simulationResult);
  } catch (err) {
    console.error("Simulation error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Simulation failed" },
      { status: 500 }
    );
  }
}
