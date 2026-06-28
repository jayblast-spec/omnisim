"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryRecord {
  id: string;
  type: string;
  status: string;
  created_at: string;
  result?: {
    confidenceLabel?: string;
    sentimentData?: {
      positive: number;
      negative: number;
      neutral: number;
    };
    prediction?: string;
  };
}

const typeLabels: Record<string, string> = {
  "public-reaction": "📡 Public Reaction",
  election: "🗳️ Election",
  markets: "📈 Markets",
  sports: "⚽ Sports",
  policy: "📜 Policy",
  "product-launch": "🚀 Product Launch",
  geopolitical: "🌍 Geopolitical",
  custom: "⚡ Custom",
};

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data: { records?: HistoryRecord[] }) => {
        setRecords(data.records || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen px-5 pb-24 pt-28 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="section-label">SIMULATION ARCHIVE</p>
          <h1 className="mt-4 font-orbitron text-3xl font-black text-white">History</h1>
          <p className="mt-3 text-sm text-white/35">
            Your past simulations. Each prediction stored for reference.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <div
              className="h-10 w-10 rounded-full border-2 border-transparent"
              style={{ borderTopColor: "#00F5FF", animation: "spinRing 1s linear infinite" }}
            />
          </div>
        )}

        {!loading && records.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-orbitron text-white/25">NO SIMULATIONS YET</p>
            <Link href="/simulate" className="btn-neon mt-8 inline-flex">
              RUN YOUR FIRST SIMULATION
            </Link>
          </div>
        )}

        {!loading && records.length > 0 && (
          <div className="space-y-4">
            {records.map((rec) => (
              <Link
                key={rec.id}
                href={`/results/${rec.id}`}
                className="cyber-card flex flex-col gap-3 p-6 transition-all hover:-translate-y-0.5 hover:border-[rgba(0,245,255,0.3)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-orbitron text-sm font-bold text-white">
                      {typeLabels[rec.type] || rec.type}
                    </p>
                    {rec.result?.confidenceLabel && (
                      <span
                        className="rounded-sm px-2 py-0.5 font-orbitron text-[8px] tracking-widest"
                        style={{
                          color: "#00F5FF",
                          background: "rgba(0,245,255,0.08)",
                          border: "1px solid rgba(0,245,255,0.2)",
                        }}
                      >
                        {rec.result.confidenceLabel}
                      </span>
                    )}
                  </div>
                  {rec.result?.prediction && (
                    <p className="mt-2 text-xs leading-6 text-white/35 line-clamp-2">
                      {rec.result.prediction}
                    </p>
                  )}
                  <p className="mt-2 font-orbitron text-[8px] tracking-widest text-white/20">
                    {new Date(rec.created_at).toLocaleString()}
                  </p>
                </div>

                {rec.result?.sentimentData && (
                  <div className="flex flex-shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                    <span className="font-orbitron text-[9px] text-[#00FF7F]">
                      +{rec.result.sentimentData.positive}%
                    </span>
                    <span className="font-orbitron text-[9px] text-[#00F5FF]">
                      ={rec.result.sentimentData.neutral}%
                    </span>
                    <span className="font-orbitron text-[9px] text-[#FF0077]">
                      -{rec.result.sentimentData.negative}%
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
