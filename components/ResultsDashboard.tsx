"use client";

import { useState } from "react";

interface AgentResult {
  agentId: string;
  agentName: string;
  location: string;
  sentiment: "positive" | "negative" | "neutral";
  intensity: number;
  reaction: string;
  likelyAction: string;
}

export interface SimulationResult {
  id: string;
  type: string;
  prediction: string;
  confidenceLabel: string;
  confidenceScore: number;
  keyFactors: string[];
  risks: string[];
  opportunities: string[];
  recommendation: string;
  timeline: string;
  sentimentData: {
    positive: number;
    negative: number;
    neutral: number;
  };
  agentResults: AgentResult[];
  createdAt: string;
}

interface ResultsDashboardProps {
  result: SimulationResult;
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "agents" | "factors">("overview");
  const { sentimentData, agentResults, prediction, confidenceLabel, keyFactors, risks, opportunities, recommendation, timeline } = result;

  const sentimentColor = {
    positive: "#00FF7F",
    negative: "#FF0077",
    neutral: "#00F5FF",
  };

  const confidenceGlow = {
    "HIGH CONFIDENCE": "0 0 30px rgba(0,255,127,0.4)",
    "MODERATE CONFIDENCE": "0 0 30px rgba(0,245,255,0.4)",
    "LOW CONFIDENCE": "0 0 30px rgba(255,0,119,0.4)",
    "VOLATILE — UNPREDICTABLE": "0 0 30px rgba(191,0,255,0.4)",
  };

  const confidenceTextColor = {
    "HIGH CONFIDENCE": "#00FF7F",
    "MODERATE CONFIDENCE": "#00F5FF",
    "LOW CONFIDENCE": "#FF0077",
    "VOLATILE — UNPREDICTABLE": "#BF00FF",
  };

  const glowColor = (confidenceGlow as Record<string, string>)[confidenceLabel] || confidenceGlow["MODERATE CONFIDENCE"];
  const textColor = (confidenceTextColor as Record<string, string>)[confidenceLabel] || "#00F5FF";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="section-label">SIMULATION COMPLETE</p>
        <h1 className="mt-4 font-orbitron text-4xl font-black text-white md:text-5xl">
          INTELLIGENCE REPORT
        </h1>
        <p className="mt-3 font-orbitron text-[9px] tracking-widest text-white/20">
          SIMULATION ID: {result.id.toUpperCase()}
        </p>
      </div>

      {/* Confidence Banner */}
      <div className="cyber-card mb-8 p-8 text-center">
        <p className="font-orbitron text-[9px] tracking-[0.5em] text-white/30">
          PREDICTION CONFIDENCE
        </p>
        <p
          className="mt-3 font-orbitron text-3xl font-black md:text-5xl"
          style={{ color: textColor, textShadow: glowColor }}
        >
          {confidenceLabel}
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/65">{prediction}</p>
      </div>

      {/* Sentiment breakdown */}
      <div className="cyber-card mb-8 p-6">
        <p className="mb-5 font-orbitron text-[9px] tracking-[0.45em] text-white/30">
          GLOBAL SENTIMENT BREAKDOWN — {agentResults.length} AGENTS
        </p>
        <div className="mb-4 flex h-5 overflow-hidden rounded-sm">
          {sentimentData.positive > 0 && (
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${sentimentData.positive}%`, background: "#00FF7F" }}
            />
          )}
          {sentimentData.neutral > 0 && (
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${sentimentData.neutral}%`, background: "#00F5FF" }}
            />
          )}
          {sentimentData.negative > 0 && (
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${sentimentData.negative}%`, background: "#FF0077" }}
            />
          )}
        </div>
        <div className="flex justify-between">
          <span className="font-orbitron text-[10px] font-bold" style={{ color: "#00FF7F" }}>
            POSITIVE {sentimentData.positive}%
          </span>
          <span className="font-orbitron text-[10px] font-bold" style={{ color: "#00F5FF" }}>
            NEUTRAL {sentimentData.neutral}%
          </span>
          <span className="font-orbitron text-[10px] font-bold" style={{ color: "#FF0077" }}>
            NEGATIVE {sentimentData.negative}%
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {(["overview", "agents", "factors"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="rounded-sm px-5 py-2.5 font-orbitron text-[10px] tracking-widest transition-all"
            style={{
              color: activeTab === tab ? "#00F5FF" : "rgba(255,255,255,0.3)",
              background: activeTab === tab ? "rgba(0,245,255,0.08)" : "transparent",
              border:
                activeTab === tab
                  ? "1px solid rgba(0,245,255,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="cyber-card p-6">
            <p className="mb-4 font-orbitron text-[9px] tracking-[0.45em]" style={{ color: "#00FF7F" }}>
              STRATEGIC RECOMMENDATION
            </p>
            <p className="text-sm leading-8 text-white/75">{recommendation}</p>
          </div>
          <div className="cyber-card p-6">
            <p className="mb-4 font-orbitron text-[9px] tracking-[0.45em]" style={{ color: "#00F5FF" }}>
              TIMELINE PROJECTION
            </p>
            <p className="text-sm leading-8 text-white/75">{timeline}</p>
          </div>
        </div>
      )}

      {activeTab === "agents" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agentResults.map((agent) => (
            <div key={agent.agentId} className="cyber-card p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="font-orbitron text-sm font-bold text-white">{agent.agentName}</p>
                  <p className="mt-0.5 font-orbitron text-[9px] tracking-widest text-white/25">
                    {agent.location}
                  </p>
                </div>
                <span
                  className="flex-shrink-0 rounded-sm px-2 py-1 font-orbitron text-[8px] font-black uppercase tracking-widest"
                  style={{
                    color: sentimentColor[agent.sentiment],
                    background: `${sentimentColor[agent.sentiment]}15`,
                    border: `1px solid ${sentimentColor[agent.sentiment]}40`,
                  }}
                >
                  {agent.sentiment}
                </span>
              </div>
              <div
                className="mb-2 h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${sentimentColor[agent.sentiment]}, transparent)`,
                  width: `${agent.intensity * 10}%`,
                  opacity: 0.5,
                }}
              />
              <p className="text-xs leading-6 text-white/55">{agent.reaction}</p>
              <p className="mt-3 font-orbitron text-[8px] tracking-widest text-white/25">
                ▸ {agent.likelyAction}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "factors" && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="cyber-card p-6">
            <p className="mb-5 font-orbitron text-[9px] tracking-[0.45em]" style={{ color: "#00F5FF" }}>
              KEY FACTORS
            </p>
            <ul className="space-y-4">
              {keyFactors.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-7 text-white/65">
                  <span style={{ color: "#00F5FF" }} className="mt-0.5 flex-shrink-0">
                    ▸
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="cyber-card p-6">
            <p className="mb-5 font-orbitron text-[9px] tracking-[0.45em]" style={{ color: "#FF0077" }}>
              RISKS
            </p>
            <ul className="space-y-4">
              {risks.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-7 text-white/65">
                  <span style={{ color: "#FF0077" }} className="mt-0.5 flex-shrink-0">
                    ▸
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="cyber-card p-6">
            <p className="mb-5 font-orbitron text-[9px] tracking-[0.45em]" style={{ color: "#00FF7F" }}>
              OPPORTUNITIES
            </p>
            <ul className="space-y-4">
              {opportunities.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-xs leading-7 text-white/65">
                  <span style={{ color: "#00FF7F" }} className="mt-0.5 flex-shrink-0">
                    ▸
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="mt-16 flex flex-wrap justify-center gap-4">
        <a href="/simulate" className="btn-solid">
          RUN NEW SIMULATION
        </a>
        <a href="/history" className="btn-neon">
          VIEW HISTORY
        </a>
      </div>
    </div>
  );
}
