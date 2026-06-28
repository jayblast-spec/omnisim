import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("simulations")
      .select("id, type, status, created_at, result")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ records: data || [] });
  } catch (err) {
    console.error("History fetch error:", err);
    return NextResponse.json({ records: [], error: "Failed to fetch history" }, { status: 500 });
  }
}
