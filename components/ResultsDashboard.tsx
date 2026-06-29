"use client";
import { useState } from "react";

const NEON = "#00F5FF";
const PURPLE = "#BF00FF";
const PINK = "#FF0077";
const GREEN = "#00FF7F";
const GOLD = "#FFD700";

interface DeepReadTruth { signal: string; meaning: string; confidence: number; }
interface DeepRead {
  title?: string;
  coreDiagnosis?: string;
  truthMap?: DeepReadTruth[];
  hiddenLevers?: string[];
  failureMode?: string;
  bestPath?: string;
  decisionRules?: string[];
  sevenDayActionPlan?: string[];
  questionsToAnswerNext?: string[];
  stoicResilienceNote?: string;
}
interface RelationshipDeepDive {
  coreDiagnosis?: string;
  whatEachPersonMayFeel?: Array<{ side: string; likelyFeeling: string; protectiveStrategy: string; hiddenNeed: string }>;
  patternLoop?: string[];
  repairPlan?: Array<{ step: string; whyItMatters: string; timeframe: string; successSignal: string }>;
  breakdownPath?: string;
  conversationScript?: string[];
  sevenDayActionPlan?: string[];
  stoicResilienceNote?: string;
}
interface TimelinePhase { phase: string; events: string; }
interface ScenarioBranch { label: string; probability: number; description: string; trigger: string; }
interface KeyFactor { factor: string; impact: number; probability: number; explanation: string; }
interface RiskItem { risk: string; severity: "critical" | "high" | "medium" | "low"; probability: number; mitigation: string; }
interface OpportunityItem { opportunity: string; potential: "high" | "medium" | "low"; window: string; howToCapture: string; }

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
  personaSwarm: string[];
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

export interface AgentResult {
  agentId: string;
  agentName: string;
  location: string;
  age?: number;
  occupation?: string;
  politicalLeaning?: string;
  economicStatus?: string;
  mediaDiet?: string;
  values?: string[];
  sentiment: "positive" | "negative" | "neutral";
  intensity: number;
  reaction: string;
  likelyAction: string;
}

export interface SimulationResult {
  id: string;
  type: string;
  executiveSummary?: string;
  prediction: string;
  confidenceLabel: string;
  confidenceScore: number;
  confidenceReasoning?: string;
  cascadeEffects?: CascadeEffect[];
  scenarioBranches?: ScenarioBranch[];
  keyFactors: (string | KeyFactor)[];
  risks: (string | RiskItem)[];
  opportunities: (string | OpportunityItem)[];
  strategicActions?: string[];
  recommendation: string;
  timeline: string | TimelinePhase[];
  sentimentData: { positive: number; negative: number; neutral: number };
  agentResults: AgentResult[];
  createdAt: string;
  populationWeightedSentiment?: { positive: number; neutral: number; negative: number };
  historicalIntelligenceUsed?: number;
  specialistResults?: SpecialistResult[];
  counterIntelligence?: CounterIntelligence;
  phoneReachIntelligence?: PhoneReachIntelligence;
  swarmLabTrace?: SwarmLabTrace;
  deepRead?: DeepRead;
  relationshipDeepDive?: RelationshipDeepDive;
}

function isPrivateResult(type: string) { return ["relationship", "legacy-view", "health-signal"].includes(type); }
function textOf(item: string | { [key: string]: unknown }, primary: string) {
  return typeof item === "string" ? item : String(item[primary] ?? item.explanation ?? item.mitigation ?? item.howToCapture ?? "");
}
function buildFallbackDeepRead(result: SimulationResult): DeepRead {
  const factors = result.keyFactors.slice(0, 3).map((f) => textOf(f as string | { [key: string]: unknown }, "factor"));
  const risks = result.risks.slice(0, 2).map((r) => textOf(r as string | { [key: string]: unknown }, "risk"));
  const opportunities = result.opportunities.slice(0, 2).map((o) => textOf(o as string | { [key: string]: unknown }, "opportunity"));
  return {
    title: result.type === "relationship" ? "Relationship Pattern Deep Read" : "OmniSim Deep Read",
    coreDiagnosis: `${result.prediction} ${result.recommendation}`,
    truthMap: factors.map((factor, i) => ({ signal: factor || `Factor ${i + 1}`, meaning: "This is one of the strongest available signals in the current result. A better answer requires the missing facts from Truth Calibration.", confidence: Math.max(55, result.confidenceScore - i * 8) })),
    hiddenLevers: [...factors, ...opportunities].filter(Boolean).slice(0, 4),
    failureMode: risks.length ? `The most likely failure path is driven by ${risks.join(", ")}. If the user does not change behavior, gather missing facts, or set boundaries, the result will drift toward the highest-probability risk instead of the stated ideal outcome.` : "The failure path comes from acting without enough truth, ignoring constraints, or confusing hope with evidence.",
    bestPath: opportunities.length ? `The best path is to focus on ${opportunities.join(", ")} while protecting against the highest risks. The next move should be small, observable, and measurable within seven days.` : "The best path is to turn the strongest signal into one measurable action, then update the simulation with what happens.",
    decisionRules: ["If new evidence contradicts the current assumption, rerun the simulation.", "If risk rises faster than trust or upside, pause and protect downside.", "If the next action cannot be measured within seven days, make it smaller.", "If emotion and evidence disagree, obey evidence first."],
    sevenDayActionPlan: ["Write the facts and unknowns without interpretation.", "Identify the one constraint that most limits success.", "Take one low-risk action that produces new evidence.", "Watch for the first confirmation or disconfirmation signal.", "Remove one behavior that increases risk.", "Ask one direct question that reduces uncertainty.", "Rerun OmniSim with the new evidence."],
    questionsToAnswerNext: ["What fact would change this answer most?", "What is the highest-risk assumption?", "What action creates evidence fastest?", "What boundary protects the downside?"],
    stoicResilienceNote: "Control the next honest action, not the whole outcome. Stop chasing certainty; build evidence, protect your standards, and update from reality."
  };
}
function sCol(s: string) { return s === "positive" ? GREEN : s === "negative" ? PINK : NEON; }
function sevCol(s: string) { return s === "critical" ? PINK : s === "high" ? "#FF6B35" : s === "medium" ? GOLD : NEON; }
function potCol(p: string) { return p === "high" ? GREEN : p === "medium" ? NEON : GOLD; }
function ccCol(n: number) { return n >= 75 ? GREEN : n >= 50 ? NEON : n >= 30 ? GOLD : PINK; }
function domainCol(d: string) {
  if (d === "economic") return NEON;
  if (d === "political") return PURPLE;
  if (d === "social") return GREEN;
  if (d === "military") return PINK;
  if (d === "media") return GOLD;
  return NEON;
}

export function ResultsDashboard({ result }: { result: SimulationResult }) {
  const [tab, setTab] = useState<"overview" | "agents" | "factors">("overview");
  const [agentFilter, setAgentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");

  const cc = ccCol(result.confidenceScore);
  const pos = result.agentResults.filter((a) => a.sentiment === "positive").length;
  const neg = result.agentResults.filter((a) => a.sentiment === "negative").length;
  const neu = result.agentResults.filter((a) => a.sentiment === "neutral").length;
  const avgInt = result.agentResults.length > 0
    ? (result.agentResults.reduce((s, a) => s + a.intensity, 0) / result.agentResults.length).toFixed(1)
    : "0";
  const filtered = agentFilter === "all" ? result.agentResults : result.agentResults.filter((a) => a.sentiment === agentFilter);
  const phases = Array.isArray(result.timeline) ? (result.timeline as TimelinePhase[]) : null;
  const timelineStr = typeof result.timeline === "string" ? result.timeline : null;
  const pwSent = result.populationWeightedSentiment;
  const specialists = result.specialistResults ?? [];
  const cascades = (result.cascadeEffects ?? []) as CascadeEffect[];
  const counterIntel = result.counterIntelligence;
  const phoneReach = result.phoneReachIntelligence;
  const deepRead = result.deepRead ?? buildFallbackDeepRead(result);
  const relDeep = result.relationshipDeepDive;

  return (
    <div>
      {/* ── CONFIDENCE BANNER ── */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: `linear-gradient(135deg,${cc}0F,${cc}05)`, border: `1px solid ${cc}44`, boxShadow: `0 0 48px ${cc}15` }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color: cc }}>OMNISIM Intelligence Assessment · Real Deal v2</p>
            <div className="flex items-end gap-4">
              <span className="text-6xl font-black font-mono leading-none" style={{ color: cc, textShadow: `0 0 24px ${cc}` }}>{result.confidenceScore}%</span>
              <div>
                <p className="font-bold text-base text-white tracking-wide">{result.confidenceLabel}</p>
                {result.confidenceReasoning && (
                  <p className="text-xs mt-1 leading-5 max-w-md" style={{ color: "rgba(255,255,255,0.55)" }}>{result.confidenceReasoning}</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-52 shrink-0 space-y-3">
            <div>
              <div className="flex justify-between text-[9px] font-mono mb-1">
                <span style={{ color: GREEN }}>+{result.sentimentData.positive}% positive</span>
                <span style={{ color: NEON }}>{result.sentimentData.neutral}% neutral</span>
                <span style={{ color: PINK }}>{result.sentimentData.negative}% neg</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div style={{ width: `${result.sentimentData.positive}%`, background: GREEN }} />
                <div style={{ width: `${result.sentimentData.neutral}%`, background: NEON }} />
                <div style={{ width: `${result.sentimentData.negative}%`, background: PINK }} />
              </div>
              <p className="text-[9px] mt-1 font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>Agent sentiment · {result.agentResults.length} agents · avg {avgInt}/10</p>
            </div>
            {pwSent && (
              <div>
                <div className="flex justify-between text-[9px] font-mono mb-1">
                  <span style={{ color: GREEN }}>+{pwSent.positive}%</span>
                  <span style={{ color: NEON }}>{pwSent.neutral}%</span>
                  <span style={{ color: PINK }}>{pwSent.negative}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden flex" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ width: `${pwSent.positive}%`, background: `${GREEN}99` }} />
                  <div style={{ width: `${pwSent.neutral}%`, background: `${NEON}99` }} />
                  <div style={{ width: `${pwSent.negative}%`, background: `${PINK}99` }} />
                </div>
                <p className="text-[9px] mt-1 font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{isPrivateResult(result.type) ? "Pattern-weighted private signal" : "Population-weighted (8.1B humans)"}</p>
              </div>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              {result.historicalIntelligenceUsed != null && result.historicalIntelligenceUsed > 0 && (
                <p className="text-[9px] font-mono" style={{ color: PURPLE }}>&#9670; {result.historicalIntelligenceUsed} prior simulations in memory</p>
              )}
              {specialists.length > 0 && (
                <p className="text-[9px] font-mono" style={{ color: GOLD }}>&#9733; {specialists.length} specialist analysts</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-0 mb-6 border-b" style={{ borderColor: "rgba(15,23,42,0.14)" }}>
        {(["overview", "agents", "factors"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] border-b-2 -mb-px transition-all"
            style={tab === t ? { color: "#070A12", borderColor: "#315FAE", background: "rgba(49,95,174,0.10)" } : { color: "#1E293B", borderColor: "transparent", background: "rgba(255,255,255,0.62)" }}>
            {t === "overview" ? "Intelligence Brief" : t === "agents" ? `Field Agents (${result.agentResults.length})` : "Risk & Factor Matrix"}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {tab === "overview" && (
        <div className="space-y-5">

          {/* Executive Summary */}
          {result.executiveSummary && (
            <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${NEON}18` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full" style={{ background: NEON }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}>Executive Intelligence Summary</p>
              </div>
              {result.executiveSummary.split("\n\n").map((para, i) => (
                <p key={i} className={`text-sm leading-8 ${i > 0 ? "mt-5" : ""}`} style={{ color: "rgba(255,255,255,0.82)" }}>{para}</p>
              ))}
            </div>
          )}



          {/* Phone Reach Intelligence */}
          {phoneReach && (
            <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${GREEN}24`, boxShadow: `0 0 28px ${GREEN}08` }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full" style={{ background: GREEN }} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GREEN }}>Phone Reach Intelligence</p>
                    <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Real-life spread model: smartphone feeds, basic phones, active online users, and offline delay.</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full" style={{ background: `${GREEN}12`, color: GREEN, border: `1px solid ${GREEN}33` }}>
                  {phoneReach.likelyAmplification} amplification
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
                {[
                  ["Online Humans", `${phoneReach.internetUsers}M`, `${phoneReach.digitalReachShare}% of world`],
                  ["Smartphone Reach", `${phoneReach.smartphoneReach}M`, `${phoneReach.smartphoneShareOfMobile}% of mobile`],
                  ["Basic/SMS Phones", `${phoneReach.basicPhoneReach}M`, `${phoneReach.smsReachShare}% of world`],
                  ["Offline Humans", `${phoneReach.offlinePopulation}M`, `${phoneReach.offlineShare}% delayed reach`],
                ].map(([label, value, sub]) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: `${GREEN}07`, border: `1px solid ${GREEN}18` }}>
                    <p className="text-[8px] uppercase tracking-[0.2em] mb-2 font-black" style={{ color: "#40516D" }}>{label}</p>
                    <p className="text-2xl font-black font-mono" style={{ color: GREEN, textShadow: `0 0 10px ${GREEN}55` }}>{value}</p>
                    <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.42)" }}>{sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3 mb-5">
                {[
                  ["Active Online Now", `${phoneReach.estimatedActiveOnlineNow}M`, NEON],
                  ["Smartphone Active Now", `${phoneReach.smartphoneActiveNow}M`, GREEN],
                  ["Basic Phone Active Now", `${phoneReach.basicPhoneActiveNow}M`, GOLD],
                ].map(([label, value, color]) => (
                  <div key={label} className="rounded-xl p-4" style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
                    <p className="text-[8px] uppercase tracking-[0.2em] mb-2 font-black" style={{ color }}>{label}</p>
                    <p className="text-xl font-black font-mono" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.78)" }}>{phoneReach.reachNarrative}</p>
                <p className="text-xs leading-6 mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>{phoneReach.offlineReachDelay}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl p-4" style={{ background: `${NEON}08`, border: `1px solid ${NEON}22` }}>
                  <p className="text-[8px] uppercase tracking-[0.2em] mb-2 font-black" style={{ color: NEON }}>Estimated First Hour Reach</p>
                  <p className="text-3xl font-black font-mono" style={{ color: NEON }}>{phoneReach.firstHourReach}M</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}22` }}>
                  <p className="text-[8px] uppercase tracking-[0.2em] mb-2 font-black" style={{ color: PURPLE }}>Estimated First Day Reach</p>
                  <p className="text-3xl font-black font-mono" style={{ color: PURPLE }}>{phoneReach.firstDayReach}M</p>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.38)" }}>Model assumptions</summary>
                <ul className="mt-3 space-y-2">
                  {phoneReach.assumptions.map((assumption, i) => (
                    <li key={i} className="text-[11px] leading-5" style={{ color: "rgba(255,255,255,0.45)" }}>{assumption}</li>
                  ))}
                </ul>
              </details>
            </div>
          )}
          {/* Expert Panel — 5 Specialists */}
          {specialists.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: GOLD }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Expert Panel — Domain Specialists</p>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}33` }}>{specialists.length} analysts</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {specialists.map((s) => {
                  const sc = s.color;
                  const mod = s.confidenceModifier;
                  return (
                    <div key={s.specialistId} className="rounded-xl p-4" style={{ background: "#0D0B1A", border: `1px solid ${sc}28`, boxShadow: `0 0 16px ${sc}08` }}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <p className="font-black text-white text-sm">{s.name}</p>
                          <p className="text-[9px] uppercase tracking-[0.18em] mt-0.5" style={{ color: sc }}>{s.domain}</p>
                        </div>
                        <span className="text-[10px] font-black font-mono px-2 py-1 rounded shrink-0" style={{ background: `${mod >= 0 ? GREEN : PINK}18`, color: mod >= 0 ? GREEN : PINK, border: `1px solid ${mod >= 0 ? GREEN : PINK}33` }}>
                          {mod >= 0 ? "+" : ""}{mod}
                        </span>
                      </div>
                      <p className="text-xs leading-6 mb-3" style={{ color: "rgba(255,255,255,0.72)" }}>{s.analysis}</p>
                      <div className="space-y-2">
                        <div className="rounded-lg px-3 py-2" style={{ background: `${sc}0A`, border: `1px solid ${sc}1E` }}>
                          <p className="text-[8px] uppercase tracking-[0.18em] mb-0.5 font-black" style={{ color: sc }}>Key Insight</p>
                          <p className="text-[10px] leading-5" style={{ color: "rgba(255,255,255,0.78)" }}>{s.keyInsight}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg px-2 py-1.5" style={{ background: `${PINK}08`, border: `1px solid ${PINK}18` }}>
                            <p className="text-[7px] uppercase tracking-wider mb-0.5 font-black" style={{ color: PINK }}>Risk</p>
                            <p className="text-[9px] leading-4" style={{ color: "rgba(255,255,255,0.6)" }}>{s.riskFlag}</p>
                          </div>
                          <div className="rounded-lg px-2 py-1.5" style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}18` }}>
                            <p className="text-[7px] uppercase tracking-wider mb-0.5 font-black" style={{ color: GREEN }}>Opportunity</p>
                            <p className="text-[9px] leading-4" style={{ color: "rgba(255,255,255,0.6)" }}>{s.opportunityFlag}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Primary Prediction */}
          <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${PURPLE}28` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ background: PURPLE }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: PURPLE }}>Primary Prediction</p>
            </div>
            <p className="text-base leading-9" style={{ color: "rgba(255,255,255,0.9)" }}>{result.prediction}</p>
          </div>

          {/* Cascade Effects Chain */}
          {cascades.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${NEON}14` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-full" style={{ background: NEON }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}>Cascade Effect Chain</p>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${NEON}12`, color: `${NEON}BB`, border: `1px solid ${NEON}28` }}>{cascades.length} orders deep</span>
              </div>
              <div className="space-y-0">
                {cascades.map((ce, i) => {
                  const dc = domainCol(ce.domain);
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black" style={{ background: `${dc}18`, color: dc, border: `1px solid ${dc}44`, boxShadow: `0 0 12px ${dc}22` }}>{ce.step}</div>
                        {i < cascades.length - 1 && (
                          <div className="flex flex-col items-center py-1" style={{ minHeight: "2rem" }}>
                            <div className="w-px flex-1" style={{ background: `linear-gradient(to bottom,${dc}44,${domainCol(cascades[i + 1].domain)}44)` }} />
                            <span className="text-[8px] font-black" style={{ color: "rgba(255,255,255,0.2)" }}>&#8595;</span>
                          </div>
                        )}
                      </div>
                      <div className="pb-4 flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h4 className="font-black text-white text-sm">{ce.title}</h4>
                          <span className="text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold" style={{ background: `${dc}12`, color: dc, border: `1px solid ${dc}28` }}>{ce.domain}</span>
                          <span className="text-[8px] font-mono ml-auto" style={{ color: "rgba(255,255,255,0.35)" }}>{ce.timeframe}</span>
                        </div>
                        <p className="text-sm leading-7 mb-2" style={{ color: "rgba(255,255,255,0.72)" }}>{ce.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full" style={{ width: `${ce.probability}%`, background: dc, boxShadow: `0 0 6px ${dc}` }} />
                          </div>
                          <span className="text-[9px] font-mono shrink-0" style={{ color: dc }}>{ce.probability}% prob.</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scenario Probability Matrix */}
          {result.scenarioBranches && result.scenarioBranches.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: GOLD }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Scenario Probability Matrix</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {result.scenarioBranches.map((b) => {
                  const bc = b.label.includes("Most") ? GREEN : b.label.includes("Black") ? PINK : GOLD;
                  return (
                    <div key={b.label} className="rounded-xl p-5" style={{ background: "#0D0B1A", border: `1px solid ${bc}33` }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: bc }}>{b.label}</span>
                        <span className="text-3xl font-black font-mono" style={{ color: bc, textShadow: `0 0 12px ${bc}` }}>{b.probability}%</span>
                      </div>
                      <div className="h-1 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full" style={{ width: `${b.probability}%`, background: bc, boxShadow: `0 0 6px ${bc}` }} />
                      </div>
                      <p className="text-xs leading-6 mb-3" style={{ color: "rgba(255,255,255,0.78)" }}>{b.description}</p>
                      <div className="rounded-lg px-3 py-2" style={{ background: `${bc}0C`, border: `1px solid ${bc}22` }}>
                        <p className="text-[8px] uppercase tracking-[0.2em] mb-1 font-black" style={{ color: bc }}>Trigger Condition</p>
                        <p className="text-[10px] leading-5" style={{ color: "rgba(255,255,255,0.58)" }}>{b.trigger}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strategic Timeline */}
          {phases && phases.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${NEON}14` }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-full" style={{ background: NEON }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}>Strategic Timeline</p>
              </div>
              <div className="space-y-0">
                {phases.map((ph, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: NEON, boxShadow: `0 0 10px ${NEON}` }} />
                      {i < phases.length - 1 && <div className="w-px mt-1 mb-0" style={{ background: `${NEON}28`, minHeight: "2.5rem", flex: 1 }} />}
                    </div>
                    <div className="pb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-1" style={{ color: NEON }}>{ph.phase}</p>
                      <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.72)" }}>{ph.events}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {timelineStr && (
            <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${NEON}14` }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: NEON }}>Timeline</p>
              <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.72)" }}>{timelineStr}</p>
            </div>
          )}

          {/* Strategic Directives */}
          {result.strategicActions && result.strategicActions.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#0D0B1A", border: `1px solid ${GREEN}1E` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: GREEN }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GREEN }}>Strategic Directives</p>
              </div>
              <div className="space-y-3">
                {result.strategicActions.map((action, i) => (
                  <div key={i} className="flex gap-4 items-start rounded-xl px-4 py-3" style={{ background: `${GREEN}07`, border: `1px solid ${GREEN}18` }}>
                    <span className="text-sm font-black font-mono shrink-0 mt-0.5" style={{ color: GREEN }}>{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.85)" }}>{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devil's Advocate — Counter-Intelligence */}
          {counterIntel && (
            <div className="rounded-2xl p-6" style={{ background: `${PINK}08`, border: `1px solid ${PINK}30` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: PINK }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: PINK }}>Devil&apos;s Advocate — Counter-Intelligence Layer</p>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${PINK}18`, color: PINK, border: `1px solid ${PINK}33` }}>CHALLENGE MODE</span>
              </div>
              <div className="space-y-3 mb-5">
                {counterIntel.challenges.map((c, i) => (
                  <div key={i} className="flex gap-3 items-start rounded-xl px-4 py-3" style={{ background: `${PINK}0A`, border: `1px solid ${PINK}22` }}>
                    <span className="text-xs font-black font-mono shrink-0 mt-0.5" style={{ color: PINK }}>C{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.82)" }}>{c}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl p-4" style={{ background: "#0D0B1A", border: `1px solid ${PINK}22` }}>
                  <p className="text-[8px] uppercase tracking-[0.2em] mb-2 font-black" style={{ color: PINK }}>Missed Variable</p>
                  <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.78)" }}>{counterIntel.missedFactor}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "#0D0B1A", border: `1px solid ${PINK}22` }}>
                  <p className="text-[8px] uppercase tracking-[0.2em] mb-2 font-black" style={{ color: PINK }}>Flip Scenario</p>
                  <p className="text-sm leading-6" style={{ color: "rgba(255,255,255,0.78)" }}>{counterIntel.flipScenario}</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="rounded-2xl p-6" style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}30` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: PURPLE }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: PURPLE }}>Strategic Recommendation</p>
            </div>
            <p className="text-sm leading-8" style={{ color: "rgba(255,255,255,0.85)" }}>{result.recommendation}</p>
          </div>
        </div>
      )}

      {/* ══ AGENTS ══ */}
      {tab === "agents" && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {([{ label: "Positive", count: pos, color: GREEN }, { label: "Neutral", count: neu, color: NEON }, { label: "Negative", count: neg, color: PINK }, { label: "Avg Intensity", count: avgInt, color: GOLD, suffix: "/10" }] as {label:string;count:string|number;color:string;suffix?:string}[]).map(({ label, count, color, suffix }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: "#0D0B1A", border: `1px solid ${color}22` }}>
                <p className="text-2xl font-black font-mono" style={{ color }}>{count}{suffix}</p>
                <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: "#40516D" }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            {(["all", "positive", "neutral", "negative"] as const).map((f) => {
              const fc = f === "positive" ? GREEN : f === "negative" ? PINK : f === "neutral" ? NEON : "#315FAE";
              const cnt = f === "all" ? result.agentResults.length : f === "positive" ? pos : f === "negative" ? neg : neu;
              return (
                <button key={f} onClick={() => setAgentFilter(f)}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all"
                  style={agentFilter === f
                    ? { background: `${fc}1E`, color: fc, border: `1px solid ${fc}55` }
                    : { background: "rgba(255,255,255,0.92)", color: "#1E293B", border: "1px solid rgba(15,23,42,0.22)" }}>
                  {f === "all" ? `All (${cnt})` : `${f} (${cnt})`}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((agent, i) => {
              const col = sCol(agent.sentiment);
              return (
                <div key={agent.agentId} className="rounded-xl p-5" style={{ background: "#0D0B1A", border: `1px solid ${col}28`, boxShadow: `0 0 20px ${col}08` }}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0" style={{ background: `${col}1A`, color: col, border: `1px solid ${col}44` }}>{i + 1}</span>
                        <h4 className="font-bold text-white text-sm">{agent.agentName}</h4>
                      </div>
                      <p className="text-[11px] pl-8" style={{ color: "rgba(255,255,255,0.42)" }}>
                        {agent.location}{agent.age ? ` · ${agent.age}yr` : ""}{agent.occupation ? ` · ${agent.occupation}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-[8px] font-black uppercase px-2 py-0.5 rounded mb-1" style={{ background: `${col}1A`, color: col, border: `1px solid ${col}33` }}>{agent.sentiment}</span>
                      <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.38)" }}>{agent.intensity}/10</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {agent.politicalLeaning && <span className="text-[8px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${PURPLE}12`, color: PURPLE, border: `1px solid ${PURPLE}28` }}>{agent.politicalLeaning}</span>}
                    {agent.economicStatus && <span className="text-[8px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.48)" }}>{agent.economicStatus}</span>}
                    {agent.mediaDiet && <span className="text-[8px] px-2 py-0.5 rounded-full" style={{ background: `${NEON}0A`, color: `${NEON}BB` }}>{agent.mediaDiet}</span>}
                  </div>

                  {agent.values && agent.values.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.values.slice(0, 5).map((v) => (
                        <span key={v} className="text-[8px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>{v}</span>
                      ))}
                    </div>
                  )}

                  <div className="h-px mb-4" style={{ background: `linear-gradient(to right,${col}28,transparent)` }} />

                  <blockquote className="text-sm leading-7 italic mb-4" style={{ color: "rgba(255,255,255,0.82)" }}>
                    &ldquo;{agent.reaction}&rdquo;
                  </blockquote>

                  <div className="rounded-lg px-3 py-2 mb-4" style={{ background: `${col}0A`, border: `1px solid ${col}1E` }}>
                    <p className="text-[8px] uppercase tracking-[0.2em] mb-1 font-black" style={{ color: col }}>Likely Action</p>
                    <p className="text-[11px] leading-5" style={{ color: "rgba(255,255,255,0.65)" }}>{agent.likelyAction}</p>
                  </div>

                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full" style={{ width: `${agent.intensity * 10}%`, background: `linear-gradient(to right,${col}55,${col})`, boxShadow: `0 0 6px ${col}` }} />
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && <p className="text-center py-10 text-sm" style={{ color: "#40516D" }}>No agents with this sentiment in the simulation.</p>}
        </div>
      )}

      {/* ══ FACTORS ══ */}
      {tab === "factors" && (
        <div className="space-y-10">

          {/* Key Factors */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: NEON }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: NEON }}>Key Driving Factors</p>
            </div>
            <div className="space-y-3">
              {result.keyFactors.map((f, i) => {
                if (typeof f === "string") return (
                  <div key={i} className="flex gap-4 items-center rounded-xl px-5 py-4" style={{ background: "#0D0B1A", border: `1px solid ${NEON}18` }}>
                    <span className="font-mono font-black text-sm shrink-0" style={{ color: NEON }}>F{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{f}</p>
                  </div>
                );
                const kf = f as KeyFactor;
                return (
                  <div key={i} className="rounded-xl p-5" style={{ background: "#0D0B1A", border: `1px solid ${NEON}18` }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-sm shrink-0" style={{ color: NEON }}>F{String(i + 1).padStart(2, "0")}</span>
                        <h4 className="font-bold text-white">{kf.factor}</h4>
                      </div>
                      <div className="flex gap-5 shrink-0">
                        <div className="text-right"><p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Impact</p><p className="font-mono font-black text-lg leading-none" style={{ color: NEON }}>{kf.impact}<span className="text-xs">/10</span></p></div>
                        <div className="text-right"><p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Prob.</p><p className="font-mono font-black text-lg leading-none" style={{ color: PURPLE }}>{kf.probability}<span className="text-xs">%</span></p></div>
                      </div>
                    </div>
                    <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${kf.impact * 10}%`, background: `linear-gradient(to right,${NEON}44,${NEON})`, boxShadow: `0 0 8px ${NEON}` }} />
                    </div>
                    <p className="text-sm leading-7" style={{ color: "rgba(255,255,255,0.65)" }}>{kf.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Intelligence */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: PINK }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: PINK }}>Risk Intelligence</p>
            </div>
            <div className="space-y-3">
              {result.risks.map((r, i) => {
                if (typeof r === "string") return (
                  <div key={i} className="flex gap-4 items-center rounded-xl px-5 py-4" style={{ background: "#0D0B1A", border: `1px solid ${PINK}22` }}>
                    <span style={{ color: PINK }}>&#9650;</span>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{r}</p>
                  </div>
                );
                const ri = r as RiskItem;
                const rc = sevCol(ri.severity);
                return (
                  <div key={i} className="rounded-xl p-5" style={{ background: "#0D0B1A", border: `1px solid ${rc}28` }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase px-2 py-1 rounded shrink-0" style={{ background: `${rc}1A`, color: rc, border: `1px solid ${rc}44` }}>{ri.severity}</span>
                        <h4 className="font-bold text-white">{ri.risk}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Probability</p>
                        <p className="font-mono font-black text-lg leading-none" style={{ color: rc }}>{ri.probability}<span className="text-xs">%</span></p>
                      </div>
                    </div>
                    <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${ri.probability}%`, background: rc }} />
                    </div>
                    <div className="rounded-lg px-3 py-2" style={{ background: `${rc}0A`, border: `1px solid ${rc}22` }}>
                      <p className="text-[8px] uppercase tracking-[0.15em] mb-1 font-black" style={{ color: rc }}>Mitigation Strategy</p>
                      <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.65)" }}>{ri.mitigation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Opportunity Landscape */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full" style={{ background: GREEN }} />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GREEN }}>Opportunity Landscape</p>
            </div>
            <div className="space-y-3">
              {result.opportunities.map((o, i) => {
                if (typeof o === "string") return (
                  <div key={i} className="flex gap-4 items-center rounded-xl px-5 py-4" style={{ background: "#0D0B1A", border: `1px solid ${GREEN}22` }}>
                    <span style={{ color: GREEN }}>&#9670;</span>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{o}</p>
                  </div>
                );
                const oi = o as OpportunityItem;
                const oc = potCol(oi.potential);
                return (
                  <div key={i} className="rounded-xl p-5" style={{ background: "#0D0B1A", border: `1px solid ${oc}28` }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase px-2 py-1 rounded shrink-0" style={{ background: `${oc}1A`, color: oc, border: `1px solid ${oc}44` }}>{oi.potential} potential</span>
                        <h4 className="font-bold text-white">{oi.opportunity}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[8px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Window</p>
                        <p className="text-xs font-mono font-bold" style={{ color: oc }}>{oi.window}</p>
                      </div>
                    </div>
                    <div className="rounded-lg px-3 py-2" style={{ background: `${oc}0A`, border: `1px solid ${oc}22` }}>
                      <p className="text-[8px] uppercase tracking-[0.15em] mb-1 font-black" style={{ color: oc }}>How to Capture</p>
                      <p className="text-xs leading-5" style={{ color: "rgba(255,255,255,0.65)" }}>{oi.howToCapture}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
