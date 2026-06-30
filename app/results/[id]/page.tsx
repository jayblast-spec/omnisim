"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ResultsDashboard, SimulationResult } from "@/components/ResultsDashboard";
import Link from "next/link";

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const cached = sessionStorage.getItem(`sim_${id}`);
    if (cached) {
      try {
        setResult(JSON.parse(cached) as SimulationResult);
        setLoading(false);
        return;
      } catch {}
    }

    async function loadResult() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
        const res = await fetch(`/api/results/${id}`, { headers, cache: "no-store" });
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const payload = (await res.json()) as { result?: SimulationResult };
        if (!payload.result) {
          setNotFound(true);
          return;
        }
        setResult(payload.result);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    void loadResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-16 w-16 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#00F5FF", animation: "spinRing 1s linear infinite" }}
        />
      </div>
    );
  }

  if (notFound || !result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
        <p className="font-orbitron text-lg text-[#FF0077]">SIMULATION NOT FOUND</p>
        <p className="text-sm text-white/35">Results may have expired or the simulation ID is invalid.</p>
        <Link href="/simulate" className="btn-solid">RUN NEW SIMULATION</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/simulate" className="text-[10px] font-bold uppercase tracking-[0.25em] transition" style={{ color: "rgba(255,255,255,0.4)" }}>
            ← New Simulation
          </Link>
          <Link href="/history" className="text-[10px] font-bold uppercase tracking-[0.25em] transition" style={{ color: "rgba(255,255,255,0.4)" }}>
            History →
          </Link>
        </div>
        <ResultsDashboard result={result} />
      </div>
    </div>
  );
}
