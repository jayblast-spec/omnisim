import SimForm from "@/components/SimForm";
import { geopoliticalSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Geopolitical Event Simulation",
};

export default function GeopoliticalPage() {
  return <SimForm schema={geopoliticalSchema} />;
}
