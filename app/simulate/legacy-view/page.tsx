import SimForm from "@/components/SimForm";
import { legacyViewSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM - Loved One Legacy View Simulation",
  description: "Reflect on how a passed loved one might view your life now with stoic encouragement and resilience guidance.",
};

export default function LegacyViewPage() {
  return <SimForm schema={legacyViewSchema} />;
}