import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const InputSchema = z.object({
  input: z
    .string()
    .min(1, "Tell me something to roast.")
    .max(500, "Keep it under 500 characters.")
    .transform((s) => s.replace(/[\u0000-\u001F\u007F]/g, "").trim()),
});

const AiSchema = z
  .object({
    roast: z.string().min(1).max(600),
    reality_check: z.string().min(1).max(800),
    advice: z.string().min(1).max(1000),
  })
  .strict();

const SYSTEM_PROMPT = `You are "Reality Slap" — a witty, sharp-tongued life coach.
Given a user's habit, excuse, problem, or situation, return ONLY a valid minified JSON object with EXACTLY these three keys:
- "roast": 1-2 sentences. Witty, sharp, playful. Never cruel about protected traits (race, gender, disability, religion, sexuality). Punchy.
- "reality_check": 2-3 sentences. Brutally honest, factual, no sugar-coating. Address what is actually happening.
- "advice": 2-4 sentences. Concrete, actionable next steps the user can do this week.
If the input mentions self-harm, suicide, or crisis: skip the roast tone — set "roast" to a kind acknowledgement, give a compassionate "reality_check", and in "advice" gently suggest contacting a local crisis helpline or trusted person.
Reply with the JSON object ONLY. No prose, no markdown, no code fences.`;

type RoastRow = {
  id: string;
  user_input: string;
  roast: string;
  reality_check: string;
  advice: string;
  created_at: string;
};

async function callAi(userInput: string, retryHint = false): Promise<unknown> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(retryHint
      ? [
          {
            role: "system",
            content:
              "Your last reply was invalid JSON. Reply ONLY with the JSON object, no prose.",
          },
        ]
      : []),
    { role: "user", content: userInput },
  ];

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Lovable-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      response_format: { type: "json_object" },
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Rate limit hit. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace settings.");
    throw new Error(`AI ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    // Try to extract a JSON object substring as a fallback
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI returned non-JSON output");
  }
}

export const generateRoast = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const userInput = data.input;

    // First attempt
    let parsed: unknown;
    try {
      parsed = await callAi(userInput, false);
    } catch (e) {
      console.error("[generateRoast] first attempt failed:", e);
      parsed = await callAi(userInput, true);
    }

    let validated: z.infer<typeof AiSchema>;
    try {
      validated = AiSchema.parse(parsed);
    } catch {
      // Retry once with stricter reminder if shape is wrong
      const second = await callAi(userInput, true);
      validated = AiSchema.parse(second);
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data: row, error } = await supabase
      .from("roasts")
      .insert({
        user_input: userInput,
        roast: validated.roast,
        reality_check: validated.reality_check,
        advice: validated.advice,
      })
      .select()
      .single();

    if (error) {
      console.error("[generateRoast] insert failed:", error);
      throw new Error("Could not save roast");
    }

    return row as RoastRow;
  });
