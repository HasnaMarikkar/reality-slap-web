import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "@/integrations/supabase/server-fn-auth";

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

const SYSTEM_PROMPT = `You are "Reality Slap" — a witty, sarcastic but supportive friend.
Given a user's habit, excuse, problem, or situation, return ONLY a valid minified JSON object with EXACTLY these three keys:
- "roast": 1-2 sentences. Playful sarcasm, teen-friendly. NEVER cruel, hateful, NSFW, or about protected traits.
- "reality_check": 2-3 sentences. Honest and grounded — call out the pattern without bullying.
- "advice": 2-4 sentences. Concrete, actionable next steps for this week.
If the input mentions self-harm, suicide, or crisis: drop the roast tone — set "roast" to a kind acknowledgement, give a compassionate "reality_check", and in "advice" gently suggest contacting a local crisis helpline or trusted person.
Reply with the JSON object ONLY. No prose, no markdown, no code fences.`;

type RoastRow = {
  id: string;
  user_id: string;
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
      model: "google/gemini-2.5-flash",
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`[callAi] AI gateway error ${res.status}:`, text);
    if (res.status === 429) throw new Error("Too many requests. Please try again in a moment.");
    if (res.status === 402) throw new Error("Service temporarily unavailable.");
    throw new Error("AI service error. Please try again.");
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("AI returned non-JSON output");
  }
}

// Guest version: no auth, no DB persistence — returns ephemeral roast only.
export const generateRoastGuest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const userInput = data.input;
    let parsed: unknown;
    try {
      parsed = await callAi(userInput, false);
    } catch (e) {
      console.error("[generateRoastGuest] first attempt failed:", e);
      parsed = await callAi(userInput, true);
    }
    let validated: z.infer<typeof AiSchema>;
    try {
      validated = AiSchema.parse(parsed);
    } catch {
      const second = await callAi(userInput, true);
      validated = AiSchema.parse(second);
    }
    return {
      id: `guest-${crypto.randomUUID()}`,
      user_input: userInput,
      roast: validated.roast,
      reality_check: validated.reality_check,
      advice: validated.advice,
      created_at: new Date().toISOString(),
    };
  });

export const generateRoast = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const userInput = data.input;
    const { supabase, userId } = context;

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
      const second = await callAi(userInput, true);
      validated = AiSchema.parse(second);
    }

    const { data: row, error } = await supabase
      .from("roasts")
      .insert({
        user_id: userId,
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
