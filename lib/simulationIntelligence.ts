type FormValue = string | string[];

function valueText(value: FormValue | undefined): string {
  if (!value) return "Not specified";
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : value;
}

function truthCheckAnswers(data: Record<string, FormValue>): string[] {
  try {
    const raw = valueText(data.__truthStageChecks);
    const parsed = JSON.parse(raw) as Array<{ answer?: string }>;
    return parsed.map((item) => item.answer || "unknown");
  } catch {
    return [];
  }
}

function countFilled(data: Record<string, FormValue>, keys: string[]): number {
  return keys.filter((key) => valueText(data[key]).trim() && valueText(data[key]) !== "Not specified").length;
}

export function buildTruthScore(data: Record<string, FormValue>, confidenceScore: number): number {
  const anchors = countFilled(data, ["knownFacts", "evidenceQuality", "constraints", "idealOutcome", "unacceptableOutcome"]);
  const unknowns = valueText(data.unknowns);
  const checks = truthCheckAnswers(data);
  const trueChecks = checks.filter((answer) => answer === "true").length;
  const unknownChecks = checks.filter((answer) => answer === "unknown").length;
  let score = Math.round(confidenceScore * 0.45 + anchors * 8 + trueChecks * 10 - unknownChecks * 6);
  if (!unknowns || unknowns === "Not specified") score -= 8;
  return Math.max(18, Math.min(96, score));
}

export function buildRealityLedger(type: string, data: Record<string, FormValue>, confidenceScore: number) {
  const truthScore = buildTruthScore(data, confidenceScore);
  const missing = [
    ["knownFacts", "measured facts"],
    ["unknowns", "known unknowns"],
    ["evidenceQuality", "evidence quality"],
    ["constraints", "real-world constraints"],
    ["unacceptableOutcome", "downside boundary"],
  ].filter(([key]) => valueText(data[key]) === "Not specified").map(([, label]) => label);

  return {
    scenarioClass: type,
    truthScore,
    knownFacts: valueText(data.knownFacts),
    unknowns: valueText(data.unknowns),
    constraints: valueText(data.constraints),
    evidenceQuality: valueText(data.evidenceQuality),
    idealOutcome: valueText(data.idealOutcome),
    downsideBoundary: valueText(data.unacceptableOutcome),
    missingData: missing,
    calibration: truthCheckAnswers(data),
    operatingRule: truthScore >= 75
      ? "Good evidence base. Act, measure, and update from reality."
      : truthScore >= 50
        ? "Usable draft. Verify weak assumptions before high-stakes action."
        : "Exploratory only. Gather facts before trusting the direction.",
  };
}

export function buildVariableLab(type: string, data: Record<string, FormValue>, prediction: { keyFactors?: unknown[]; risks?: unknown[]; opportunities?: unknown[] }) {
  const base = [
    { variable: "Evidence quality", current: valueText(data.evidenceQuality), improveBy: "Replace opinion with dated facts, receipts, metrics, or direct observation.", expectedEffect: "Raises confidence and reduces false-positive outcomes." },
    { variable: "Timing pressure", current: valueText(data.timeline) || "Not specified", improveBy: "Slow the decision into a reversible next action where possible.", expectedEffect: "Reduces panic decisions and exposes the real constraint." },
    { variable: "Downside boundary", current: valueText(data.unacceptableOutcome), improveBy: "Define the exact line that stops the experiment.", expectedEffect: "Prevents sunk-cost behavior and protects resilience." },
  ];

  const byType: Record<string, Array<{ variable: string; current: string; improveBy: string; expectedEffect: string }>> = {
    relationship: [
      { variable: "Trust proof", current: valueText(data.trustLevel), improveBy: "Ask for one observable repair behavior, not a promise.", expectedEffect: "Shows whether repair is real or only emotional relief." },
      { variable: "Conflict loop", current: valueText(data.conflictPattern), improveBy: "Interrupt the first repeated trigger for seven days.", expectedEffect: "Tests whether both people can change the pattern." },
    ],
    "profit-path": [
      { variable: "Offer-market fit", current: valueText(data.currentSkills), improveBy: "Sell one narrow service to one reachable buyer segment before buying tools.", expectedEffect: "Creates cash-flow proof before reinvestment." },
      { variable: "Capital protection", current: "$1,000 starting constraint", improveBy: "Cap experiments, track spend weekly, and avoid leverage or guaranteed-profit claims.", expectedEffect: "Keeps the user alive long enough to learn." },
    ],
    election: [
      { variable: "Turnout", current: valueText(data.turnout), improveBy: "Separate persuasion from turnout and model each voter bloc independently.", expectedEffect: "Makes the result less generic and more campaign-useful." },
      { variable: "Swing blocs", current: valueText(data.swingVoters), improveBy: "Name the bloc, region, motivation, and barrier.", expectedEffect: "Finds the voters who can actually change the outcome." },
    ],
    "health-signal": [
      { variable: "Clinical measurements", current: valueText(data.vitals), improveBy: "Add vitals, duration, medications, allergies, and clinician test results.", expectedEffect: "Improves triage quality without pretending to diagnose." },
    ],
  };

  const factors = Array.isArray(prediction.keyFactors) ? prediction.keyFactors.slice(0, 2).map((item) => ({
    variable: "Model factor",
    current: typeof item === "string" ? item : JSON.stringify(item),
    improveBy: "Pressure-test this factor with one real-world observation.",
    expectedEffect: "Confirms whether the model is reading the dominant force correctly.",
  })) : [];

  return [...(byType[type] || []), ...base, ...factors].slice(0, 7);
}

export function buildActionPlan(type: string, deepRead: { sevenDayActionPlan?: string[] } | undefined, prediction: { strategicActions?: string[]; recommendation?: string }) {
  const steps = deepRead?.sevenDayActionPlan?.length ? deepRead.sevenDayActionPlan : prediction.strategicActions?.length ? prediction.strategicActions : [
    "Write the facts without interpretation.",
    "Name the strongest unknown.",
    "Choose one reversible test.",
    "Measure the result.",
    "Rerun OmniSim with new evidence.",
  ];

  return {
    mode: type,
    nextSevenDays: steps.slice(0, 7),
    firstMove: steps[0] || prediction.recommendation || "Create one evidence-producing action.",
    stopRule: "Stop or reroute when downside risk crosses the boundary defined in the reality ledger.",
    updateRule: "Rerun when a new fact changes trust, money, timing, safety, reputation, health, or access.",
  };
}

export function buildMemorySnapshot(type: string, historicalCount: number) {
  return {
    priorSimulationsUsed: historicalCount,
    patternStatus: historicalCount > 0 ? "Compared against prior OmniSim memory for this scenario class." : "No prior memory found for this scenario class yet.",
    learningRule: "Every completed simulation should later be compared with actual outcome notes to improve future calibration.",
    scenarioClass: type,
  };
}