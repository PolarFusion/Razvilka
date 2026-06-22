"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  INTERVIEW_STEPS,
  createEmptyAnswers,
  getFieldCount,
  getStepByIndex,
  type AnswersMap,
  type DivergenceResult,
  type FieldValue,
  type InterviewField,
  type InterviewStep,
  validateStep,
} from "@/app/lib/divergence";

type Mode = "landing" | "warning" | "form" | "loading" | "result" | "error";

const STORAGE_KEY = "divergence-session-v1";
const LOADING_STAGES = [
  "Собираем петлю поведения",
  "Считаем цену старого паттерна",
  "Сравниваем две траектории",
  "Пишем письмо из будущего",
];

function getFieldValue(answers: AnswersMap, field: InterviewField): FieldValue {
  const current = answers[field.key];
  if (current !== undefined) return current;
  if (field.kind === "multiselect") return [];
  if (field.kind === "number") return "";
  return "";
}

function buildCopyText(result: DivergenceResult) {
  return [
    result.profile_title,
    `Архетип: ${result.archetype}`,
    `Короткий вывод: ${result.short_summary}`,
    "",
    "Тёмная ветка:",
    result.dark_future_letter,
    "",
    "Сильная ветка:",
    result.strong_future_letter,
    "",
    "Петля поведения:",
    `Триггер: ${result.behavior_loop.trigger}`,
    `Автоматическая реакция: ${result.behavior_loop.automatic_reaction}`,
    `Временная выгода: ${result.behavior_loop.temporary_reward}`,
    `Цена: ${result.behavior_loop.price}`,
    `Разрыв петли: ${result.behavior_loop.loop_breaker}`,
    "",
    `Главный риск: ${result.main_risk}`,
    `Главная сильная сторона: ${result.main_strength}`,
    `Первый шаг на 72 часа: ${result.first_72h_step}`,
    `План если — то: ${result.if_then_plan}`,
    "",
    `${result.disclaimer}`,
  ].join("\n");
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }

    if (current) lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
}

async function downloadStoryCardPNG(result: DivergenceResult) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#091014");
  bg.addColorStop(0.45, "#101723");
  bg.addColorStop(1, "#1c1320");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const accent = ctx.createLinearGradient(80, 120, 980, 1680);
  accent.addColorStop(0, "rgba(255,255,255,0.14)");
  accent.addColorStop(1, "rgba(126,221,194,0.10)");
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(220, 250, 280, 180, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,136,108,0.12)";
  ctx.beginPath();
  ctx.ellipse(900, 280, 260, 220, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.fillRect(90, 150, 900, 1620);
  ctx.strokeRect(90, 150, 900, 1620);

  ctx.fillStyle = "#e9f0ec";
  ctx.font = '600 30px "Inter", sans-serif';
  ctx.fillText("Моя развилка", 140, 240);

  ctx.fillStyle = "#ffffff";
  ctx.font = '700 72px "Georgia", serif';
  const titleLines = wrapLines(ctx, result.story_card.title, 760);
  let y = 360;
  for (const line of titleLines) {
    ctx.fillText(line, 140, y);
    y += 82;
  }

  const blocks = [
    { label: "Если ничего не изменить", value: result.story_card.if_nothing_changes },
    { label: "Если начать сейчас", value: result.story_card.if_i_start_now },
    { label: "Главный риск", value: result.story_card.main_risk },
    { label: "Первый шаг", value: result.story_card.first_step },
  ];

  let blockY = 600;
  for (const block of blocks) {
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(140, blockY, 800, 230);
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.strokeRect(140, blockY, 800, 230);
    ctx.fillStyle = "#90a4d8";
    ctx.font = '600 24px "Inter", sans-serif';
    ctx.fillText(block.label.toUpperCase(), 180, blockY + 54);
    ctx.fillStyle = "#ffffff";
    ctx.font = '500 28px "Inter", sans-serif';
    const lines = wrapLines(ctx, block.value, 720).slice(0, 4);
    let textY = blockY + 104;
    for (const line of lines) {
      ctx.fillText(line, 180, textY);
      textY += 38;
    }
    blockY += 270;
  }

  ctx.fillStyle = "#cfd7d0";
  ctx.font = '500 24px "Inter", sans-serif';
  ctx.fillText("Развилка не является диагнозом или предсказанием будущего.", 140, 1710);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "razvilka-card.png";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function FieldLabel({ field }: { field: InterviewField }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <label className="text-sm font-medium text-white">{field.label}</label>
      {field.required ? (
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-white/34">обязательно</span>
      ) : null}
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-2 text-sm leading-6 text-rose-200">{error}</p>;
}

export default function DivergenceStudio() {
  const [mode, setMode] = useState<Mode>("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>(createEmptyAnswers());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DivergenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const resultRef = useRef<HTMLElement | null>(null);

  const currentStep = useMemo(() => getStepByIndex(stepIndex), [stepIndex]);
  const totalFields = getFieldCount();
  const completedFields = useMemo(
    () =>
      Object.values(answers).filter((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return String(value ?? "").trim().length > 0;
      }).length,
    [answers],
  );
  const progress = Math.round((completedFields / totalFields) * 100);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as {
        mode?: Mode;
        stepIndex?: number;
        answers?: AnswersMap;
        result?: DivergenceResult;
      };

      const validModes: Mode[] = ["landing", "warning", "form", "loading", "result", "error"];

      if (parsed.answers) setAnswers(parsed.answers);
      if (typeof parsed.stepIndex === "number") setStepIndex(Math.max(0, Math.min(INTERVIEW_STEPS.length - 1, parsed.stepIndex)));
      if (parsed.result) setResult(parsed.result);
      if (parsed.mode && validModes.includes(parsed.mode)) {
        setMode(parsed.mode);
      } else if (parsed.result) {
        setMode("result");
      } else {
        setMode("landing");
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode,
        stepIndex,
        answers,
        result,
      }),
    );
  }, [answers, mode, result, stepIndex]);

  useEffect(() => {
    if (mode === "result" && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "loading") return;
    const interval = window.setInterval(() => {
      setLoadingStage((value) => (value + 1) % LOADING_STAGES.length);
    }, 1200);
    return () => window.clearInterval(interval);
  }, [mode]);

  function updateAnswer(key: string, value: FieldValue) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function toggleMulti(key: string, value: string) {
    const current = answers[key];
    const existing = Array.isArray(current) ? current : [];
    const next = existing.includes(value) ? existing.filter((item) => item !== value) : [...existing, value];
    updateAnswer(key, next);
  }

  function goNext() {
    const errors = validateStep(currentStep, answers);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (stepIndex < INTERVIEW_STEPS.length - 1) {
      setStepIndex((value) => value + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    void submit();
  }

  function goBack() {
    if (stepIndex <= 0) return;
    setStepIndex((value) => value - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    const errors = validateStep(currentStep, answers);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setError(null);
    setMode("loading");
    setLoadingStage(0);

    try {
      const response = await fetch("/api/generate-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Не удалось собрать развилку.");
      }

      const payload = (await response.json()) as DivergenceResult;
      setResult(payload);
      setMode("result");
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : "Не удалось собрать развилку.");
      setMode("error");
    }
  }

  function restart() {
    setMode("landing");
    setStepIndex(0);
    setAnswers(createEmptyAnswers());
    setFieldErrors({});
    setResult(null);
    setError(null);
    setLoadingStage(0);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(buildCopyText(result));
      setError(null);
    } catch {
      setError("Не удалось скопировать текст. Попробуй ещё раз.");
    }
  }

  function saveResult() {
    if (!result) return;
    try {
      const filename = "razvilka-result.md";
      downloadText(filename, buildCopyText(result));
      setError(null);
    } catch {
      setError("Не удалось сохранить результат.");
    }
  }

  function renderField(step: InterviewStep, field: InterviewField) {
    const value = getFieldValue(answers, field);
    const errorMessage = fieldErrors[field.key];

    if (field.kind === "multiselect") {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div key={field.key} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
          <FieldLabel field={field} />
          {field.helper ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{field.helper}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const active = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleMulti(field.key, option.value)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                    active
                      ? "border-white/18 bg-[linear-gradient(135deg,rgba(255,176,112,0.95),rgba(122,221,194,0.85))] text-[#071014] shadow-[0_18px_40px_rgba(255,150,92,0.25)]"
                      : "border-white/10 bg-white/7 text-white/82 hover:border-white/20 hover:bg-white/12",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <FieldError error={errorMessage} />
        </div>
      );
    }

    if (field.kind === "select" || field.kind === "radio") {
      return (
        <div key={field.key} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
          <FieldLabel field={field} />
          {field.helper ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{field.helper}</p> : null}
          <div className="mt-4 grid gap-2">
            {field.options?.map((option) => {
              const active = String(value ?? "") === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAnswer(field.key, option.value)}
                  className={[
                    "rounded-[1.1rem] border px-4 py-3 text-left transition-all duration-300",
                    active
                      ? "border-white/16 bg-white/14 text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
                      : "border-white/10 bg-white/6 text-white/78 hover:border-white/20 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-medium">{option.label}</span>
                    {option.hint ? <span className="text-[0.7rem] uppercase tracking-[0.26em] text-white/34">подход</span> : null}
                  </div>
                  {option.hint ? <p className="mt-1 text-sm leading-6 text-white/60">{option.hint}</p> : null}
                </button>
              );
            })}
          </div>
          <FieldError error={errorMessage} />
        </div>
      );
    }

    if (field.kind === "number") {
      return (
        <div key={field.key} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
          <FieldLabel field={field} />
          <input
            type="number"
            inputMode="numeric"
            value={String(value ?? "")}
            onChange={(event) => updateAnswer(field.key, event.target.value)}
            placeholder={field.placeholder}
            className="mt-4 w-full rounded-[1rem] border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
          />
          <FieldError error={errorMessage} />
        </div>
      );
    }

    if (field.kind === "textarea") {
      return (
        <div key={field.key} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
          <FieldLabel field={field} />
          {field.helper ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{field.helper}</p> : null}
          <textarea
            value={String(value ?? "")}
            onChange={(event) => updateAnswer(field.key, event.target.value)}
            placeholder={field.placeholder}
            className="mt-4 min-h-36 w-full rounded-[1rem] border border-white/10 bg-white/8 px-4 py-4 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
          />
          <FieldError error={errorMessage} />
        </div>
      );
    }

    return (
      <div key={field.key} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
        <FieldLabel field={field} />
        {field.helper ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{field.helper}</p> : null}
        <input
          type="text"
          value={String(value ?? "")}
          onChange={(event) => updateAnswer(field.key, event.target.value)}
          placeholder={field.placeholder}
          className="mt-4 w-full rounded-[1rem] border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
        />
        <FieldError error={errorMessage} />
      </div>
    );
  }

  function renderLanding() {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_20%_20%,_rgba(103,163,255,0.14),transparent_20%),radial-gradient(circle_at_80%_20%,_rgba(255,126,94,0.14),transparent_18%),linear-gradient(135deg,_#050608_0%,_#0a1017_52%,_#0d1118_100%)] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_42%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-[#f1b37f] shadow-[0_0_24px_rgba(241,179,127,0.85)]" />
              <span className="text-xs uppercase tracking-[0.38em] text-white/72">Развилка</span>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.28em] text-white/52 sm:block">
              Две версии твоего будущего
            </span>
          </header>

          <section className="relative flex flex-1 items-center">
            <div className="grid w-full gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] uppercase tracking-[0.42em] text-white/50">Письмо от тебя из будущего</p>
                <h1 className="mt-5 text-balance font-serif text-[clamp(3.3rem,8vw,6.9rem)] leading-[0.92] tracking-[-0.06em] text-white">
                  Где ты окажешься через 3 года, если продолжишь жить так же?
                </h1>
                <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/72 sm:text-xl">
                  Ответь честно на вопросы — и получи две версии своего будущего: ту, где ты продолжаешь старый паттерн, и ту, где начинаешь менять траекторию.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["две ветки будущего", "карта петли поведения", "карточка для сторис"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/74 backdrop-blur-xl"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-10 text-sm text-white/56">
                  40 вопросов · 1 честный результат
                </div>
              </div>

              <div className="grid gap-4">
                <section className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/48">Что внутри</p>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-white/68">
                    <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-4">
                      Тёмная ветка: что произойдёт через 1–3 года, если ничего не менять.
                    </div>
                    <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-4">
                      Сильная ветка: как может повернуться жизнь, если поменять 1–2 ключевых действия.
                    </div>
                    <div className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-4">
                      Карта петли поведения и карточка для сторис, которую хочется сохранить.
                    </div>
                  </div>
                </section>
                <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 backdrop-blur-2xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/48">Важное</p>
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    Это не диагноз и не предсказание судьбы. Это честный AI-разбор твоей текущей траектории и возможных развилок.
                  </p>
                </section>
              </div>
            </div>
          </section>

          <footer className="grid gap-3 pb-3 sm:grid-cols-3">
            {[
              "Развилка не является диагнозом",
              "Это анализ текущих траекторий",
              "Честность здесь работает лучше красоты",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/66 backdrop-blur-xl">
                {item}
              </div>
            ))}
          </footer>
        </div>
      </main>
    );
  }

  function renderWarning() {
    return (
      <main className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#090b0f_0%,_#11141b_100%)] px-4 text-white">
        <section className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.38em] text-white/50">Перед началом</p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02] tracking-[-0.05em] text-white">
            Это не тест “какой ты молодец”. Это зеркало.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/72">
            Чем честнее ты ответишь, тем точнее получится письмо. Не пиши красиво. Пиши как есть.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/54">
            Результат не является психологическим диагнозом, медицинской рекомендацией или точным предсказанием будущего. Это AI-анализ твоих ответов и вероятных поведенческих траекторий.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setMode("form")}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#0a1017] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Начать анкету
            </button>
            <button
              type="button"
              onClick={() => setMode("landing")}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Назад
            </button>
          </div>
        </section>
      </main>
    );
  }

  function renderForm() {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#090b0f_0%,_#10141a_100%)] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(106,150,255,0.12),transparent_26%),radial-gradient(circle_at_20%_10%,rgba(255,127,94,0.10),transparent_20%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-2xl">
            <button
              type="button"
              onClick={restart}
              className="text-xs uppercase tracking-[0.34em] text-white/70 transition-colors hover:text-white"
            >
              Развилка
            </button>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/46">
              <span>Шаг {stepIndex + 1} / {INTERVIEW_STEPS.length}</span>
              <span className="h-px w-10 bg-white/15" />
              <span>{progress}%</span>
            </div>
          </header>

          <section className="mx-auto mt-5 grid max-w-6xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">Анкета</p>
                  <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,4rem)] leading-[0.96] tracking-[-0.05em]">
                    {currentStep.title}
                  </h2>
                </div>
                <div className="hidden rounded-full border border-white/10 bg-white/7 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/56 sm:block">
                  {currentStep.subtitle}
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#f6b07d_0%,#84c9ff_54%,#7fe0c0_100%)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-6 grid gap-4">
                {currentStep.fields.map((field) => renderField(currentStep, field))}
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-medium text-white/78 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Назад
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-[#0a1017] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  {stepIndex === INTERVIEW_STEPS.length - 1 ? "Увидеть развилку" : "Дальше"}
                </button>
              </div>
            </article>

            <aside className="grid gap-4">
              <section className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/46">Дисклеймер</p>
                <p className="mt-4 text-sm leading-7 text-white/66">
                  Развилка не является психологическим диагнозом, медицинской рекомендацией или точным предсказанием будущего. Это AI-анализ твоих ответов, который помогает увидеть возможные поведенческие траектории и первый шаг к изменениям.
                </p>
              </section>
              <section className="rounded-[1.8rem] border border-white/10 bg-[#ff8f68]/10 p-5 text-white shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/46">Подсказка</p>
                <p className="mt-4 text-sm leading-7 text-white/76">
                  Пиши честно. Даже грубый, неуклюжий ответ лучше красивой маски.
                </p>
              </section>
            </aside>
          </section>
        </div>
      </main>
    );
  }

  function renderLoading() {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,_#090b0f_0%,_#12161c_100%)] text-white">
        <section className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-6">
          <div className="grid w-full gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_25px_100px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-8">
              <p className="text-xs uppercase tracking-[0.38em] text-white/46">Генерация результата</p>
              <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.05em]">
                Собираем развилку
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
                {LOADING_STAGES[loadingStage]}
              </p>
              <div className="mt-8 grid gap-3">
                {LOADING_STAGES.map((stage, index) => {
                  const active = index === loadingStage;
                  return (
                    <div
                      key={stage}
                      className={[
                        "rounded-[1.2rem] border px-4 py-4 transition-all duration-300",
                        active
                          ? "border-white/18 bg-white/12"
                          : "border-white/10 bg-white/5 opacity-70",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-white/88">{stage}</span>
                        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40">
                          {active ? "сейчас" : index < loadingStage ? "готово" : "ожидает"}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#f6b07d_0%,#84c9ff_50%,#7fe0c0_100%)] transition-all duration-500"
                          style={{ width: active ? "78%" : index < loadingStage ? "100%" : "14%" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <aside className="grid gap-4">
              <section className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/46">Что ищем</p>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-white/72">
                  <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Главную петлю поведения</div>
                  <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Реальную цену старого паттерна</div>
                  <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">Первый маленький шаг, который ломает маршрут</div>
                </div>
              </section>
              <section className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-white/46">Дисклеймер</p>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  Это не предсказание судьбы. Это эмоциональный AI-разбор текущей траектории и возможных веток.
                </p>
              </section>
            </aside>
          </div>
        </section>
      </main>
    );
  }

  function renderResult() {
    if (!result) return null;
    return (
      <main ref={resultRef} className="min-h-screen bg-[linear-gradient(180deg,_#090b0f_0%,_#12161c_100%)] text-white">
        <section className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:p-7">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.38em] text-white/46">Развилка</p>
                <h1 className="mt-3 font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[0.96] tracking-[-0.05em] text-white">
                  {result.profile_title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/7 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/64">
                    {result.archetype}
                  </span>
                  <span className="rounded-full border border-white/12 bg-white/7 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/64">
                    {result.confidence_level}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveResult}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Сохранить результат
                </button>
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#091014] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Скопировать текст
                </button>
                <button
                  type="button"
                  onClick={() =>
                    result &&
                    void downloadStoryCardPNG(result).catch(() => {
                      setError("Не удалось скачать карточку.");
                    })
                  }
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Скачать карточку
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Пройти заново
                </button>
              </div>
            </div>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/72">{result.short_summary}</p>
            {error ? (
              <div className="mt-5 rounded-[1.2rem] border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
                {error}
              </div>
            ) : null}

            <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="grid gap-6">
                <section className="grid gap-4 lg:grid-cols-2">
                  <article className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/46">Тёмная ветка</p>
                    <p className="mt-4 text-sm leading-7 text-white/82">{result.dark_future_letter}</p>
                  </article>
                  <article className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.05))] p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/46">Сильная ветка</p>
                    <p className="mt-4 text-sm leading-7 text-white/82">{result.strong_future_letter}</p>
                  </article>
                </section>

                <section className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/46">Твоя петля</p>
                  <div className="mt-4 grid gap-3">
                    {[
                      ["Триггер", result.behavior_loop.trigger],
                      ["Автоматическая реакция", result.behavior_loop.automatic_reaction],
                      ["Временная выгода", result.behavior_loop.temporary_reward],
                      ["Цена", result.behavior_loop.price],
                      ["Разрыв петли", result.behavior_loop.loop_breaker],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1.1rem] border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/42">{label}</p>
                        <p className="mt-2 text-sm leading-7 text-white/80">{value}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: "Главный риск", value: result.main_risk },
                    { title: "Твоя сильная сторона", value: result.main_strength },
                    { title: "Первый шаг на 72 часа", value: result.first_72h_step },
                  ].map((item) => (
                    <article key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/46">{item.title}</p>
                      <p className="mt-4 text-sm leading-7 text-white/80">{item.value}</p>
                    </article>
                  ))}
                </section>

              </div>

              <aside className="grid gap-5">
                <section className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.05))] p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/46">Письмо от будущего</p>
                  <p className="mt-4 text-sm leading-7 text-white/78">
                    {result.if_then_plan}
                  </p>
                </section>
                <section className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/46">Дисклеймер</p>
                  <p className="mt-4 text-sm leading-7 text-white/68">{result.disclaimer}</p>
                </section>
                <section className="rounded-[1.8rem] border border-white/10 bg-[#7fe0c0]/10 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/46">Что теперь важно</p>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    Не искать идеальный старт. Важно увидеть петлю, выбрать один шаг и выйти в действие до того, как старый паттерн снова станет нормой.
                  </p>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </main>
    );
  }

  function renderError() {
    return (
      <main className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,_#090b0f_0%,_#12161c_100%)] px-4 text-white">
        <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center shadow-[0_25px_100px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.38em] text-white/46">Ошибка</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.02] tracking-[-0.05em]">
            Развилка не собралась с первого раза
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/68">
            {error ?? "Что-то пошло не так при генерации результата."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => void submit()}
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-[#091014]"
            >
              Попробовать снова
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Начать заново
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (mode === "warning") return renderWarning();
  if (mode === "form") return renderForm();
  if (mode === "loading") return renderLoading();
  if (mode === "result") return renderResult();
  if (mode === "error") return renderError();
  return renderLanding();
}
