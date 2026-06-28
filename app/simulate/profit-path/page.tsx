import SimForm from "@/components/SimForm";
import { profitPathSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — $1K Profit Path Simulation",
};

export default function ProfitPathPage() {
  return <SimForm schema={profitPathSchema} />;
}