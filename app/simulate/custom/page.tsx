import CauseEffectEngine from "@/components/CauseEffectEngine";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Custom Scenario Simulation",
  description:
    "Build any simulation scenario you can imagine. Climate events, social movements, technological disruptions — trace the cause-and-effect cascade.",
};

export default function CustomPage() {
  return <CauseEffectEngine />;
}
