import SimForm from "@/components/SimForm";
import { customSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Custom Scenario Simulation",
};

export default function CustomPage() {
  return <SimForm schema={customSchema} />;
}
