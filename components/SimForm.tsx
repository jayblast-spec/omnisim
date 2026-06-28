"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormSchema } from "@/lib/formSchemas";

interface SimFormProps {
  schema: FormSchema;
}

export default function SimForm({ schema }: SimFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingSteps = [
    "INITIALIZING SIMULATION ENGINE...",
    "LOADING GLOBAL AGENT MATRIX...",
    "DEPLOYING 20 AI AGENTS WORLDWIDE...",
    "CALIBRATING AGENT PERSPECTIVES...",
    "RUNNING PARALLEL SIMULATIONS...",
    "AGGREGATING GLOBAL SENTIMENT...",
    "GENERATING INTELLIGENCE REPORT...",
    "FINALIZING PREDICTIONS...",
  ];

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

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    let step = 0;
    const interval = setInterval(() => {
      step = Math.min(step + 1, loadingSteps.length - 1);
      setLoadingStep(step);
    }, 800);

    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: schema.type, data: formData }),
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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-10 px-4">
        <div className="relative h-36 w-36">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#00F5FF",
              animation: "spinRing 2s linear infinite",
            }}
          />
          <div
            className="absolute inset-5 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#BF00FF",
              animation: "spinRing 3s linear infinite reverse",
            }}
          />
          <div
            className="absolute inset-10 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#FF0077",
              animation: "spinRing 1.5s linear infinite",
            }}
          />
          <div
            className="absolute inset-[52px] rounded-full"
            style={{ background: "#00F5FF", boxShadow: "0 0 20px #00F5FF" }}
          />
        </div>
        <div className="text-center">
          <p
            className="font-orbitron text-xs tracking-[0.4em]"
            style={{ color: "#00F5FF", textShadow: "0 0 8px #00F5FF" }}
          >
            {loadingSteps[loadingStep]}
          </p>
          <div className="mx-auto mt-6 h-1 w-72 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`,
                background: "linear-gradient(90deg, #00F5FF, #BF00FF)",
              }}
            />
          </div>
          <p className="mt-4 font-orbitron text-[9px] tracking-widest text-white/20">
            AGENTS ACTIVE WORLDWIDE
          </p>
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
                    ? "#00F5FF"
                    : i === currentSection
                    ? "linear-gradient(90deg, #00F5FF, #BF00FF)"
                    : "rgba(255,255,255,0.08)",
              }}
            />
            <p
              className="text-center font-orbitron text-[8px] tracking-widest transition-colors"
              style={{ color: i <= currentSection ? "#00F5FF" : "rgba(255,255,255,0.2)" }}
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
                <div className="flex flex-wrap gap-2">
                  {field.options?.map((opt) => {
                    const selected = ((formData[field.id] as string[]) || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleMultiSelect(field.id, opt)}
                        className="rounded-sm px-3 py-2 text-[11px] font-bold tracking-wide transition-all"
                        style={{
                          color: selected ? "#00F5FF" : "rgba(255,255,255,0.45)",
                          background: selected ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.04)",
                          border: selected
                            ? "1px solid rgba(0,245,255,0.5)"
                            : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {opt}
                      </button>
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
                      className="flex cursor-pointer items-center gap-3"
                      onClick={() => handleChange(field.id, opt)}
                    >
                      <div
                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-all"
                        style={{
                          borderColor:
                            formData[field.id] === opt
                              ? "#00F5FF"
                              : "rgba(255,255,255,0.2)",
                          background:
                            formData[field.id] === opt
                              ? "rgba(0,245,255,0.1)"
                              : "transparent",
                        }}
                      >
                        {formData[field.id] === opt && (
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: "#00F5FF" }}
                          />
                        )}
                      </div>
                      <span className="text-sm text-white/60">{opt}</span>
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
            <button type="button" onClick={() => validateSection() && setCurrentSection((p) => p + 1)} className="btn-neon">
              NEXT →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn-solid">
              LAUNCH SIMULATION ⚡
            </button>
          )}
        </div>
      </div>

      {/* Section jump pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {schema.sections.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentSection(i)}
            className="rounded-sm px-3 py-1 font-orbitron text-[8px] tracking-widest transition-all"
            style={{
              color: i === currentSection ? "#00F5FF" : i < currentSection ? "rgba(0,245,255,0.4)" : "rgba(255,255,255,0.15)",
              border:
                i === currentSection
                  ? "1px solid rgba(0,245,255,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
              background: i === currentSection ? "rgba(0,245,255,0.06)" : "transparent",
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
}
