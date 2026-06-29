"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormSchema } from "@/lib/formSchemas";

type TruthCheckValue = "true" | "unknown" | "skip";

interface SimFormProps {
  schema: FormSchema;
}

export default function SimForm({ schema }: SimFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [truthChecks, setTruthChecks] = useState<Record<number, TruthCheckValue>>({});
  const [pendingAction, setPendingAction] = useState<"next" | "submit" | null>(null);

  const loadingSteps = [
    {
      title: "Preparing OmniSim Intelligence",
      detail: "Mounting the scenario engine and preparing the selected simulation model.",
      signal: "INTELLIGENCE READY",
    },
    {
      title: "Reading Every Blank You Filled",
      detail: "Parsing names, motives, risks, context, emotional signals, timeframes, and hidden pressure points.",
      signal: "INTAKE LOCKED",
    },
    {
      title: "Testing Human Response Patterns",
      detail: "Choosing the agent mix most likely to understand how real people would respond to this matter.",
      signal: "AGENTS READY",
    },
    {
      title: "Running Live Reaction Tests",
      detail: "Testing how different personalities, cultures, incentives, and fears respond to this situation.",
      signal: "REACTIONS ACTIVE",
    },
    {
      title: "Applying Resilience Filters",
      detail: "Checking reputation, timing, trust, leverage, safety, risk, upside, and probability of follow-through.",
      signal: "SUCCESS FILTER",
    },
    {
      title: "Generating Multiple Outcome Paths",
      detail: "Building best-case, likely-case, downside, and hidden-opportunity branches before choosing the final signal.",
      signal: "PATHS FORMED",
    },
    {
      title: "Cross-Examining The Result",
      detail: "Searching for weak assumptions, missed factors, emotional bias, and second-order consequences.",
      signal: "COUNTER CHECK",
    },
    {
      title: "Writing The Intelligence Report",
      detail: "Compressing agent reactions, specialist insight, risks, opportunities, and next actions into one clear outcome.",
      signal: "REPORT BUILD",
    },
    {
      title: "Final Trust Pass",
      detail: "Making the answer practical, sober, useful, and ready for a human decision.",
      signal: "READY",
    },
  ];


  useEffect(() => {
    if (!isSubmitting) {
      setElapsedSeconds(0);
      return;
    }
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isSubmitting]);
  function handleChange(fieldId: string, value: string | string[]) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleMultiSelect(fieldId: string, option: string) {
    const current = (formData[fieldId] as string[]) || [];
    if (current.includes(option)) {
      handleChange(fieldId, current.filter((v) => v !== option));
    } else {
      handleChange(fieldId, [...current, option]);
    }
  }

  function validateSection() {
    const section = schema.sections[currentSection];
    for (const field of section.fields) {
      if (field.required) {
        const val = formData[field.id];
        if (!val || (Array.isArray(val) && val.length === 0) || val === "") {
          return false;
        }
      }
    }
    return true;
  }



  function serializeTruthChecks(checks: Record<number, TruthCheckValue>) {
    return JSON.stringify(
      Object.entries(checks).map(([sectionIndex, answer]) => ({
        sectionIndex: Number(sectionIndex),
        sectionTitle: schema.sections[Number(sectionIndex)]?.title ?? `Section ${Number(sectionIndex) + 1}`,
        answer,
      }))
    );
  }
  function openTruthCheck(action: "next" | "submit") {
    if (!validateSection()) return;
    if (truthChecks[currentSection]) {
      if (action === "next") setCurrentSection((p) => p + 1);
      else void handleSubmit();
      return;
    }
    setPendingAction(action);
  }

  function answerTruthCheck(value: TruthCheckValue) {
    const nextChecks = { ...truthChecks, [currentSection]: value };
    setTruthChecks(nextChecks);
    setFormData((prev) => ({
      ...prev,
      __truthStageChecks: serializeTruthChecks(nextChecks),
    }));
    const action = pendingAction;
    setPendingAction(null);
    if (action === "next") setCurrentSection((p) => p + 1);
    if (action === "submit") void handleSubmit(nextChecks);
  }
  async function handleSubmit(finalTruthChecks = truthChecks) {
    setIsSubmitting(true);
    setError(null);

    let step = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      step = (step + 1) % loadingSteps.length;
      setLoadingStep(step);
    }, 1350);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: schema.type, data: { ...formData, __truthStageChecks: serializeTruthChecks(finalTruthChecks) } }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const errData = (await res.json()) as { error?: string };
        throw new Error(errData.error || "Simulation failed");
      }

      const result = (await res.json()) as { id: string };
      sessionStorage.setItem(`sim_${result.id}`, JSON.stringify(result));
      router.push(`/results/${result.id}`);
    } catch (err) {
      clearInterval(interval);
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : "Simulation failed. Please try again.");
    }
  }

  if (isSubmitting) {
    const activeStep = loadingSteps[loadingStep];
    const progress = ((loadingStep + 1) / loadingSteps.length) * 100;
    const visibleChecks = loadingSteps.slice(0, loadingStep + 1).slice(-4);

    return (
      <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4 pb-20 pt-28">
        <div className="w-full overflow-hidden rounded-2xl border p-5 sm:p-8" style={{ background: "rgba(255,255,255,0.92)", borderColor: "rgba(15,23,42,0.16)", boxShadow: "0 18px 48px rgba(15,23,42,0.16)" }}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative mx-auto h-44 w-44 shrink-0 lg:mx-0">
              <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 120deg, #315FAE, #7C3AED, #DB2777, #C78616, #059669, #315FAE)", animation: "spinRing 6s linear infinite" }} />
              <div className="absolute inset-3 rounded-full" style={{ background: "#EEF4FB" }} />
              <div className="absolute inset-7 rounded-full border" style={{ borderColor: "rgba(49,95,174,0.28)", background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(227,236,246,0.92))" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black" style={{ color: "#315FAE" }}>{Math.round(progress)}%</span>
                <span className="mt-1 text-[9px] font-black uppercase tracking-[0.18em]" style={{ color: "#40516D" }}>Core Draw</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: "#7C3AED" }}>Install Mode</span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="section-label">OMNISIM BACKGROUND ENGINE</p>
              <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl" style={{ color: "#070A12" }}>
                {activeStep.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8" style={{ color: "#1E293B" }}>
                {activeStep.detail}
              </p>

              <div className="mt-6 overflow-hidden rounded-full border" style={{ background: "rgba(15,23,42,0.08)", borderColor: "rgba(15,23,42,0.12)" }}>
                <div
                  className="h-3 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, #315FAE, #7C3AED, #DB2777, #C78616)" }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Simulation", schema.title],
                  ["Status", `${activeStep.signal} · ${elapsedSeconds}s`],
                  ["Mode", schema.type === "legacy-view" ? "PRIVATE REFLECTION" : "MULTI-OUTCOME TEST"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border px-4 py-3" style={{ background: "rgba(255,255,255,0.78)", borderColor: "rgba(15,23,42,0.14)" }}>
                    <p className="text-[8px] font-black uppercase tracking-[0.18em]" style={{ color: "#40516D" }}>{label}</p>
                    <p className="mt-1 truncate text-xs font-black uppercase tracking-[0.08em]" style={{ color: "#070A12" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border p-5" style={{ background: "rgba(255,255,255,0.72)", borderColor: "rgba(15,23,42,0.14)" }}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#315FAE" }}>Live System Log</p>
              <div className="mt-4 space-y-3">
                {visibleChecks.map((step, i) => (
                  <div key={`${step.signal}-${i}`} className="flex gap-3 rounded-xl px-3 py-3" style={{ background: i === visibleChecks.length - 1 ? "rgba(49,95,174,0.10)" : "rgba(15,23,42,0.04)" }}>
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: i === visibleChecks.length - 1 ? "#315FAE" : "#059669", boxShadow: i === visibleChecks.length - 1 ? "0 0 14px rgba(49,95,174,0.45)" : "none" }} />
                    <div>
                      <p className="text-xs font-black" style={{ color: "#070A12" }}>{step.signal}</p>
                      <p className="mt-1 text-xs leading-5" style={{ color: "#40516D" }}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-5" style={{ background: "linear-gradient(135deg, rgba(49,95,174,0.10), rgba(124,58,237,0.10), rgba(199,134,22,0.10))", borderColor: "rgba(15,23,42,0.14)" }}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: "#7C3AED" }}>What is happening</p>
              <div className="mt-4 space-y-4 text-sm leading-7" style={{ color: "#1E293B" }}>
                <p>OmniSim is not just waiting. It is running agent reactions, testing assumptions, scanning risk and opportunity, then compressing the strongest signals into a readable intelligence brief.</p>
                <p>{schema.type === "legacy-view" ? "For this private reflection, the system avoids pretending to contact the deceased. It uses your memory, their values, and your current season to create grounded encouragement and a practical next step." : "For this simulation, the system compares likely human responses, pressure points, second-order effects, and multiple possible outcomes before presenting the final path."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const section = schema.sections[currentSection];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28">
      {/* Header */}
      <div className="mb-10">
        <p className="font-orbitron text-xs tracking-[0.4em] text-[#00F5FF]">
          {schema.icon} {schema.type.toUpperCase().replace(/-/g, " ")} SIMULATION
        </p>
        <h1 className="mt-3 font-orbitron text-3xl font-black text-white md:text-4xl">
          {schema.title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/40">{schema.description}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {schema.sections.map((s, i) => (
          <div key={i} className="flex flex-1 flex-col gap-2">
            <div
              className="h-0.5 rounded-full transition-all duration-500"
              style={{
                background:
                  i < currentSection
                    ? "#315FAE"
                    : i === currentSection
                    ? "linear-gradient(90deg, #00F5FF, #BF00FF)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
            <p
              className="text-center font-orbitron text-[8px] tracking-widest transition-colors"
              style={{ color: i <= currentSection ? "#315FAE" : "rgba(255,255,255,0.2)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      {/* Section card */}
      <div className="cyber-card p-6 md:p-10">
        <div className="mb-8 border-b border-white/8 pb-6">
          <p className="font-orbitron text-[9px] tracking-[0.5em] text-white/25">
            SECTION {currentSection + 1} OF {schema.sections.length}
          </p>
          <h2 className="mt-2 font-orbitron text-lg font-bold text-white md:text-2xl">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-2 text-sm text-white/40">{section.subtitle}</p>
          )}
        </div>

        <div className="space-y-8">
          {section.fields.map((field) => (
            <div key={field.id}>
              <label className="mb-1 block font-orbitron text-[10px] tracking-[0.25em] text-white/75">
                {field.label}
                {field.required && <span className="ml-1 text-[#FF0077]">*</span>}
              </label>
              {field.hint && (
                <p className="mb-3 text-[11px] leading-6 text-white/30">{field.hint}</p>
              )}

              {field.type === "text" && (
                <input
                  type="text"
                  className="form-input"
                  placeholder={field.placeholder}
                  value={(formData[field.id] as string) || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  className="form-input resize-none"
                  rows={field.rows || 4}
                  placeholder={field.placeholder}
                  value={(formData[field.id] as string) || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "select" && (
                <select
                  className="form-input"
                  value={(formData[field.id] as string) || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                >
                  <option value="">— Select —</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "multiselect" && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {field.options?.map((opt) => {
                    const selected = ((formData[field.id] as string[]) || []).includes(opt);
                    return (
                      <label
                        key={opt}
                        className="flex min-h-[46px] cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-bold leading-5 transition-all"
                        style={{
                          color: selected ? "#070A12" : "#1E293B",
                          background: selected ? "linear-gradient(135deg, rgba(49,95,174,0.22), rgba(124,58,237,0.16))" : "rgba(255,255,255,0.92)",
                          border: selected ? "1px solid rgba(49,95,174,0.55)" : "1px solid rgba(15,23,42,0.24)",
                          boxShadow: selected ? "0 8px 18px rgba(49,95,174,0.14)" : "0 6px 14px rgba(15,23,42,0.06)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleMultiSelect(field.id, opt)}
                          className="h-4 w-4 shrink-0 accent-[#315FAE]"
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  className="form-input"
                  value={(formData[field.id] as string) || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  className="form-input"
                  placeholder={field.placeholder}
                  value={(formData[field.id] as string) || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}

              {field.type === "radio" && (
                <div className="space-y-3">
                  {field.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 transition-all"
                      onClick={() => handleChange(field.id, opt)}
                      style={{
                        background: formData[field.id] === opt ? "linear-gradient(135deg, rgba(49,95,174,0.18), rgba(124,58,237,0.12))" : "rgba(255,255,255,0.88)",
                        border: formData[field.id] === opt ? "1px solid rgba(49,95,174,0.52)" : "1px solid rgba(15,23,42,0.20)",
                      }}
                    >
                      <div
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all"
                        style={{
                          borderColor:
                            formData[field.id] === opt
                              ? "#315FAE"
                              : "rgba(15,23,42,0.38)",
                          background:
                            formData[field.id] === opt
                              ? "rgba(49,95,174,0.16)"
                              : "rgba(255,255,255,0.92)",
                        }}
                      >
                        {formData[field.id] === opt && (
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: "#315FAE" }}
                          />
                        )}
                      </div>
                      <span className="text-sm font-semibold leading-6" style={{ color: "#1E293B" }}>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
            className="font-orbitron text-[10px] tracking-widest text-white/30 transition-colors hover:text-white disabled:opacity-0"
          >
            ← BACK
          </button>

          {error && (
            <p className="max-w-xs text-center text-[11px] text-[#FF0077]">{error}</p>
          )}

          {currentSection < schema.sections.length - 1 ? (
            <button type="button" onClick={() => openTruthCheck("next")} className="btn-neon">
              NEXT →
            </button>
          ) : (
            <button type="button" onClick={() => openTruthCheck("submit")} className="btn-solid">
              LAUNCH SIMULATION ⚡
            </button>
          )}
        </div>
      </div>


      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-4 sm:items-center sm:pb-0" style={{ background: "rgba(7,10,18,0.24)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-4 shadow-2xl sm:max-w-md" style={{ background: "rgba(255,255,255,0.96)", borderColor: "rgba(15,23,42,0.18)" }}>
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(49,95,174,0.18), rgba(124,58,237,0.14))", color: "#315FAE" }}>
                <span className="text-base font-black">i</span>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em]" style={{ color: "#315FAE" }}>Truth Checkpoint</p>
                <h3 className="mt-1 text-base font-black leading-tight" style={{ color: "#070A12" }}>{section.title}</h3>
                <p className="mt-2 text-xs leading-6" style={{ color: "#1E293B" }}>
                  Are these answers mostly facts, uncertain guesses, or emotion?
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <button type="button" onClick={() => answerTruthCheck("true")} className="rounded-xl px-3 py-2 text-left transition" style={{ background: "rgba(5,150,105,0.10)", border: "1px solid rgba(5,150,105,0.30)", color: "#064E3B" }}>
                <span className="block text-sm font-black">True</span>
                <span className="mt-1 block text-xs leading-5">Based on facts or evidence I trust.</span>
              </button>
              <button type="button" onClick={() => answerTruthCheck("unknown")} className="rounded-xl px-3 py-2 text-left transition" style={{ background: "rgba(199,134,22,0.12)", border: "1px solid rgba(199,134,22,0.32)", color: "#7A5208" }}>
                <span className="block text-sm font-black">I don&apos;t know</span>
                <span className="mt-1 block text-xs leading-5">Some parts are uncertain; lower confidence.</span>
              </button>
              <button type="button" onClick={() => answerTruthCheck("skip")} className="rounded-xl px-3 py-2 text-left transition" style={{ background: "rgba(15,23,42,0.06)", border: "1px solid rgba(15,23,42,0.18)", color: "#1E293B" }}>
                <span className="block text-sm font-black">Don&apos;t ask me</span>
                <span className="mt-1 block text-xs leading-5">Continue and mark this stage unverified.</span>
              </button>
            </div>

            <button type="button" onClick={() => setPendingAction(null)} className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "#40516D" }}>
              Back to edit
            </button>
          </div>
        </div>
      )}
      {/* Section jump pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {schema.sections.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSection(i)}
            className="rounded-sm px-3 py-1 font-orbitron text-[8px] tracking-widest transition-all"
            style={{
              color: i === currentSection ? "#315FAE" : i < currentSection ? "rgba(0,245,255,0.4)" : "rgba(255,255,255,0.15)",
              border:
                i === currentSection
                  ? "1px solid rgba(0,245,255,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
              background: i === currentSection ? "rgba(0,245,255,0.06)" : "rgba(255,255,255,0.92)",
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
