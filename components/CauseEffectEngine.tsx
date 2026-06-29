"use client";

import { useState } from "react";
import type { CauseEffectResult, Effect, BehaviorPattern } from "@/app/api/cause-effect/route";

const DOMAIN_COLOR: Record<string, string> = {
  Economy:     "#FFB800",
  Politics:    "#FF0077",
  Technology:  "#00FF41",
  Society:     "#BF00FF",
  Media:       "#00e0ff",
  Security:    "#ff4444",
  Health:      "#44ffaa",
  Environment: "#88ff44",
};

const OUTLOOK_CONFIG = {
  catastrophic:  { label: "CATASTROPHIC",  color: "#ff2222" },
  destabilizing: { label: "DESTABILIZING", color: "#FF0077" },
  neutral:       { label: "NEUTRAL",        color: "#b9ccb2" },
  transformative:{ label: "TRANSFORMATIVE",color: "#FFB800" },
  positive:      { label: "POSITIVE",       color: "#00FF41" },
};

const SENTIMENT_ICON: Record<string, string> = {
  fear:       "⚡",
  anger:      "🔴",
  hope:       "🟢",
  adaptation: "🔵",
  confusion:  "🟡",
  resistance: "🟠",
};

const LOAD_STEPS = [
  "Parsing scenario parameters...",
  "Identifying key actors and systems...",
  "Calculating first-order effects...",
  "Tracing secondary cascade...",
  "Projecting long-term trajectory...",
  "Analysing human behaviour patterns...",
  "Surfacing hidden forces...",
  "Synthesising intelligence report...",
];

function DividerLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
      <span style={{
        fontFamily: "var(--font-space-mono), Space Mono, monospace",
        fontSize: "9px",
        letterSpacing: "0.18em",
        color: "#00FF41",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "rgba(0,255,65,0.10)" }} />
    </div>
  );
}

function EffectRow({ e }: { e: Effect }) {
  const dc = DOMAIN_COLOR[e.domain] ?? "#84967e";
  return (
    <div style={{
      background: "rgba(20,30,18,0.65)",
      border: "1px solid rgba(0,255,65,0.08)",
      borderLeft: `3px solid ${dc}`,
      borderRadius: "2px",
      padding: "0.6rem 0.8rem",
      display: "flex",
      gap: "0.65rem",
      alignItems: "flex-start",
      marginBottom: "0.4rem",
    }}>
      <span style={{
        fontFamily: "var(--font-space-mono)",
        fontSize: "7px",
        letterSpacing: "0.12em",
        color: dc,
        textTransform: "uppercase",
        marginTop: "3px",
        minWidth: "72px",
        flexShrink: 0,
      }}>
        {e.domain}
      </span>
      <p style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: "0.81rem",
        color: "#b9ccb2",
        lineHeight: 1.65,
        margin: 0,
        flex: 1,
      }}>
        {e.effect}
      </p>
      <div style={{
        flexShrink: 0,
        width: "24px",
        height: "24px",
        borderRadius: "2px",
        background: "rgba(0,0,0,0.35)",
        border: `1px solid ${dc}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-space-mono)",
        fontSize: "10px",
        fontWeight: 700,
        color: dc,
      }}>
        {e.severity}
      </div>
    </div>
  );
}

function WaveBlock({
  waveNum, title, timeframe, effects,
}: {
  waveNum: number; title: string; timeframe: string; effects: Effect[];
}) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "0.6rem",
      }}>
        <span style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "9px",
          letterSpacing: "0.18em",
          color: "#00FF41",
          textTransform: "uppercase",
        }}>
          WAVE {waveNum}
        </span>
        <span style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "9px",
          color: "#84967e",
          letterSpacing: "0.08em",
        }}>
          {timeframe}
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(0,255,65,0.08)" }} />
      </div>
      <h3 style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: "1rem",
        fontWeight: 700,
        color: "#dae6d2",
        margin: "0 0 0.65rem",
      }}>
        {title}
      </h3>
      {effects.map((e, i) => <EffectRow key={i} e={e} />)}
    </div>
  );
}

function BehaviorCard({ p }: { p: BehaviorPattern }) {
  const icon = SENTIMENT_ICON[p.sentiment] ?? "⚪";
  return (
    <div style={{
      background: "rgba(20,30,18,0.65)",
      border: "1px solid rgba(0,255,65,0.09)",
      borderRadius: "2px",
      padding: "0.8rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "12px" }}>{icon}</span>
        <p style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "8px",
          letterSpacing: "0.10em",
          color: "#00FF41",
          textTransform: "uppercase",
          margin: 0,
        }}>
          {p.group}
        </p>
      </div>
      <p style={{
        fontFamily: "var(--font-inter), Inter, sans-serif",
        fontSize: "0.79rem",
        color: "#b9ccb2",
        lineHeight: 1.6,
        margin: 0,
      }}>
        {p.response}
      </p>
    </div>
  );
}

export default function CauseEffectEngine() {
  const [scenario, setScenario]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [loadStep, setLoadStep]   = useState(0);
  const [result, setResult]       = useState<CauseEffectResult | null>(null);
  const [error, setError]         = useState<string | null>(null);

  async function runSimulation() {
    const trimmed = scenario.trim();
    if (trimmed.length < 10 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadStep(0);

    const stepInterval = setInterval(() => {
      setLoadStep(prev => Math.min(prev + 1, LOAD_STEPS.length - 1));
    }, 900);

    try {
      const resp = await fetch("/api/cause-effect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: trimmed }),
      });
      const data = await resp.json() as CauseEffectResult & { error?: string };
      if (!resp.ok) throw new Error(data.error ?? "Simulation failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulation failed — please retry");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  }

  const oc = result
    ? (OUTLOOK_CONFIG[result.outlook] ?? OUTLOOK_CONFIG.neutral)
    : null;

  return (
    <div style={{ minHeight: "100svh", paddingTop: "96px", paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "2rem 1.25rem 1.5rem" }}>
        <div className="section-label">CUSTOM SCENARIO ENGINE</div>
        <h1 style={{
          fontFamily: "var(--font-space-mono), Space Mono, monospace",
          fontSize: "clamp(1.5rem, 4vw, 2.4rem)",
          fontWeight: 700,
          color: "#00FF41",
          margin: "0.75rem 0 0",
          letterSpacing: "-0.02em",
          textShadow: "0 0 40px rgba(0,255,65,0.35)",
        }}>
          CAUSE &amp; EFFECT SIMULATOR
        </h1>
        <p style={{
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: "0.88rem",
          color: "#84967e",
          marginTop: "0.5rem",
          maxWidth: "500px",
          margin: "0.5rem auto 0",
          lineHeight: 1.7,
        }}>
          Describe any scenario — climate events, social movements, technological disruptions,
          geopolitical shifts. The system traces how it cascades through time.
        </p>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 1.25rem" }}>

        {/* ── INPUT ── */}
        {!result && !loading && (
          <div style={{
            background: "rgba(12,22,10,0.90)",
            border: "1px solid rgba(0,255,65,0.18)",
            borderRadius: "4px",
            padding: "1.5rem",
            marginTop: "1.5rem",
          }}>
            <label
              htmlFor="ce-scenario"
              style={{
                fontFamily: "var(--font-space-mono), Space Mono, monospace",
                fontSize: "9px",
                letterSpacing: "0.18em",
                color: "#00FF41",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              DESCRIBE YOUR SCENARIO
            </label>
            <textarea
              id="ce-scenario"
              className="ce-scenario-textarea"
              value={scenario}
              onChange={e => setScenario(e.target.value)}
              placeholder="What if AGI is publicly announced tomorrow? What happens if the US dollar loses reserve currency status? What if a cure for cancer is found? What if a Category 6 hurricane hits a major city? Describe anything..."
              rows={7}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runSimulation();
              }}
            />
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}>
              <span style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "8px",
                color: "#84967e",
                letterSpacing: "0.10em",
              }}>
                {scenario.length}/2000 · CMD+ENTER TO RUN
              </span>
              <button
                onClick={runSimulation}
                disabled={scenario.trim().length < 10}
                style={{
                  background: scenario.trim().length >= 10 ? "#00FF41" : "rgba(0,255,65,0.06)",
                  color: scenario.trim().length >= 10 ? "#003907" : "#3b4b37",
                  border: `1px solid ${scenario.trim().length >= 10 ? "rgba(0,255,65,0.80)" : "rgba(0,255,65,0.10)"}`,
                  borderRadius: "2px",
                  fontFamily: "var(--font-space-mono), Space Mono, monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.6rem 1.4rem",
                  cursor: scenario.trim().length >= 10 ? "pointer" : "not-allowed",
                  transition: "all 150ms ease",
                }}
              >
                BEGIN SIMULATION →
              </button>
            </div>
            {error && (
              <p style={{
                marginTop: "0.75rem",
                fontFamily: "var(--font-space-mono)",
                fontSize: "10px",
                color: "#FF0077",
                letterSpacing: "0.08em",
                margin: "0.75rem 0 0",
              }}>
                ⚠ {error}
              </p>
            )}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div style={{
            background: "rgba(12,22,10,0.92)",
            border: "1px solid rgba(0,255,65,0.16)",
            borderRadius: "4px",
            padding: "2.5rem 1.75rem",
            marginTop: "1.5rem",
            textAlign: "center",
          }}>
            <div style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "9px",
              letterSpacing: "0.18em",
              color: "#00FF41",
              marginBottom: "1.75rem",
              textTransform: "uppercase",
            }}>
              OMNISIM CASCADE INTELLIGENCE · PROCESSING
            </div>
            <div style={{
              height: "2px",
              background: "rgba(0,255,65,0.06)",
              borderRadius: "1px",
              overflow: "hidden",
              marginBottom: "1.75rem",
            }}>
              <div style={{
                height: "100%",
                background: "#00FF41",
                width: `${((loadStep + 1) / LOAD_STEPS.length) * 100}%`,
                transition: "width 700ms ease",
                boxShadow: "0 0 14px rgba(0,255,65,0.60)",
              }} />
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
              alignItems: "flex-start",
              maxWidth: "400px",
              margin: "0 auto",
            }}>
              {LOAD_STEPS.map((step, i) => (
                <div key={i} style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  color: i < loadStep ? "#00FF41" : i === loadStep ? "#dae6d2" : "#3b4b37",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "color 300ms ease",
                }}>
                  <span style={{ minWidth: "12px", color: i <= loadStep ? "#00FF41" : "#3b4b37" }}>
                    {i < loadStep ? "✓" : i === loadStep ? "▸" : "○"}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {result && !loading && (
          <div style={{ marginTop: "1.5rem" }}>

            {/* Control bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}>
              <button
                onClick={() => { setResult(null); setScenario(""); setError(null); }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,255,65,0.18)",
                  borderRadius: "2px",
                  color: "#84967e",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.4rem 0.85rem",
                  cursor: "pointer",
                }}
              >
                ← NEW SCENARIO
              </button>
              {oc && (
                <div style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  color: oc.color,
                  textTransform: "uppercase",
                  border: `1px solid ${oc.color}44`,
                  borderRadius: "2px",
                  padding: "0.35rem 0.75rem",
                  textShadow: `0 0 10px ${oc.color}55`,
                }}>
                  OUTLOOK: {oc.label}
                </div>
              )}
              <div style={{
                fontFamily: "var(--font-space-mono)",
                fontSize: "9px",
                color: "#84967e",
                letterSpacing: "0.10em",
              }}>
                CONFIDENCE: <span style={{ color: "#00FF41" }}>{result.confidence}%</span>
              </div>
            </div>

            {/* Trigger Event */}
            <div style={{
              background: "rgba(0,255,65,0.03)",
              border: "1px solid rgba(0,255,65,0.26)",
              borderRadius: "4px",
              padding: "1.1rem 1.35rem",
              marginBottom: "2rem",
            }}>
              <DividerLabel label="TRIGGER EVENT" />
              <p style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#dae6d2",
                lineHeight: 1.65,
                margin: 0,
              }}>
                {result.triggerEvent}
              </p>
            </div>

            {/* Three waves */}
            <WaveBlock waveNum={1} title="Immediate Cascade" timeframe="0 – 6 MONTHS" effects={result.immediateEffects ?? []} />
            <WaveBlock waveNum={2} title="Secondary Effects" timeframe="6 – 24 MONTHS" effects={result.secondaryEffects ?? []} />
            <WaveBlock waveNum={3} title="Long-Term Trajectory" timeframe="2 – 10 YEARS" effects={result.longTermTrajectory ?? []} />

            {/* Human behavior patterns */}
            <div style={{ marginBottom: "2rem" }}>
              <DividerLabel label="HUMAN BEHAVIOR PATTERNS" />
              <div style={{
                display: "grid",
                gap: "0.5rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              }}>
                {(result.humanBehaviorPatterns ?? []).map((p, i) => (
                  <BehaviorCard key={i} p={p} />
                ))}
              </div>
            </div>

            {/* Hidden forces + Tipping point */}
            <div className="ce-two-col" style={{ marginBottom: "2.5rem" }}>
              <div style={{
                background: "rgba(20,30,18,0.65)",
                border: "1px solid rgba(191,0,255,0.16)",
                borderRadius: "4px",
                padding: "1.1rem 1.25rem",
              }}>
                <div style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "#BF00FF",
                  textTransform: "uppercase",
                  textShadow: "0 0 10px rgba(191,0,255,0.28)",
                  marginBottom: "0.65rem",
                }}>
                  HIDDEN FORCES
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 1rem" }}>
                  {(result.hiddenForces ?? []).map((f, i) => (
                    <li key={i} style={{
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontSize: "0.81rem",
                      color: "#b9ccb2",
                      lineHeight: 1.65,
                      marginBottom: "0.4rem",
                    }}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                background: "rgba(20,30,18,0.65)",
                border: "1px solid rgba(255,184,0,0.16)",
                borderRadius: "4px",
                padding: "1.1rem 1.25rem",
              }}>
                <div style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "#FFB800",
                  textTransform: "uppercase",
                  textShadow: "0 0 10px rgba(255,184,0,0.28)",
                  marginBottom: "0.65rem",
                }}>
                  CRITICAL TIPPING POINT
                </div>
                <p style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: "0.83rem",
                  color: "#dae6d2",
                  lineHeight: 1.7,
                  margin: 0,
                  fontWeight: 500,
                }}>
                  {result.tippingPoint}
                </p>
              </div>
            </div>

            {/* Run another */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => { setResult(null); setScenario(""); setError(null); }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,255,65,0.28)",
                  borderRadius: "2px",
                  color: "#00FF41",
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.65rem 1.5rem",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                SIMULATE ANOTHER SCENARIO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
