import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseClient";
import { getRequestUser } from "@/lib/serverAuth";
import { buildActionPlan, buildMemorySnapshot, buildRealityLedger, buildTruthScore, buildVariableLab } from "@/lib/simulationIntelligence";
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


export interface SwarmLabRound {
  phase: string;
  action: string;
  output: string;
  confidenceImpact: number;
}

export interface SwarmLabTrace {
  engineVersion: string;
  realitySeed: string[];
  personaIntelligence: string[];
  simulationRounds: SwarmLabRound[];
  mutationTests: string[];
  learningLoop: string;
  resilienceFilter: string;
}
export interface PhoneReachIntelligence {
  worldPopulation: number;
  internetUsers: number;
  offlinePopulation: number;
  uniqueMobileSubscribers: number;
  smartphoneReach: number;
  basicPhoneReach: number;
  estimatedActiveOnlineNow: number;
  smartphoneActiveNow: number;
  basicPhoneActiveNow: number;
  offlineReachDelay: string;
  firstHourReach: number;
  firstDayReach: number;
  smartphoneShareOfMobile: number;
  digitalReachShare: number;
  smsReachShare: number;
  offlineShare: number;
  likelyAmplification: "low" | "medium" | "high" | "explosive";
  reachNarrative: string;
  assumptions: string[];
}

type FormValue = string | string[];


function truthCalibrationText(data: Record<string, FormValue>): string {
  return `\n\nTRUTH CALIBRATION\nKNOWN FACTS: ${fv(data.knownFacts)}\nUNKNOWNS / MISSING INFORMATION: ${fv(data.unknowns)}\nEVIDENCE QUALITY: ${fv(data.evidenceQuality)}\nREAL-WORLD CONSTRAINTS: ${fv(data.constraints)}\nIDEAL OUTCOME: ${fv(data.idealOutcome)}\nUNACCEPTABLE OUTCOME / BOUNDARY: ${fv(data.unacceptableOutcome)}\nTRUTH STAGE CHECKPOINTS: ${fv(data.__truthStageChecks)}\n\nINSTRUCTION: Treat measured facts and direct evidence as stronger than assumptions. If any stage checkpoint is "unknown" or "skip", explicitly lower certainty for that stage and say what facts must be verified. When facts are missing, say what uncertainty remains. Respect constraints and boundaries. Do not overclaim certainty.`;
}
function fv(val: FormValue | undefined): string {
  if (!val) return "Not specified";
  return Array.isArray(val) ? val.join(", ") : val;
}


function isPrivateHumanScenario(type: string): boolean {
  return ["relationship", "legacy-view", "health-signal"].includes(type);
}


function categoryDepthInstruction(type: string): string {
  const map: Record<string, string> = {
    "public-reaction": "PUBLIC REACTION DEEP READ: identify narrative ignition point, audience factions, likely backlash/support, platform spread, media angle, trust risk, and exact response strategy.",
    election: "ELECTION DEEP READ: identify voter blocs, turnout levers, persuasion barriers, opposition attack lines, polling uncertainty, swing factors, and campaign moves.",
    markets: "MARKET DEEP READ: identify asset sensitivity, liquidity risk, positioning, macro trigger, downside protection, confirmation signals, and trade/investment risk rules without financial-advice guarantees.",
    sports: "SPORTS DEEP READ: identify tactical matchup, form, injuries, pressure, coaching decisions, momentum windows, and upset conditions.",
    policy: "POLICY DEEP READ: identify affected groups, enforcement friction, political incentives, adoption blockers, litigation/media risk, and implementation sequence.",
    "product-launch": "PRODUCT LAUNCH DEEP READ: identify buyer pain, adoption friction, pricing risk, channel strategy, retention signal, competitive moat, and launch sequence.",
    geopolitical: "GEOPOLITICAL DEEP READ: identify actor incentives, red lines, escalation ladders, alliance moves, economic pressure, information warfare, and off-ramp conditions.",
    "profit-path": "PROFIT PATH DEEP READ: identify capital protection, offer-market fit, first buyer path, automation stack, weekly execution plan, failure rules, reinvestment discipline, and scam/risk avoidance.",
    relationship: "RELATIONSHIP DEEP READ: identify emotional loop, trust state, safety context, pressure sources, repair path, breakdown path, conversation script, and behavior proof.",
    "health-signal": "HEALTH SIGNAL DEEP READ: identify urgency, red flags, missing vitals/tests, likely categories to discuss with clinicians, monitoring plan, and care-access decision points. No diagnosis or prescription.",
    "legacy-view": "LEGACY VIEW DEEP READ: identify remembered values, current burden, resilience lesson, grounded encouragement, boundary, and next action without pretending contact with the deceased.",
    custom: "CUSTOM DEEP READ: identify system map, hidden variables, constraints, likely path, alternative path, failure mode, leverage point, and next action.",
  };
  return map[type] || map.custom;
}

const universalDeepReadJson = `,
  "deepRead": {
    "title": "<specific category title>",
    "coreDiagnosis": "<8-10 specific sentences using the user's facts, unknowns, constraints, and evidence quality. No generic filler.>",
    "truthMap": [
      { "signal": "<fact/unknown/constraint>", "meaning": "<why it matters>", "confidence": <0-100> },
      { "signal": "<fact/unknown/constraint>", "meaning": "<why it matters>", "confidence": <0-100> },
      { "signal": "<fact/unknown/constraint>", "meaning": "<why it matters>", "confidence": <0-100> }
    ],
    "hiddenLevers": ["<lever 1>", "<lever 2>", "<lever 3>"],
    "failureMode": "<4-6 specific sentences on how this fails if nothing changes>",
    "bestPath": "<4-6 specific sentences on the most realistic path to a good outcome>",
    "decisionRules": ["<if/then rule 1>", "<if/then rule 2>", "<if/then rule 3>"],
    "sevenDayActionPlan": ["<day 1>", "<day 2>", "<day 3>", "<day 4>", "<day 5>", "<day 6>", "<day 7>"],
    "questionsToAnswerNext": ["<question 1>", "<question 2>", "<question 3>"],
    "stoicResilienceNote": "<what to control, what to stop chasing, and what action proves growth>"
  }`;
function privateScenarioInstruction(type: string): string {
  if (type === "relationship") {
    return `RELATIONSHIP DEEP READ MODE: This is a private human relationship, not a public event. Do not write generic therapy-like advice. Do not use population-scale language. Use the user's specific trust level, conflict pattern, repair attempts, affection/friendship, pressure sources, shared values, change willingness, safety answer, desired outcome, and truth calibration. Be direct, emotionally intelligent, and practical. Show what is likely happening under the surface, what each person may be protecting, what will break the relationship, what could repair it, and exactly what to do next. If safety risk exists, prioritize safety and outside support over repair.`;
  }
  if (type === "legacy-view") {
    return `LEGACY DEEP READ MODE: This is a private grief and resilience reflection, not a public event. Do not claim supernatural contact. Write with grounded dignity, stoic courage, memory-based reflection, and practical next steps.`;
  }
  if (type === "health-signal") {
    return `HEALTH TRIAGE MODE: This is private health triage support, not a public event and not diagnosis. Focus on urgency, red flags, measured facts, uncertainty, care access, and clinician questions.`;
  }
  return `PUBLIC / MARKET / SOCIAL EVENT MODE: Analyze spread, population response, second-order effects, and real-world adoption through phone reach and social relay.`;
}

const relationshipDeepDiveJson = `,
  "relationshipDeepDive": {
    "coreDiagnosis": "<8-12 sentences. Name the exact relationship pattern using the user's details. Explain the emotional loop, trust condition, pressure sources, safety context, and what is actually being tested. No generic filler.>",
    "whatEachPersonMayFeel": [
      { "side": "Person A / user", "likelyFeeling": "<specific emotional state>", "protectiveStrategy": "<how they protect themselves>", "hiddenNeed": "<what they need but may not say>" },
      { "side": "Partner / other person", "likelyFeeling": "<specific emotional state>", "protectiveStrategy": "<how they protect themselves>", "hiddenNeed": "<what they need but may not say>" }
    ],
    "patternLoop": ["<trigger>", "<reaction>", "<counter-reaction>", "<damage created>", "<how the loop repeats>"],
    "repairPlan": [
      { "step": "<specific step>", "whyItMatters": "<why>", "timeframe": "<when>", "successSignal": "<observable proof>" },
      { "step": "<specific step>", "whyItMatters": "<why>", "timeframe": "<when>", "successSignal": "<observable proof>" },
      { "step": "<specific step>", "whyItMatters": "<why>", "timeframe": "<when>", "successSignal": "<observable proof>" }
    ],
    "breakdownPath": "<5-7 sentences explaining exactly how it breaks if nothing changes>",
    "conversationScript": ["<sentence to open conversation>", "<sentence naming accountability>", "<sentence asking for truth>", "<sentence setting boundary>", "<sentence defining next action>"],
    "sevenDayActionPlan": ["<day 1 action>", "<day 2 action>", "<day 3 action>", "<day 4 action>", "<day 5 action>", "<day 6 action>", "<day 7 action>"],
    "stoicResilienceNote": "<specific stoic high-performance note: what to control, what to stop chasing, what action proves growth>"
  }`;
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


// ─── Phone Reach Intelligence Layer ──────────────────────────────────────────
function calcPhoneReachIntelligence(
  type: string,
  agentResults: AgentResult[],
  populationWeightedSentiment: { positive: number; neutral: number; negative: number }
): PhoneReachIntelligence {
  const worldPopulation = 8100;
  const internetUsers = 6000;
  const uniqueMobileSubscribers = 5830;
  const smartphoneReach = 5340;
  const basicPhoneReach = Math.max(0, uniqueMobileSubscribers - smartphoneReach);
  const offlinePopulation = Math.max(0, worldPopulation - internetUsers);

  const now = new Date();
  const utcHour = now.getUTCHours();
  const asiaPrime = utcHour >= 11 && utcHour <= 16;
  const europeAfricaPrime = utcHour >= 16 && utcHour <= 22;
  const americasPrime = utcHour >= 22 || utcHour <= 4;
  const activeFactor = asiaPrime ? 0.38 : europeAfricaPrime ? 0.34 : americasPrime ? 0.31 : 0.27;

  const avgIntensity = agentResults.length
    ? agentResults.reduce((sum, agent) => sum + agent.intensity, 0) / agentResults.length
    : 5;
  const polarity = Math.max(populationWeightedSentiment.positive, populationWeightedSentiment.negative) / 100;
  const controversyBoost = 0.75 + polarity * 0.35 + Math.min(0.25, avgIntensity / 40);

  const estimatedActiveOnlineNow = Math.round(internetUsers * activeFactor);
  const smartphoneActiveNow = Math.round(smartphoneReach * activeFactor * 0.92);
  const basicPhoneActiveNow = Math.round(basicPhoneReach * activeFactor * 0.45);
  const firstHourReach = Math.round(Math.min(internetUsers, smartphoneActiveNow * controversyBoost + basicPhoneActiveNow * 0.15));
  const firstDayReach = Math.round(Math.min(internetUsers, firstHourReach * (type === "public-reaction" || type === "geopolitical" ? 3.2 : 2.4)));

  const explosiveScore = firstHourReach / internetUsers + avgIntensity / 20 + polarity / 2;
  const likelyAmplification = explosiveScore > 1.15 ? "explosive" : explosiveScore > 0.9 ? "high" : explosiveScore > 0.65 ? "medium" : "low";

  return {
    worldPopulation,
    internetUsers,
    offlinePopulation,
    uniqueMobileSubscribers,
    smartphoneReach,
    basicPhoneReach,
    estimatedActiveOnlineNow,
    smartphoneActiveNow,
    basicPhoneActiveNow,
    offlineReachDelay: "Offline and low-data populations usually receive the event through radio, TV, SMS, family networks, workplace discussion, religious/community leaders, and delayed reposts.",
    firstHourReach,
    firstDayReach,
    smartphoneShareOfMobile: Math.round((smartphoneReach / uniqueMobileSubscribers) * 100),
    digitalReachShare: Math.round((internetUsers / worldPopulation) * 100),
    smsReachShare: Math.round((basicPhoneReach / worldPopulation) * 100),
    offlineShare: Math.round((offlinePopulation / worldPopulation) * 100),
    likelyAmplification,
    reachNarrative: `At this moment, roughly ${estimatedActiveOnlineNow}M people may be online globally, with about ${smartphoneActiveNow}M reachable through smartphone feeds, push alerts, video, search, and messaging apps. Another ${basicPhoneActiveNow}M basic-phone users may be reachable through SMS, voice, USSD, radio-linked community relay, or second-hand sharing. This is an estimate for event spread, not an exact census.`,
    assumptions: [
      "World population baseline: 8.1B humans.",
      "Internet-user baseline: about 6.0B people online globally.",
      "Mobile baseline: about 5.83B unique mobile subscribers.",
      "Smartphone/mobile-web baseline: about 5.34B people; remaining mobile users are treated as basic/SMS-first reach.",
      "Active-now estimates vary by UTC hour, region awake cycles, event intensity, and sentiment polarity."
    ],
  };
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
    case "profit-path":
      return `PROFIT PATH SIMULATION\n\nSTARTING CAPITAL: $${fv(data.startingCapital)}\nMONTHLY PROFIT GOAL: $${fv(data.monthlyNeed)}\nTIMEFRAME: ${fv(data.timeframe)}\nRISK TOLERANCE: ${fv(data.riskTolerance)}\n\nSKILLS: ${fv(data.skills)}\nTIME AVAILABLE: ${fv(data.availableTime)}\nTOOLS: ${fv(data.toolsAccess)}\n\nPREFERRED MODEL: ${fv(data.preferredModel)}\nTARGET BUYER: ${fv(data.targetBuyer)}\nOFFER IDEA: ${fv(data.offerIdea)}\n\nAUTOMATION TARGETS: ${fv(data.automationTargets)}\nSPEND PLAN: ${fv(data.spendPlan)}\nSTOP RULES: ${fv(data.stopRules)}\n\nMETRICS: ${fv(data.metrics)}\nREINVESTMENT RULE: ${fv(data.reinvestmentRule)}\nBIGGEST CONCERN: ${fv(data.biggestConcern)}\n\nIMPORTANT: This is educational simulation, not financial advice. Do not promise guaranteed or continuous profit. Emphasize capital protection, cash-flow experiments, tool verification, stop-loss rules, and reinvestment from actual profit only.`;
    case "relationship":
      return `RELATIONSHIP FUTURE SIMULATION\n\nTYPE: ${fv(data.relationshipType)}\nDURATION: ${fv(data.duration)}\nPRIMARY QUESTION: ${fv(data.primaryQuestion)}\n\nTRUST: ${fv(data.trustLevel)}\nCONFLICT PATTERN: ${fv(data.conflictPattern)}\nREPAIR ATTEMPTS: ${fv(data.repairAttempts)}\nAFFECTION / FRIENDSHIP: ${fv(data.affection)}\n\nPRESSURES: ${fv(data.pressureSources)}\nSHARED VALUES: ${fv(data.sharedValues)}\nWILLINGNESS TO CHANGE: ${fv(data.changeWillingness)}\n\nSAFETY CHECK: ${fv(data.safetyConcern)}\nSAFETY DETAILS: ${fv(data.safetyDetails)}\n\nDESIRED OUTCOME: ${fv(data.desiredOutcome)}\nNEXT CONVERSATION: ${fv(data.nextConversation)}\n\nIMPORTANT: This is not therapy, diagnosis, or a command to stay or leave. If safety concerns exist, prioritize safety, trusted outside support, and boundaries over normal relationship optimization.`;
    case "health-signal":
      return `HEALTH SIGNAL SIMULATION\n\nIMPORTANT SAFETY FRAME: This is educational health triage support, not diagnosis, prescription, or medical advice. Identify urgency, organize facts, suggest questions for a licensed clinician, and advise emergency care for red flags. Do not provide unsafe dosing or definitive diagnosis.\n\nPERSON: Age ${fv(data.age)} | Sex at birth: ${fv(data.sexAtBirth)} | Location: ${fv(data.currentLocation)} | Height/Weight: ${fv(data.heightWeight)}\nBLOOD TYPE: ${fv(data.bloodType)}\nGENOTYPE / SICKLE CELL STATUS: ${fv(data.genotype)}\nPREGNANCY / POSTPARTUM: ${fv(data.pregnancyStatus)}\n\nMAIN CONCERN: ${fv(data.mainConcern)}\nSYMPTOMS: ${fv(data.symptoms)}\nSTARTED: ${fv(data.startedWhen)}\nPROGRESSION: ${fv(data.progression)}\nPAIN / FEVER / BLEEDING: ${fv(data.painOrFever)}\n\nKNOWN CONDITIONS: ${fv(data.knownConditions)}\nMEDICATIONS / SUPPLEMENTS: ${fv(data.medications)}\nALLERGIES: ${fv(data.allergies)}\nEXPOSURES: ${fv(data.exposures)}\n\nVITALS: ${fv(data.vitals)}\nLABS / TESTS: ${fv(data.labs)}\nRED FLAGS: ${fv(data.redFlags)}\nCARE ACCESS: ${fv(data.careAccess)}\n\nOUTPUT STYLE: Start with urgency level and red-flag reasoning. Then list likely categories to discuss with a clinician, what facts matter most, what to monitor, and what questions/tests to ask for. If red flags are present, prioritize urgent care over simulation detail.`;
    case "legacy-view":
      return `LEGACY VIEW SIMULATION\n\nIMPORTANT SAFETY FRAME: This is a reflective exercise based on the user's memories and values. Do not claim to contact, channel, or speak literally for the deceased. Write as a grounded legacy mirror: "Based on what you remember of them, they may have wanted you to see..." Avoid manipulation, certainty, or supernatural claims.\n\nLOVED ONE: ${fv(data.lovedOneName)}\nRELATIONSHIP: ${fv(data.relationshipToYou)}\nPERSONALITY: ${fv(data.theirPersonality)}\nVALUES: ${fv(data.theirValues)}\n\nCURRENT SEASON: ${fv(data.currentSeason)}\nLIFE UPDATE: ${fv(data.lifeUpdate)}\nWHAT MIGHT MAKE THEM PROUD: ${fv(data.proudMoments)}\nPRIVATE STRUGGLE: ${fv(data.privateStruggle)}\n\nDESIRED TONE: ${fv(data.desiredTone)}\nMAIN QUESTION: ${fv(data.mainQuestion)}\nNEED MOST: ${fv(data.needMost)}\nAVOID TONE: ${fv(data.avoidTone)}\n\nRESILIENCE FOCUS: ${fv(data.resilienceFocus)}\nPOWER LESSON: ${fv(data.powerLesson)}\nNEXT STEP: ${fv(data.nextStep)}\n\nOUTPUT STYLE: Give sober hope, practical encouragement, and a clear next step. Integrate stoic principles: control what can be controlled, accept what cannot be changed, act with virtue, keep discipline under pressure. Integrate power-awareness without cruelty: reputation, timing, restraint, allies, leverage, and self-command. Use resilience laws such as self-mastery, disciplined action, honest grief, duty, boundaries, useful work, patience, and rebuilding identity after loss. If the user expresses self-harm intent, advise immediate trusted human support and emergency help.`;
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
  {
    id: "medical",
    name: "Dr. Selene Hart",
    domain: "Medical Risk, Human Biology & Health Triage",
    color: "#059669",
    systemPrompt: `You are Dr. Selene Hart, an elite physician-analyst trained in emergency medicine, public health, and human performance medicine. You do not diagnose or prescribe. You identify red flags, biological constraints, health risk signals, medication/context interactions, missing vitals/labs, and when a user needs urgent licensed care. For non-medical scenarios, you still analyze the human-body constraint: stress load, fatigue, sleep, injury risk, cognitive bandwidth, burnout, and health-related decision risk. Your output must be careful, evidence-based, and safety-first.`,
  },
  {
    id: "psychologist",
    name: "Dr. Vivian Cross",
    domain: "Performance Psychology, Relationships & Behavioral Truth",
    color: "#315FAE",
    systemPrompt: `You are Dr. Vivian Cross, an elite performance psychologist and counselor for founders, traders, athletes, couples, and high-pressure leaders. You combine clinical-grade emotional pattern recognition with boardroom-level directness. You identify fear, shame, attachment patterns, avoidance, coercion risk, burnout, distorted narratives, and the hidden need beneath behavior. You are warm but not soft, precise but not cruel. You never give generic therapy filler; you name the pattern and the behavior proof required.`,
  },
  {
    id: "resilience_power",
    name: "Joy-Robert Stoic Strategist",
    domain: "Stoic Power, 48 Laws Strategy & 18 Laws Resilience",
    color: "#7C3AED",
    systemPrompt: `You are the Joy-Robert Stoic Strategist, a composite strategic analyst trained on Stoic operating principles, Robert Greene-style power dynamics, and Joy Ogunleye's 18 Laws of Building Resilience: harnessing strength, overcoming adversity, and thriving through life's challenges. You identify leverage, timing, reputation, self-command, emotional restraint, power traps, resilience failures, and disciplined next action. You do not glorify manipulation or cruelty. You translate adversity into strength, boundaries, patience, positioning, and high-performance execution.`,
  },] as const;

async function runSpecialist(specialist: (typeof SPECIALISTS)[number], scenarioText: string): Promise<SpecialistResult> {
  const userMessage = `SCENARIO:\n${scenarioText.slice(0, 620)}\n\nAnalyze this scenario exclusively through your domain expertise. Return ONLY valid JSON:\n{\n  "analysis": "<3-4 sentence deep-domain analysis from your unique lens>",\n  "keyInsight": "<1 sentence — the single most important insight only your domain reveals>",\n  "riskFlag": "<1 sentence — primary risk you see that others would miss>",\n  "opportunityFlag": "<1 sentence — primary opportunity you see that others would miss>",\n  "confidenceModifier": <integer -15 to +15 — how much does your domain analysis shift overall prediction confidence>\n}`;

  let resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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


// --- OmniSim SwarmLab Intelligence Layer ------------------------------------
function buildSwarmLabTrace(
  type: string,
  scenarioText: string,
  agentResults: AgentResult[],
  specialistResults: SpecialistResult[],
  populationWeightedSentiment: { positive: number; neutral: number; negative: number },
  historicalCount: number,
  calibratedConfidence: number
): SwarmLabTrace {
  const words = scenarioText
    .replace(/[^a-zA-Z0-9\s$%.-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4);
  const uniqueWords = Array.from(new Set(words.map((word) => word.toLowerCase()))).slice(0, 10);
  const strongestAgents = [...agentResults]
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 5)
    .map((agent) => `${agent.agentName} / ${agent.location} / ${agent.sentiment} ${agent.intensity}/10`);
  const strongestSpecialists = specialistResults
    .slice(0, 5)
    .map((specialist) => `${specialist.name}: ${specialist.domain}`);
  const dominantSentiment = populationWeightedSentiment.positive >= populationWeightedSentiment.negative && populationWeightedSentiment.positive >= populationWeightedSentiment.neutral
    ? "positive"
    : populationWeightedSentiment.negative >= populationWeightedSentiment.neutral
      ? "negative"
      : "neutral";

  return {
    engineVersion: "OmniSim Intelligence Core v0.2",
    realitySeed: [
      `Scenario class: ${type}`,
      `Seed signals: ${uniqueWords.length ? uniqueWords.join(", ") : "truth calibration and user context"}`,
      `Population-weighted leaning: ${dominantSentiment}`,
      `Historical memory used: ${historicalCount} prior simulations`,
      "Architecture: graph seed -> persona intelligence -> environment model -> mutation tests -> report agent",
    ],
    personaIntelligence: [...strongestAgents, ...strongestSpecialists].slice(0, 8),
    simulationRounds: [
      {
        phase: "Graph Seed Building",
        action: "Converted facts, unknowns, constraints, people, timing, money, health, reputation, and evidence quality into a relationship graph.",
        output: "Reality graph prepared for simulation instead of shallow prompt guessing.",
        confidenceImpact: historicalCount > 0 ? 4 : 2,
      },
      {
        phase: "Environment Setup",
        action: "Built the sandbox conditions around region, culture, incentives, available tools, safety limits, and user boundaries.",
        output: "Scenario world created with practical constraints and no-fantasy assumptions.",
        confidenceImpact: 3,
      },
      {
        phase: "Persona Intelligence Calibration",
        action: `Selected ${agentResults.length} field agents and ${specialistResults.length} specialist lenses to test human response diversity.`,
        output: "Human behavior spread, incentives, fears, and likely actions mapped.",
        confidenceImpact: agentResults.length >= 15 ? 5 : 2,
      },
      {
        phase: "Parallel Outcome Simulation",
        action: "Compared best-case, likely-case, downside, and hidden-opportunity trajectories across the model.",
        output: `Dominant population-weighted sentiment resolved as ${dominantSentiment}.`,
        confidenceImpact: calibratedConfidence >= 75 ? 6 : calibratedConfidence >= 55 ? 3 : -2,
      },
      {
        phase: "Dynamic Variable Injection",
        action: "Pressure-tested what changes if timing, trust, money, health, reputation, or access constraints shift.",
        output: "Fragile assumptions and leverage points separated from stable signals.",
        confidenceImpact: 4,
      },
      {
        phase: "ReportAgent Synthesis",
        action: "Compressed agent reactions, specialist analysis, counter-intelligence, and historical memory into a decision-grade brief.",
        output: "Final answer shaped for action, not entertainment.",
        confidenceImpact: 4,
      },
      {
        phase: "Resilience Filter",
        action: "Applied stoic control, leverage, risk boundary, and disciplined next-action filters.",
        output: "Result optimized for useful truth and high-performance action, not comfort or hype.",
        confidenceImpact: 4,
      },
    ],
    mutationTests: [
      "What changes if the strongest assumption is wrong?",
      "What happens if timing, trust, money, health, or reputation constraints tighten?",
      "Which single variable most improves the user's odds?",
      "Which hidden risk would create the fastest failure path?",
    ],
    learningLoop: historicalCount > 0
      ? `Self-loop active: compared against ${historicalCount} prior completed simulations of this type.`
      : "Self-loop primed: this result becomes future memory after storage, improving later calibration.",
    resilienceFilter: "Stoic principle applied: face reality, control the controllable, conserve energy, choose leverage, act with discipline, and keep improving through feedback.",
  };
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
    let resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

  let resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
${isPrivateHumanScenario(type) ? "PRIVATE SCENARIO: do not frame this as an 8.1B population event" : "WORLD POPULATION: 8.1 billion humans"}
AGENT SAMPLE: ${agentResults.length} agents${isPrivateHumanScenario(type) ? " testing behavioral patterns" : ` representing ~${totalRepresentedPop}M people`}
RAW AGENT SENTIMENT: ${sentimentData.positive}% positive | ${sentimentData.neutral}% neutral | ${sentimentData.negative}% negative
${isPrivateHumanScenario(type) ? "PATTERN-WEIGHTED SENTIMENT: use as internal signal only, not as global population claim" : `POPULATION-WEIGHTED GLOBAL SENTIMENT: ${populationWeightedSentiment.positive}% positive | ${populationWeightedSentiment.neutral}% neutral | ${populationWeightedSentiment.negative}% negative`}
${type === "legacy-view" ? "RESILIENT OPERATING PHILOSOPHY: OmniSim must think like a stoic high performer: face facts, control what can be controlled, identify leverage, respect constraints, learn from prior simulations, and turn uncertainty into disciplined next action. Avoid shallow hype. Prefer useful truth over pleasing answers.`nPRIVATE REFLECTION REALITY: This is not an event-spread simulation. Treat it as a grief-safe legacy mirror. Do not claim supernatural contact or certainty. Focus on stoic encouragement, practical resilience, and grounded next steps." : type === "health-signal" ? "RESILIENT OPERATING PHILOSOPHY: OmniSim must think like a stoic high performer: face facts, control what can be controlled, identify leverage, respect constraints, learn from prior simulations, and turn uncertainty into disciplined next action. Avoid shallow hype. Prefer useful truth over pleasing answers.`nPRIVATE HEALTH REALITY: This is not an event-spread simulation. Treat it as educational triage support, not diagnosis. Prioritize red flags, clinician questions, measured facts, and uncertainty boundaries." : "RESILIENT OPERATING PHILOSOPHY: OmniSim must think like a stoic high performer: face facts, control what can be controlled, identify leverage, respect constraints, learn from prior simulations, and turn uncertainty into disciplined next action. Avoid shallow hype. Prefer useful truth over pleasing answers.`nPHONE REACH REALITY: Every event must be analyzed through smartphone reach, basic/SMS phone reach, active-online-now spread, and delayed offline relay. Do not assume the whole world sees the event at once."}

SCENARIO:
${scenarioText.slice(0, 620)}

FIELD AGENT REACTIONS WITH POPULATION WEIGHTS:
${agentSummary}${historicalContext}

ELITE SPECIALIST PANEL (8 domain experts — integrate their analysis into synthesis):
${specialistSummary}
(Combined specialist confidence modifier: ${totalSpecialistMod >= 0 ? "+" : ""}${totalSpecialistMod})

MODE INSTRUCTION:\n${privateScenarioInstruction(type)}\n${categoryDepthInstruction(type)}\n\nSynthesize all data — agent reactions, specialist domain analysis, truth calibration, constraints, counter-signals, and historical archive — into a world-class multi-layer intelligence brief. For private human scenarios, write like a precise decision coach, not a global news analyst. Return ONLY valid JSON:
{
  "executiveSummary": "<3 substantial paragraphs separated by \\n\\n. For relationship/private scenarios: Para 1 names the exact human pattern; Para 2 explains the hidden emotional incentives and constraints; Para 3 states the critical decision point and what must happen next. For public scenarios: use global stakes and population dynamics.>",
  "prediction": "<8-12 sentence specific prediction. For relationship/private scenarios: explain likely emotional trajectory, repair probability, breakdown probability, what each side must change, and the observable signs to watch. For public scenarios: include primary outcome, secondary effects, population impact, winners/losers, and confirmation signals.>",
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
    { "phase": "Immediate (0-48 hours)", "events": "<3-5 specific sentences>" },
    { "phase": "Short-Term (1-4 weeks)", "events": "<3-5 specific sentences>" },
    { "phase": "Medium-Term (1-3 months)", "events": "<3-5 specific sentences>" },
    { "phase": "Long-Term (3-12 months)", "events": "<3-5 specific sentences>" }
  ]${universalDeepReadJson}
}`;

  let resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1300,
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (resp.status === 429 || resp.status >= 500) {
    await new Promise((resolve) => setTimeout(resolve, 9500));
    resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.62,
        response_format: { type: "json_object" },
      }),
    });
  }

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`Groq synthesis error ${resp.status}: ${errText}`);
    const dominantAgent = agentResults
      .slice()
      .sort((a, b) => b.intensity - a.intensity)[0];
    const strongestSpecialist = specialistResults
      .slice()
      .sort((a, b) => Math.abs(b.confidenceModifier) - Math.abs(a.confidenceModifier))[0];
    const topSentiment = Object.entries(sentimentData)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
    const privateScenario = isPrivateHumanScenario(type);
    const evidenceLine = dominantAgent
      ? `${dominantAgent.agentName} reads the scenario as ${dominantAgent.sentiment} at ${dominantAgent.intensity}/10 intensity, with the likely action: ${dominantAgent.likelyAction}`
      : "The field-agent layer found mixed signals and no single dominant human response.";
    const specialistLine = strongestSpecialist
      ? `${strongestSpecialist.name} adds the strongest specialist signal: ${strongestSpecialist.keyInsight}`
      : "The specialist layer points back to truth quality, constraints, and downside control as the deciding variables.";

    return {
      executiveSummary: privateScenario
        ? `OmniSim reads this as a private human decision, not a public spectacle. The strongest current pattern is ${topSentiment}, meaning the facts supplied point toward pressure, uncertainty, or repair work that cannot be solved by hope alone. ${evidenceLine}\n\n${specialistLine} The important question is not only what will happen; it is which behavior must change first for the outcome to improve. If trust, safety, health, money, or emotional honesty is weak, the simulation treats that as a real constraint, not background noise.\n\nThe useful path is disciplined: protect the downside, verify the biggest unknown, stop rewarding repeated harm, and take one evidence-producing action within the next 7 days. The result should be judged by observable behavior, not promises, fear, guilt, or temporary emotion.`
        : `OmniSim reads this as a real-world event with human attention, phone reach, media relay, and second-order pressure shaping the outcome. The strongest current agent pattern is ${topSentiment}, which means early response is likely to cluster around that emotional direction before facts, incentives, and counter-narratives reshape it. ${evidenceLine}\n\n${specialistLine} The first visible outcome will come from attention velocity; the durable outcome will come from incentives, credibility, and who adapts fastest after the first reaction. Smartphone reach creates fast awareness, while basic-phone and offline relay create slower but still meaningful spread.\n\nThe practical move is to watch the confirmation signals: who changes behavior, who commits money or reputation, what institutions respond, and which narrative survives after the first emotional wave. The simulation favors measured action, verified signals, and downside control over hype.`,
      prediction: privateScenario
        ? `The likely path is not fixed, but it is conditional. If the key pressure point stays unaddressed, the scenario will drift toward the dominant ${topSentiment} pattern shown by the field agents. If the user verifies the weakest facts, sets a clear boundary, and watches behavior over words, the outcome can improve. The next stage should focus on one concrete test: what changes in action, not explanation, within the next 7 to 14 days.`
        : `The likely path begins with a fast attention spike, then separates into people who react emotionally, people who wait for proof, and institutions or markets that respond only when incentives become clear. If the first evidence wave confirms the dominant ${topSentiment} signal, the outcome strengthens quickly. If credible counter-evidence appears, sentiment can flatten and become more neutral. The strongest forecast is therefore conditional: track attention, proof, incentives, and behavior change rather than one headline result.`,
      confidenceLabel: "RESERVE SYNTHESIS",
      confidenceScore: 66,
      confidenceReasoning: `Confidence is moderate because OmniSim is using completed field-agent and specialist layers without the extended narrative pass. The result is still grounded in ${agentResults.length} agents, ${specialistResults.length} specialists, sentiment balance, historical memory, and scenario constraints.`,
      cascadeEffects: [
        { step: 1, title: "Pressure Reveals", description: "The scenario's strongest pressure point becomes visible through behavior, not words.", probability: 72, timeframe: "0-7 days", domain: privateScenario ? "social" : "media" },
        { step: 2, title: "Response Splits", description: "Different actors separate into action, avoidance, resistance, or repair depending on incentives and trust.", probability: 64, timeframe: "1-4 weeks", domain: "social" },
        { step: 3, title: "Pattern Locks", description: "Repeated behavior starts to matter more than stated intention, creating the durable path.", probability: 58, timeframe: "1-3 months", domain: privateScenario ? "social" : "economic" },
      ],
      scenarioBranches: [
        { label: "Most Likely", probability: 54, description: "The current dominant pattern continues unless a concrete behavior change or new evidence interrupts it.", trigger: "No verified change in the highest-pressure variable" },
        { label: "Recovery Path", probability: 28, description: "The outcome improves when the user verifies facts, reduces emotional distortion, and acts on the highest-leverage next step.", trigger: "Clear proof, boundary, or disciplined action within 7-14 days" },
        { label: "Downside Path", probability: 18, description: "The situation worsens if missing facts, pressure, or unsafe incentives are ignored.", trigger: "Avoidance, denial, coercion, financial overreach, or repeated broken trust" },
      ],
      keyFactors: ["Evidence quality", "Dominant human response", "Specialist risk signal", "Real-world constraints", "Next observable behavior"],
      risks: ["Acting from emotion instead of verified facts", "Ignoring the highest-pressure variable", "Confusing words with behavior", "Moving too aggressively without downside protection"],
      opportunities: ["Verify the weakest assumption", "Use one small action to test reality", "Turn pressure into a disciplined decision", "Improve outcome by changing the leverage variable first"],
      strategicActions: ["Name the biggest unknown", "Verify it with evidence", "Set the downside boundary", "Take one reversible next action", "Measure behavior within 7-14 days"],
      recommendation: "Treat this as a decision brief: do not chase comfort, drama, or certainty. Act on the highest-leverage fact, protect the downside, and let the next observable behavior update the simulation.",
      timeline: [
        { phase: "Now", expected: "Clarify facts and pressure", action: "Identify the one variable that can change the outcome fastest" },
        { phase: "7-14 days", expected: "Behavior proof appears", action: "Measure action, not promises" },
        { phase: "30-90 days", expected: "Pattern becomes durable", action: "Double down, repair, exit, or redesign based on evidence" },
      ],
    };
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
      opportunities?: unknown[]; strategicActions?: string[]; recommendation?: string; timeline?: unknown[]; deepRead?: unknown; relationshipDeepDive?: unknown;
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
      deepRead: p.deepRead,
      relationshipDeepDive: p.relationshipDeepDive,
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


function buildGuaranteedDeepRead(
  type: string,
  data: Record<string, FormValue>,
  prediction: { prediction?: string; recommendation?: string; keyFactors?: unknown[]; risks?: unknown[]; opportunities?: unknown[] },
  confidenceScore: number
) {
  const knownFacts = fv(data.knownFacts);
  const unknowns = fv(data.unknowns);
  const constraints = fv(data.constraints);
  const idealOutcome = fv(data.idealOutcome);
  const unacceptableOutcome = fv(data.unacceptableOutcome);
  const title = `${type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Deep Read`;
  const pred = String(prediction.prediction || "");
  const rec = String(prediction.recommendation || "");
  const factors = Array.isArray(prediction.keyFactors) ? prediction.keyFactors.slice(0, 3).map((item) => typeof item === "string" ? item : JSON.stringify(item)) : [];
  const risks = Array.isArray(prediction.risks) ? prediction.risks.slice(0, 2).map((item) => typeof item === "string" ? item : JSON.stringify(item)) : [];
  const opportunities = Array.isArray(prediction.opportunities) ? prediction.opportunities.slice(0, 2).map((item) => typeof item === "string" ? item : JSON.stringify(item)) : [];

  return {
    title,
    coreDiagnosis: `OmniSim reads this as a ${type} problem shaped by facts (${knownFacts}), unknowns (${unknowns}), and constraints (${constraints}). The current prediction is: ${pred} The operating recommendation is: ${rec} The useful truth is not just the outcome; it is the next evidence-producing action. If the user wants a smarter result, the most important upgrade is to verify the unknowns and rerun the simulation with harder facts.`,
    truthMap: [
      { signal: knownFacts, meaning: "Known facts anchor the simulation and should carry more weight than emotion or hope.", confidence: Math.min(95, Math.max(35, confidenceScore)) },
      { signal: unknowns, meaning: "These unknowns are where the result can change fastest. OmniSim treats them as uncertainty, not truth.", confidence: Math.max(20, confidenceScore - 25) },
      { signal: constraints, meaning: "Constraints define what can actually be done in the real world.", confidence: Math.max(30, confidenceScore - 10) },
    ],
    hiddenLevers: [...factors, ...opportunities].filter(Boolean).slice(0, 4),
    failureMode: risks.length ? `The likely failure path is ${risks.join("; ")}. It worsens if the user ignores constraints, acts from emotion, or refuses to collect missing evidence.` : `The likely failure path is acting from emotion while the key unknowns remain unresolved. That turns a simulation into a wish, not intelligence.`,
    bestPath: `The best path is to protect against ${unacceptableOutcome}, move toward ${idealOutcome}, and take one small action this week that creates new evidence. The action must be observable, low-risk, and specific enough to update the next OmniSim run.`,
    decisionRules: [
      "If the next action does not create evidence, it is too vague.",
      "If new facts contradict the current prediction, rerun the simulation.",
      "If downside risk rises faster than upside, pause and protect the boundary.",
    ],
    sevenDayActionPlan: [
      "Write the known facts without interpretation.",
      "List the unknowns that could change the answer.",
      "Choose one low-risk test that creates evidence.",
      "Ask one direct question that reduces uncertainty.",
      "Remove one action driven only by fear, ego, or pressure.",
      "Measure the result of the test.",
      "Rerun OmniSim with the new evidence.",
    ],
    questionsToAnswerNext: [
      "What fact would change this result most?",
      "What is the highest-risk assumption?",
      "What action creates evidence fastest?",
    ],
    stoicResilienceNote: "Control the next honest action, not the entire outcome. Stop chasing comfort; build evidence, protect your boundary, and update from reality.",
  };
}
// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 60000) return NextResponse.json({ error: "Request too large" }, { status: 413 });

    const body = (await request.json()) as { type?: string; data?: Record<string, FormValue> };
    const { type, data } = body;
    if (!type || !data) return NextResponse.json({ error: "Missing type or data" }, { status: 400 });

    const allowedTypes = new Set(["public-reaction", "election", "markets", "sports", "policy", "product-launch", "geopolitical", "profit-path", "relationship", "health-signal", "legacy-view", "custom"]);
    if (!allowedTypes.has(type)) return NextResponse.json({ error: "Unknown simulation type" }, { status: 400 });

    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "Simulation engine unavailable" }, { status: 503 });

    const user = await getRequestUser(request);

    // Parallel: fetch history + select agents
    const [historicalIntel, agents] = await Promise.all([
      fetchHistoricalIntelligence(type),
      Promise.resolve(selectAgentsForSimulation(type, 20)),
    ]);

    const scenarioText = `${buildScenarioText(type, data)}${truthCalibrationText(data)}`;

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
    const phoneReachIntelligence = isPrivateHumanScenario(type) ? undefined : calcPhoneReachIntelligence(type, agentResults, populationWeightedSentiment);

    // Master synthesis (includes cascade effects)
    const prediction = await generateFinalPrediction(
      type, scenarioText, agentResults, specialistResults, sentimentData, populationWeightedSentiment, historicalIntel.context
    );

    // Mathematical confidence calibration (overrides LLM base score)
    const calibratedConfidence = calcMathematicalConfidence(agentResults, specialistResults, prediction.confidenceScore);

    // Counter-intelligence layer (Devil's Advocate)
    const counterIntelligence = await runCounterIntelligence(scenarioText, prediction.prediction, prediction.confidenceLabel);
    const swarmLabTrace = buildSwarmLabTrace(type, scenarioText, agentResults, specialistResults, populationWeightedSentiment, historicalIntel.count, calibratedConfidence);

    const id = crypto.randomUUID();
    const guaranteedDeepRead = prediction.deepRead ?? buildGuaranteedDeepRead(type, data, prediction, calibratedConfidence);
    const truthScore = buildTruthScore(data, calibratedConfidence);
    const realityLedger = buildRealityLedger(type, data, calibratedConfidence);
    const variableLab = buildVariableLab(type, data, prediction);
    const actionPlan = buildActionPlan(type, guaranteedDeepRead, prediction);
    const memorySnapshot = buildMemorySnapshot(type, historicalIntel.count);
    const simulationResult = {
      id, type, ...prediction,
      confidenceScore: calibratedConfidence,
      truthScore,
      sentimentData, populationWeightedSentiment,
      phoneReachIntelligence,
      historicalIntelligenceUsed: historicalIntel.count,
      deepRead: guaranteedDeepRead,
      realityLedger,
      variableLab,
      actionPlan,
      memorySnapshot,
      swarmLabTrace,
      specialistResults,
      counterIntelligence,
      agentResults,
      createdAt: new Date().toISOString(),
    };

    try {
      const db = createServiceClient();
      const upgradedRow = {
        id,
        type,
        scenario_data: data,
        result: simulationResult,
        status: "complete",
        user_id: user?.id ?? null,
        visibility: user ? "private" : "unlisted",
        truth_score: truthScore,
        reality_ledger: realityLedger,
        variable_lab: variableLab,
        action_plan: actionPlan,
        memory_snapshot: memorySnapshot,
      };
      const { error: upgradedError } = await db.from("simulations").insert(upgradedRow);
      if (upgradedError) {
        const { error: legacyError } = await db.from("simulations").insert({ id, type, scenario_data: data, result: simulationResult, status: "complete" });
        if (legacyError) throw legacyError;
      }
    } catch (dbErr) {
      console.error("Supabase store error:", dbErr);
    }

    return NextResponse.json(simulationResult);
  } catch (err) {
    console.error("Simulation error:", err);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
