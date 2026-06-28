import Link from "next/link";
import { simTypes } from "@/lib/siteConfig";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Simulation Hub",
  description: "Choose your simulation type. 11 categories powered by 35 global AI agents.",
};

export default function SimulatePage() {
  return (
    <div className="min-h-screen px-5 pb-24 pt-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="section-label">SIMULATION HUB</p>
          <h1 className="mt-4 font-orbitron text-4xl font-black text-white md:text-5xl">
            Choose Your Simulation
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-white/40">
            Each simulation type has a tailored intelligence intake form. Fill it in, and 20 global AI agents react to your exact scenario, or reflect through a grief-safe legacy lens when the simulation is personal.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {simTypes.map((sim) => (
            <Link
              key={sim.id}
              href={`/simulate/${sim.id}`}
              className="cyber-card group flex flex-col gap-5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(0,245,255,0.3)]"
            >
              <div className="text-5xl">{sim.icon}</div>
              <div className="flex-1">
                <p className="font-orbitron text-base font-bold text-white group-hover:text-[#00F5FF] transition-colors">
                  {sim.title}
                </p>
                <p className="mt-3 text-xs leading-7 text-white/35">{sim.description}</p>
              </div>
              <div className="border-t border-white/5 pt-4">
                <p className="font-orbitron text-[8px] tracking-widest text-white/20">
                  {sim.usedBy}
                </p>
                <p className="mt-2 font-orbitron text-[9px] tracking-widest text-[#00F5FF]">
                  BEGIN SIMULATION →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
