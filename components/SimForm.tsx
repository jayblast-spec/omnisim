"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormSchema, FormField } from "@/lib/formSchemas";
import { supabase } from "@/lib/supabaseClient";

type TruthCheckValue = "true" | "unknown" | "skip";

interface FlatQuestion {
  field: FormField;
  sectionTitle: string;
  sectionIndex: number;
  isFirstInSection: boolean;
}

type ChatEntry =
  | { id: string; role: "section"; text: string }
  | { id: string; role: "bot"; text: string }
  | { id: string; role: "user"; text: string };

interface SimFormProps {
  schema: FormSchema;
}

function flattenQuestions(schema: FormSchema): FlatQuestion[] {
  const out: FlatQuestion[] = [];
  schema.sections.forEach((section, si) => {
    section.fields.forEach((field, fi) => {
      out.push({
        field,
        sectionTitle: section.title,
        sectionIndex: si,
        isFirstInSection: fi === 0,
      });
    });
  });
  return out;
}

const LOADING_STEPS = [
  { title: "Reading Your Scenario",     signal: "INTAKE LOCKED" },
  { title: "Preparing 35 Global Agents", signal: "AGENTS READY" },
  { title: "Running Reaction Tests",     signal: "REACTIONS ACTIVE" },
  { title: "Elite Specialist Analysis",  signal: "SPECIALISTS IN" },
  { title: "Mathematical Calibration",   signal: "CONFIDENCE SET" },
  { title: "Cascade Chain Modeling",     signal: "PATHS FORMED" },
  { title: "Devil’s Advocate Check",    signal: "COUNTER CHECK" },
  { title: "Writing Intel Report",       signal: "REPORT BUILD" },
  { title: "Final Trust Pass",           signal: "READY" },
];

export default function SimForm({ schema }: SimFormProps) {
  const router  = useRouter();
  const flatQ   = useRef(flattenQuestions(schema)).current;
  const total   = flatQ.length;

  const [qIdx,         setQIdx]         = useState(0);
  const [answers,      setAnswers]      = useState<Record<string, string | string[]>>({});
  const [history,      setHistory]      = useState<ChatEntry[]>([]);
  const [typedText,    setTypedText]    = useState("");
  const [isTyping,     setIsTyping]     = useState(false);
  const [textInput,    setTextInput]    = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep,  setLoadingStep]  = useState(0);
  const [elapsed,      setElapsed]      = useState(0);
  const [error,        setError]        = useState<string | null>(null);
  const [truthPending, setTruthPending] = useState(false);
  const [truthChecks,  setTruthChecks] = useState<Record<number, TruthCheckValue>>({});

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const typingTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ  = flatQ[qIdx];
  const isDone    = qIdx >= total;
  // showInput controls visibility only — the zone stays in DOM at all times
  const showInput = !isDone && !isTyping && !truthPending && !!currentQ;

  /* ── Scroll to bottom ────────────────────────────────────── */
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = chatScrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, [history, typedText]);

  /* ── Typewriter ────────────────────────────────────────── */
  function typeOut(
    text: string,
    role: "section" | "bot",
    onDone?: () => void
  ) {
    if (typingTimer.current) clearInterval(typingTimer.current);
    setTypedText("");
    setIsTyping(true);
    let i = 0;
    typingTimer.current = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typingTimer.current!);
        typingTimer.current = null;
        setIsTyping(false);
        setHistory((h) => [
          ...h,
          { id: `${role}-${Date.now()}-${Math.random()}`, role, text },
        ]);
        setTypedText("");
        onDone?.();
      }
    }, 16);
  }

  /* ── Advance to next question ────────────────────────────── */
  useEffect(() => {
    if (qIdx >= total) return;
    const q = flatQ[qIdx];
    setTextInput("");

    const questionText = q.field.hint
      ? `${q.field.label}\n› ${q.field.hint}`
      : q.field.label;

    if (q.isFirstInSection) {
      typeOut(`// ${q.sectionTitle}`, "section", () => {
        setTimeout(() => typeOut(questionText, "bot"), 160);
      });
    } else {
      typeOut(questionText, "bot");
    }

    return () => {
      if (typingTimer.current) clearInterval(typingTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIdx]);

  /* ── Submit an answer ───────────────────────────────────── */
  function submitAnswer(val: string | string[]) {
    const display = Array.isArray(val) ? val.join(", ") : val;
    if (!display.trim()) return;

    setAnswers((prev) => ({ ...prev, [currentQ!.field.id]: val }));
    setHistory((h) => [
      ...h,
      { id: `user-${Date.now()}`, role: "user", text: display },
    ]);

    const next = qIdx + 1;
    if (next >= total) {
      setQIdx(next);
      setTimeout(() => setTruthPending(true), 400);
    } else {
      setQIdx(next);
    }
  }

  /* ── Truth check ───────────────────────────────────────── */
  function answerTruth(val: TruthCheckValue) {
    const checks = { ...truthChecks, 0: val };
    setTruthChecks(checks);
    setTruthPending(false);
    void doSubmit(checks);
  }

  /* ── Elapsed timer ──────────────────────────────────────── */
  useEffect(() => {
    if (!isSubmitting) { setElapsed(0); return; }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isSubmitting]);

  /* ── API call ──────────────────────────────────────────── */
  async function doSubmit(checks: Record<number, TruthCheckValue> = truthChecks) {
    setIsSubmitting(true);
    setError(null);

    let step = 0;
    setLoadingStep(0);
    const iv = setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length;
      setLoadingStep(step);
    }, 1350);

    const truthPayload = JSON.stringify(
      Object.entries(checks).map(([si, answer]) => ({
        sectionIndex: Number(si),
        sectionTitle: schema.sections[Number(si)]?.title ?? `Section ${Number(si) + 1}`,
        answer,
      }))
    );

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

      const res = await fetch("/api/simulate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: schema.type,
          data: { ...answers, __truthStageChecks: truthPayload },
        }),
      });
      clearInterval(iv);
      if (!res.ok) {
        const e = (await res.json()) as { error?: string };
        throw new Error(e.error || "Simulation failed");
      }
      const result = (await res.json()) as { id: string };
      sessionStorage.setItem(`sim_${result.id}`, JSON.stringify(result));
      router.push(`/results/${result.id}`);
    } catch (err) {
      clearInterval(iv);
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : "Simulation failed. Please try again.");
    }
  }

  /* ═══════════════════════════ LOADING SCREEN ════════════════════ */
  if (isSubmitting) {
    const step     = LOADING_STEPS[loadingStep];
    const progress = ((loadingStep + 1) / LOADING_STEPS.length) * 100;
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 py-24"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="w-full max-w-2xl rounded border p-8"
          style={{
            background: "rgba(12,22,10,0.97)",
            border:     "1px solid rgba(0,255,65,0.25)",
            boxShadow:  "0 0 60px rgba(0,255,65,0.10)",
          }}
        >
          <p className="section-label">OMNISIM INTELLIGENCE ENGINE · LIVE</p>
          <h2
            className="mt-4 text-2xl font-bold md:text-3xl"
            style={{ color: "#dae6d2", fontFamily: "var(--font-inter)" }}
          >
            {step.title}
            <span style={{ color: "#00FF41" }} className="animate-pulse">\_</span>
          </h2>
          <div
            className="mt-5 h-1 overflow-hidden rounded-full"
            style={{ background: "rgba(0,255,65,0.12)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg,#00FF41,#00e639)" }}
            />
          </div>
          <div className="mt-6 space-y-2">
            {LOADING_STEPS.slice(0, loadingStep + 1).slice(-5).map((s, i, arr) => {
              const isActive = i === arr.length - 1;
              return (
                <div
                  key={s.signal}
                  className="flex items-center gap-3 rounded px-3 py-2"
                  style={{ background: isActive ? "rgba(0,255,65,0.08)" : "rgba(0,255,65,0.02)" }}
                >
                  <div
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: isActive ? "#00FF41" : "#00a833", boxShadow: isActive ? "0 0 8px #00FF41" : "none" }}
                  />
                  <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", letterSpacing: "0.10em", color: isActive ? "#00FF41" : "#3b4b37", textTransform: "uppercase" }}>
                    {s.signal}
                  </span>
                  <span style={{ fontSize: "11px", color: isActive ? "#b9ccb2" : "#3b4b37" }}>{s.title}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex gap-6 border-t pt-5" style={{ borderColor: "rgba(0,255,65,0.10)" }}>
            {[["Simulation", schema.title], ["Signal", step.signal], ["Elapsed", `${elapsed}s`]].map(([label, value]) => (
              <div key={label} className="min-w-0 flex-1">
                <p style={{ fontFamily: "var(--font-space-mono)", fontSize: "8px", letterSpacing: "0.16em", color: "#3b4b37", textTransform: "uppercase" }}>{label}</p>
                <p className="mt-0.5 truncate" style={{ fontFamily: "var(--font-space-mono)", fontSize: "11px", color: "#00FF41" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════ CHAT UI ══════════════════════════ */
  return (
    <div
      className="flex flex-col"
      style={{
        // 100dvh = dynamic viewport height: shrinks correctly when
        // the mobile keyboard opens, preventing hard layout reflow.
        // 100svh had this right in theory but combined with paddingTop
        // it could overshoot and cause a scroll at the document level.
        height:     "100dvh",
        paddingTop: "72px",
        background: "var(--bg)",
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="shrink-0 border-b px-4 py-2.5 sm:px-6"
        style={{ background: "rgba(7,17,6,0.96)", borderColor: "rgba(0,255,65,0.12)" }}
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <span style={{ fontSize: "15px" }}>{schema.icon}</span>
            <span
              className="truncate"
              style={{ fontFamily: "var(--font-space-mono)", fontSize: "10px", color: "#00FF41", letterSpacing: "0.10em", textTransform: "uppercase" }}
            >
              {schema.type.replace(/-/g, " ")} SIMULATION
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="h-1 w-24 overflow-hidden rounded-full" style={{ background: "rgba(0,255,65,0.12)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((qIdx / total) * 100, 100)}%`, background: "#00FF41" }}
              />
            </div>
            <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "#3b4b37" }}>
              {Math.min(qIdx, total)}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* ── Chat scroll ──
           min-h-0 is essential: without it the flex child won't shrink
           below its content height, breaking the flex layout. */}
      <div
        ref={chatScrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-4 sm:px-6"
        style={{
          overscrollBehavior: "contain",
        }}
      >
        <div className="mx-auto max-w-2xl space-y-3">
          {history.map((entry) => {
            if (entry.role === "section") {
              return (
                <div key={entry.id} className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1" style={{ background: "rgba(0,255,65,0.12)" }} />
                  <span style={{ fontFamily: "var(--font-space-mono)", fontSize: "9px", color: "rgba(0,255,65,0.45)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    {entry.text}
                  </span>
                  <div className="h-px flex-1" style={{ background: "rgba(0,255,65,0.12)" }} />
                </div>
              );
            }
            if (entry.role === "user") {
              return (
                <div key={entry.id} className="flex justify-end">
                  <div
                    className="max-w-[78%] rounded px-4 py-2.5"
                    style={{ background: "#00FF41", color: "#003907", fontFamily: "var(--font-space-mono)", fontSize: "13px", lineHeight: "1.6" }}
                  >
                    {entry.text}
                  </div>
                </div>
              );
            }
            return (
              <div key={entry.id} className="flex items-start gap-3">
                <BotAvatar />
                <div
                  className="max-w-[84%] rounded px-4 py-2.5"
                  style={{ background: "rgba(20,30,18,0.80)", border: "1px solid rgba(0,255,65,0.12)", color: "#dae6d2", fontFamily: "var(--font-space-mono)", fontSize: "13px", lineHeight: "1.7", whiteSpace: "pre-line" }}
                >
                  {entry.text}
                </div>
              </div>
            );
          })}

          {/* Typing bubble */}
          {(isTyping || typedText) && (
            <div className="flex items-start gap-3">
              <BotAvatar pulsing />
              <div
                className="max-w-[84%] rounded px-4 py-2.5"
                style={{ background: "rgba(20,30,18,0.80)", border: "1px solid rgba(0,255,65,0.12)", color: "#dae6d2", fontFamily: "var(--font-space-mono)", fontSize: "13px", lineHeight: "1.7", whiteSpace: "pre-line", minWidth: "60px", minHeight: "42px" }}
              >
                {typedText || "​"}
                <span style={{ color: "#00FF41" }} className="animate-pulse">▊</span>
              </div>
            </div>
          )}

          <div style={{ height: "4px" }} />
        </div>
      </div>

      {/* ── Input zone ──
           Always in DOM with a fixed minHeight so the chat area
           never reflows when the bot is typing vs awaiting input.
           Only opacity + pointerEvents change — zero layout shift. */}
      <div
        className="shrink-0"
        style={{
          background:    "rgba(7,17,6,0.97)",
          borderTop:     "1px solid rgba(0,255,65,0.10)",
          minHeight:     "72px",
          opacity:       showInput ? 1 : 0,
          pointerEvents: showInput ? "auto" : "none",
          transition:    "opacity 160ms ease",
        }}
      >
        {currentQ && (
          <InputArea
            key={qIdx}
            field={currentQ.field}
            textValue={textInput}
            onTextChange={setTextInput}
            onSubmit={submitAnswer}
          />
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="shrink-0 border-t px-4 py-2 text-center"
          style={{ borderColor: "rgba(255,0,119,0.2)", background: "rgba(255,0,119,0.06)" }}
        >
          <p style={{ color: "#FF0077", fontSize: "11px", fontFamily: "var(--font-space-mono)" }}>{error}</p>
        </div>
      )}

      {/* Truth modal */}
      {truthPending && <TruthModal onAnswer={answerTruth} />}
    </div>
  );
}

/* ════════════ SUB-COMPONENTS ═══════════════════════════════ */

function BotAvatar({ pulsing }: { pulsing?: boolean }) {
  return (
    <div
      className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded"
      style={{ background: "rgba(0,255,65,0.08)", border: "1px solid rgba(0,255,65,0.22)", flexShrink: 0 }}
    >
      <div
        className={pulsing ? "animate-pulse" : ""}
        style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00FF41", boxShadow: pulsing ? "0 0 8px #00FF41" : "0 0 4px #00FF41" }}
      />
    </div>
  );
}

function InputArea({
  field,
  textValue,
  onTextChange,
  onSubmit,
}: {
  field: FormField;
  textValue: string;
  onTextChange: (v: string) => void;
  onSubmit: (val: string | string[]) => void;
}) {
  const [multi, setMulti] = useState<string[]>([]);

  const base: React.CSSProperties = {
    background:  "transparent",
    borderTop:   "none",
    padding:     "12px 16px",
    flexShrink:  0,
  };

  const sendBtn: React.CSSProperties = {
    background:    "#00FF41",
    color:         "#003907",
    border:        "none",
    padding:       "8px 20px",
    fontFamily:    "var(--font-space-mono)",
    fontWeight:    700,
    fontSize:      "11px",
    letterSpacing: "0.08em",
    cursor:        "pointer",
    borderRadius:  "4px",
    flexShrink:    0,
  };

  const skipBtn: React.CSSProperties = {
    fontFamily:    "var(--font-space-mono)",
    fontSize:      "9px",
    color:         "#3b4b37",
    background:    "none",
    border:        "none",
    cursor:        "pointer",
    letterSpacing: "0.12em",
    padding:       0,
  };

  const inputStyle: React.CSSProperties = {
    background:   "transparent",
    border:       "none",
    borderBottom: "1px solid rgba(0,255,65,0.30)",
    padding:      "10px 4px",
    color:        "#dae6d2",
    fontFamily:   "var(--font-space-mono)",
    fontSize:     "13px",
    outline:      "none",
    flex:         1,
    minWidth:     0,
    boxShadow:    "none",
    borderRadius: 0,
  };

  if (["text", "number", "date"].includes(field.type)) {
    const handleSend = () => { if (textValue.trim()) onSubmit(textValue.trim()); };
    return (
      <div style={base}>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-3">
            <input
              autoFocus
              type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
              value={textValue}
              onChange={(e) => onTextChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={field.placeholder || (field.required ? "Type your answer..." : "Type or skip →")}
              style={inputStyle}
            />
            <button type="button" onClick={handleSend} style={sendBtn}>SEND →</button>
          </div>
          {!field.required && (
            <button type="button" onClick={() => onSubmit("N/A")} style={{ ...skipBtn, marginTop: "6px", display: "block" }}>
              SKIP →
            </button>
          )}
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div style={base}>
        <div className="mx-auto max-w-2xl">
          <textarea
            autoFocus
            rows={Math.min(field.rows || 3, 4)}
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={field.placeholder || "Type your answer..."}
            style={{ ...inputStyle, display: "block", resize: "none", flex: "unset", width: "100%" }}
          />
          <div className="mt-2 flex items-center justify-between">
            {!field.required ? <button type="button" onClick={() => onSubmit("N/A")} style={skipBtn}>SKIP →</button> : <span />}
            <button type="button" onClick={() => { if (textValue.trim()) onSubmit(textValue.trim()); }} style={sendBtn}>SEND →</button>
          </div>
        </div>
      </div>
    );
  }

  if (field.type === "select" || field.type === "radio") {
    return (
      <div style={{ ...base, padding: "12px 16px 14px" }}>
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSubmit(opt)}
                style={{ background: "rgba(20,30,18,0.90)", border: "1px solid rgba(0,255,65,0.22)", color: "#dae6d2", padding: "8px 16px", fontFamily: "var(--font-space-mono)", fontSize: "12px", cursor: "pointer", borderRadius: "4px", transition: "all 0.12s ease", touchAction: "manipulation" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "#00FF41"; el.style.color = "#003907"; el.style.borderColor = "#00FF41"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "rgba(20,30,18,0.90)"; el.style.color = "#dae6d2"; el.style.borderColor = "rgba(0,255,65,0.22)"; }}
              >
                {opt}
              </button>
            ))}
          </div>
          {!field.required && (
            <button type="button" onClick={() => onSubmit("N/A")} style={{ ...skipBtn, marginTop: "8px", display: "block" }}>SKIP →</button>
          )}
        </div>
      </div>
    );
  }

  if (field.type === "multiselect") {
    const toggle = (opt: string) =>
      setMulti((prev) => prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]);
    return (
      <div style={{ ...base, padding: "12px 16px 14px" }}>
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const sel = multi.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  style={{ background: sel ? "#00FF41" : "rgba(20,30,18,0.90)", border: sel ? "1px solid #00FF41" : "1px solid rgba(0,255,65,0.22)", color: sel ? "#003907" : "#dae6d2", padding: "7px 14px", fontFamily: "var(--font-space-mono)", fontSize: "11px", cursor: "pointer", borderRadius: "4px", transition: "all 0.10s ease", touchAction: "manipulation" }}
                >
                  {sel ? "✓ " : ""}{opt}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            {!field.required ? <button type="button" onClick={() => onSubmit(["N/A"])} style={skipBtn}>SKIP →</button> : <span />}
            <button
              type="button"
              disabled={multi.length === 0}
              onClick={() => { if (multi.length > 0) { onSubmit(multi); setMulti([]); } }}
              style={{ ...sendBtn, background: multi.length > 0 ? "#00FF41" : "rgba(0,255,65,0.15)", color: multi.length > 0 ? "#003907" : "#3b4b37", cursor: multi.length > 0 ? "pointer" : "default" }}
            >
              CONFIRM{multi.length > 0 ? ` (${multi.length})` : ""} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TruthModal({ onAnswer }: { onAnswer: (v: TruthCheckValue) => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-5 sm:items-center sm:pb-0"
      style={{ background: "rgba(4,8,4,0.72)" }}
    >
      <div
        className="w-full max-w-sm rounded border p-5"
        style={{ background: "rgba(12,22,10,0.99)", border: "1px solid rgba(0,255,65,0.28)", boxShadow: "0 0 40px rgba(0,255,65,0.12)" }}
      >
        <p className="section-label">Truth Checkpoint</p>
        <h3 className="mt-2 text-base font-semibold" style={{ color: "#dae6d2", fontFamily: "var(--font-inter)" }}>
          Are these answers based on facts or estimates?
        </h3>
        <p className="mt-1 text-xs" style={{ color: "#84967e", fontFamily: "var(--font-space-mono)" }}>
          This calibrates simulation confidence.
        </p>
        <div className="mt-4 space-y-2">
          {([
            ["true",    "Based on facts I trust",        "rgba(0,255,65,0.08)",  "rgba(0,255,65,0.28)",    "#dae6d2"],
            ["unknown", "Some parts are uncertain",       "rgba(255,184,0,0.06)", "rgba(255,184,0,0.22)",   "#dae6d2"],
            ["skip",    "Mark unverified and continue",   "rgba(0,0,0,0.20)",     "rgba(255,255,255,0.06)", "#84967e"],
          ] as [TruthCheckValue, string, string, string, string][]).map(([val, label, bg, border, color]) => (
            <button
              key={val}
              type="button"
              onClick={() => onAnswer(val)}
              style={{ width: "100%", background: bg, border: `1px solid ${border}`, color, padding: "10px 14px", textAlign: "left", fontFamily: "var(--font-space-mono)", fontSize: "12px", cursor: "pointer", borderRadius: "4px", display: "block", touchAction: "manipulation" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
