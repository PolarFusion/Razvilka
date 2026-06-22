import {
  DIVERGENCE_SYSTEM_PROMPT,
  buildLocalResult,
  buildSafetyResult,
  isHighRiskInput,
  stripHtml,
  type AnswersMap,
  type DivergenceResult,
  type FieldValue,
} from "@/app/lib/divergence";

type GenerateBody = {
  answers: Record<string, FieldValue>;
};

function normalizeAnswers(answers: Record<string, FieldValue>) {
  const normalized: AnswersMap = {};

  for (const [key, value] of Object.entries(answers ?? {})) {
    const safeKey = stripHtml(key).trim();
    if (!safeKey) continue;

    if (Array.isArray(value)) {
      normalized[safeKey] = value
        .map((item) => stripHtml(String(item)).trim())
        .filter(Boolean);
      continue;
    }

    if (typeof value === "number") {
      normalized[safeKey] = value;
      continue;
    }

    normalized[safeKey] = stripHtml(String(value)).trim();
  }

  return normalized;
}

function sanitizeResult(result: Record<string, unknown>, fallback: DivergenceResult): DivergenceResult {
  const pickString = (key: keyof DivergenceResult, fallbackValue: string) =>
    typeof result[key] === "string" && String(result[key]).trim()
      ? String(result[key])
      : fallbackValue;

  const behaviorLoop = typeof result.behavior_loop === "object" && result.behavior_loop
    ? (result.behavior_loop as Record<string, unknown>)
    : {};

  const storyCard = typeof result.story_card === "object" && result.story_card
    ? (result.story_card as Record<string, unknown>)
    : {};

  return {
    profile_title: pickString("profile_title", fallback.profile_title),
    archetype: pickString("archetype", fallback.archetype),
    confidence_level:
      result.confidence_level === "high" || result.confidence_level === "medium" || result.confidence_level === "low"
        ? result.confidence_level
        : fallback.confidence_level,
    short_summary: pickString("short_summary", fallback.short_summary),
    dark_future_letter: pickString("dark_future_letter", fallback.dark_future_letter),
    strong_future_letter: pickString("strong_future_letter", fallback.strong_future_letter),
    behavior_loop: {
      trigger:
        typeof behaviorLoop.trigger === "string" && behaviorLoop.trigger.trim()
          ? behaviorLoop.trigger
          : fallback.behavior_loop.trigger,
      automatic_reaction:
        typeof behaviorLoop.automatic_reaction === "string" && behaviorLoop.automatic_reaction.trim()
          ? behaviorLoop.automatic_reaction
          : fallback.behavior_loop.automatic_reaction,
      temporary_reward:
        typeof behaviorLoop.temporary_reward === "string" && behaviorLoop.temporary_reward.trim()
          ? behaviorLoop.temporary_reward
          : fallback.behavior_loop.temporary_reward,
      price:
        typeof behaviorLoop.price === "string" && behaviorLoop.price.trim()
          ? behaviorLoop.price
          : fallback.behavior_loop.price,
      loop_breaker:
        typeof behaviorLoop.loop_breaker === "string" && behaviorLoop.loop_breaker.trim()
          ? behaviorLoop.loop_breaker
          : fallback.behavior_loop.loop_breaker,
    },
    main_pattern: pickString("main_pattern", fallback.main_pattern),
    main_risk: pickString("main_risk", fallback.main_risk),
    main_strength: pickString("main_strength", fallback.main_strength),
    first_72h_step: pickString("first_72h_step", fallback.first_72h_step),
    if_then_plan: pickString("if_then_plan", fallback.if_then_plan),
    story_card: {
      title:
        typeof storyCard.title === "string" && storyCard.title.trim()
          ? storyCard.title
          : fallback.story_card.title,
      if_nothing_changes:
        typeof storyCard.if_nothing_changes === "string" && storyCard.if_nothing_changes.trim()
          ? storyCard.if_nothing_changes
          : fallback.story_card.if_nothing_changes,
      if_i_start_now:
        typeof storyCard.if_i_start_now === "string" && storyCard.if_i_start_now.trim()
          ? storyCard.if_i_start_now
          : fallback.story_card.if_i_start_now,
      main_risk:
        typeof storyCard.main_risk === "string" && storyCard.main_risk.trim()
          ? storyCard.main_risk
          : fallback.story_card.main_risk,
      first_step:
        typeof storyCard.first_step === "string" && storyCard.first_step.trim()
          ? storyCard.first_step
          : fallback.story_card.first_step,
    },
    disclaimer: pickString("disclaimer", fallback.disclaimer),
  };
}

export async function POST(request: Request) {
  let fallback: DivergenceResult | null = null;

  try {
    const body = (await request.json()) as GenerateBody;
    const answers = normalizeAnswers(body.answers ?? {});

    if (Object.keys(answers).length === 0) {
      return Response.json({ error: "No answers provided" }, { status: 400 });
    }

    if (isHighRiskInput(answers)) {
      return Response.json(buildSafetyResult(answers));
    }

    fallback = buildLocalResult(answers);
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json(fallback);
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Развилка",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "deepseek/deepseek-v4-pro",
        messages: [
          {
            role: "system",
            content: DIVERGENCE_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: JSON.stringify(
              {
                answers,
                scaffold: {
                  profile_title: fallback.profile_title,
                  archetype: fallback.archetype,
                  confidence_level: fallback.confidence_level,
                  behavior_loop: fallback.behavior_loop,
                  main_pattern: fallback.main_pattern,
                  main_risk: fallback.main_risk,
                  main_strength: fallback.main_strength,
                  first_72h_step: fallback.first_72h_step,
                },
                requirements: {
                  output_format: "strict_json",
                  depth: "deep",
                  tone: "cinematic, honest, safe",
                },
              },
              null,
              2,
            ),
          },
        ],
        temperature: 0.58,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return Response.json(fallback);
    }

    const json = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const text = json.choices?.[0]?.message?.content;
    if (!text) {
      return Response.json(fallback);
    }

    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      return Response.json(sanitizeResult(parsed, fallback));
    } catch {
      return Response.json(fallback);
    }
  } catch {
    if (fallback) {
      return Response.json(fallback);
    }

    return Response.json({ error: "Analysis failed" }, { status: 500 });
  }
}
