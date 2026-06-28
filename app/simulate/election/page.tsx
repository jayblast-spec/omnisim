import SimForm from "@/components/SimForm";
import { electionSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Election Outcome Simulation",
};

export default function ElectionPage() {
  return <SimForm schema={electionSchema} />;
}
