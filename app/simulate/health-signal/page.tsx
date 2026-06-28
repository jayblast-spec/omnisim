import SimForm from "@/components/SimForm";
import { healthSignalSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM - Health Signal Simulation",
  description: "Organize symptoms, vitals, genotype, blood type, medication context, red flags, and care access for educational triage support.",
};

export default function HealthSignalPage() {
  return <SimForm schema={healthSignalSchema} />;
}