import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseClient";
import { getRequestUser } from "@/lib/serverAuth";

export async function GET(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user) {
      return NextResponse.json(
        { records: [], authRequired: true, error: "Sign in to view your private history" },
        { status: 401 }
      );
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("simulations")
      .select("id, type, status, created_at, truth_score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("History owner query error:", error);
      return NextResponse.json({ records: [] });
    }

    return NextResponse.json({ records: data || [] });
  } catch (err) {
    console.error("History fetch error:", err);
    return NextResponse.json({ records: [], error: "Failed to fetch history" }, { status: 500 });
  }
}