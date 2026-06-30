import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabaseClient";
import { getRequestUser } from "@/lib/serverAuth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    if (!id || id.length > 80) {
      return NextResponse.json({ error: "Invalid simulation id" }, { status: 400 });
    }

    const url = new URL(request.url);
    const share = url.searchParams.get("share");
    const user = await getRequestUser(request);
    const db = createServiceClient();

    let query = db.from("simulations").select("id,type,result,user_id,visibility,share_token,created_at").eq("id", id).limit(1);
    const { data, error } = await query.maybeSingle();

    if (error) {
      const legacy = await db.from("simulations").select("id,type,result,created_at").eq("id", id).maybeSingle();
      if (legacy.error || !legacy.data) return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
      return NextResponse.json({ result: legacy.data.result });
    }

    if (!data) return NextResponse.json({ error: "Simulation not found" }, { status: 404 });

    const row = data as {
      result: unknown;
      user_id?: string | null;
      visibility?: string | null;
      share_token?: string | null;
    };

    const isOwner = !!user && !!row.user_id && row.user_id === user.id;
    const isLegacyAnonymous = !row.user_id;
    const isShared = row.visibility === "unlisted" && !!share && !!row.share_token && share === row.share_token;
    const isPublic = row.visibility === "public";

    if (!isOwner && !isLegacyAnonymous && !isShared && !isPublic) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 });
    }

    return NextResponse.json({ result: row.result });
  } catch (err) {
    console.error("Result fetch error:", err);
    return NextResponse.json({ error: "Unable to load simulation" }, { status: 500 });
  }
}