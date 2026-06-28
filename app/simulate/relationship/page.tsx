import SimForm from "@/components/SimForm";
import { relationshipSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Relationship Future Simulation",
};

export default function RelationshipPage() {
  return <SimForm schema={relationshipSchema} />;
}