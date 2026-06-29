import { NextResponse } from "next/server";

interface CauseEffectPayload {
  scenario: string;
}

export interface Effect {
  domain: string;
  effect: string;
  severity: number;
}

export interface BehaviorPattern {
  group: string;
  response: string;
  sentiment: "fear" | "anger" | "hope" | "adaptation" | "confusion" | "resistance";
}

export interface CauseEffectResult {
  id: string;
  scenario: string;
  triggerEvent: string;
  immediateEffects: Effect[];
  secondaryEffects: Effect[];
  longTermTrajectory: Effect[];
  humanBehaviorPatterns: BehaviorPattern[];
  hiddenForces: string[];
  tippingPoint: string;
  outlook: "catastrophic" | "destabilizing" | "neutral" | "transformative" | "positive";
  confidence: number;
  createdAt: string;
}

const SYSTEM_PROMPT = `You are OMNISIM's Cascade Intelligence Engine — an advanced AI that traces cause-and-effect ripples of any scenario across time horizons.

Given any scenario (political, technological, environmental, social, economic, or speculative), trace its cascading consequences and analyze how human populations respond.

CRITICAL: Return ONLY valid JSON. No markdown, no backticks, no explanation. Raw JSON object only.

Return this exact structure:
{
  "triggerEvent": "One precise sentence stating what happened as a confirmed event",
  "immediateEffects": [
    { "domain": "Economy|Politics|Technology|Society|Media|Security|Health|Environment", "effect": "Specific consequence in 1-2 sentences", "severity": 1 }
  ],
  "secondaryEffects": [
    { "domain": "...", "effect": "...", "severity": 1 }
  ],
  "longTermTrajectory": [
    { "domain": "...", "effect": "...", "severity": 1 }
  ],
  "humanBehaviorPatterns": [
    { "group": "Specific demographic segment", "response": "How this group actually behaves", "sentiment": "fear|anger|hope|adaptation|confusion|resistance" }
  ],
  "hiddenForces": ["Force 1", "Force 2", "Force 3"],
  "tippingPoint": "The single critical decision or development that determines which timeline unfolds",
  "outlook": "catastrophic|destabilizing|neutral|transformative|positive",
  "confidence": 72
}

Rules:
- immediateEffects: 4-6 items (0-6 months)
- secondaryEffects: 4-6 items (6-24 months, reactions to the immediate effects)
- longTermTrajectory: 3-5 items (2-10 years, where it all lands)
- humanBehaviorPatterns: 5-7 distinct, specific population segments with authentic non-stereotyped reactions
- hiddenForces: exactly 3 factors the scenario creator likely didn't account for
- severity: integer 1-10 (1-3 minor, 4-6 significant, 7-9 major, 10 civilization-altering)
- Be analytical, specific, and honest — show both positive and negative ripples
- confidence: integer 0-100 reflecting analytical certainty`;

async function runCascadeAnalysis(scenario: string): Promise<Omit<CauseEffectResult, "id" | "scenario" | "createdAt">> {
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Trace the full cause-and-effect cascade for this scenario:\n\n"${scenario}"`,
        },
      ],
      max_tokens: 2400,
      temperature: 0.68,
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Groq error ${resp.status}: ${err}`);
  }

  const data = (await resp.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content) as Omit<CauseEffectResult, "id" | "scenario" | "createdAt">;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CauseEffectPayload;
    const scenario = body.scenario?.trim();

    if (!scenario || scenario.length < 10) {
      return NextResponse.json(
        { error: "Describe a scenario (at least 10 characters)" },
        { status: 400 }
      );
    }

    if (scenario.length > 2000) {
      return NextResponse.json(
        { error: "Scenario too long — keep it under 2000 characters" },
        { status: 400 }
      );
    }

    const analysis = await runCascadeAnalysis(scenario);
    const id = `ce_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const result: CauseEffectResult = {
      ...analysis,
      id,
      scenario,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Cause-effect engine error:", error);
    return NextResponse.json(
      { error: "Simulation failed — please try again" },
      { status: 500 }
    );
  }
}
