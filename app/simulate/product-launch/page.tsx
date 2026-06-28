import SimForm from "@/components/SimForm";
import { productLaunchSchema } from "@/lib/formSchemas";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OMNISIM — Product Launch Simulation",
};

export default function ProductLaunchPage() {
  return <SimForm schema={productLaunchSchema} />;
}
