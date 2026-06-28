import SimForm from "@/components/SimForm";
import { policySchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Policy Impact Simulation",
};

export default function PolicyPage() {
  return <SimForm schema={policySchema} />;
}
