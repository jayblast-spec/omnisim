"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ResultsDashboard, { SimulationResult } from "@/components/ResultsDashboard";
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

    supabase
      .from("simulations")
      .select("result")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setResult(data.result as SimulationResult);
        }
        setLoading(false);
      });
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
        <p className="font-orbitron text-lg text-[#FF0077]">
          SIMULATION NOT FOUND
        </p>
        <p className="text-sm text-white/35">
          Results may have expired or the simulation ID is invalid.
        </p>
        <Link href="/simulate" className="btn-solid">
          RUN NEW SIMULATION
        </Link>
      </div>
    );
  }

  return <ResultsDashboard result={result} />;
}
