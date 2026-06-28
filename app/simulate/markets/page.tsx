import SimForm from "@/components/SimForm";
import { marketsSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Market Movement Simulation",
};

export default function MarketsPage() {
  return <SimForm schema={marketsSchema} />;
}
