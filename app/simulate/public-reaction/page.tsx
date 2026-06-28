import SimForm from "@/components/SimForm";
import { publicReactionSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Public Reaction Simulation",
};

export default function PublicReactionPage() {
  return <SimForm schema={publicReactionSchema} />;
}
