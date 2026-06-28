import SimForm from "@/components/SimForm";
import { sportsSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Sports Match Simulation",
};

export default function SportsPage() {
  return <SimForm schema={sportsSchema} />;
}
