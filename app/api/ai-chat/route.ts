// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server"
import { buildKnowledgeBase, getSystemPrompt } from "@/lib/knowledge-base"
import { askAi, AiServiceError } from "@/lib/ai/ask-ai"

export async function POST(req: NextRequest) {
  let language: "ar" | "en" = "ar"

  try {
    const body = await req.json()
    const { message, history = [], language: langFromClient } = body

    language = langFromClient === "en" ? "en" : "ar"

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: language === "ar" ? "الرسالة غير صالحة." : "Invalid message." },
        { status: 400 },
      )
    }

    const [context, systemPrompt] = await Promise.all([
      buildKnowledgeBase(language),
      getSystemPrompt(language),
    ])

    const messagesForModel = [
      {
        role: "system" as const,
        content: `${systemPrompt}\n\n[CONTEXT]\n${context}`,
      },
      ...history.map((m: any) => ({
        role:
          m.role === "assistant" || m.role === "user"
            ? (m.role as "assistant" | "user")
            : ("user" as const),
        content:
          typeof m.content === "string" ? m.content : String(m.content ?? ""),
      })),
      { role: "user" as const, content: message },
    ]

   // askAi resolves the API key from DB → env fallback internally
    const answer = await askAi({
      messages: messagesForModel,
      temperature: 0.2,
    })

    const reply =
      (answer && answer.trim()) ||
      (language === "ar"
        ? "عذراً، لم أتمكن من توليد إجابة."
        : "Sorry, I couldn't generate a reply.")

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error("AI /api/ai-chat error:", err)

    // ── AiServiceError carries a specific statusCode (429, 401, 503…) ──
    if (err instanceof AiServiceError) {
      const isArabic = language === "ar"

      // 429 – Quota / Rate limit
      if (err.statusCode === 429) {
        return NextResponse.json(
          {
            error: isArabic
              ? "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً بسبب حدود الاستخدام. يرجى التواصل مع المسؤول."
              : "The AI service is temporarily unavailable due to quota limits. Please contact the administrator.",
            reply: isArabic
              ? "خدمة الذكاء الاصطناعي غير متاحة مؤقتاً بسبب حدود الاستخدام. يرجى التواصل مع المسؤول."
              : "The AI service is temporarily unavailable due to quota limits. Please contact the administrator.",
          },
          { status: 429 },
        )
      }

      // 401 / 403 – Invalid or revoked API key
      if (err.statusCode === 401 || err.statusCode === 403) {
        return NextResponse.json(
          {
            reply: isArabic
              ? "مفتاح API غير صالح أو تم إلغاؤه. يرجى التواصل مع المسؤول."
              : "The API key is invalid or has been revoked. Please contact the administrator.",
          },
          { status: err.statusCode },
        )
      }

      // 503 – Key not configured
      if (err.statusCode === 503) {
        return NextResponse.json(
          {
            reply: isArabic
              ? "مفتاح OpenAI غير مُعدّ. يرجى ضبطه من لوحة التحكم."
              : "OpenAI API Key is not configured. Please set it in the Admin Dashboard.",
          },
          { status: 503 },
        )
      }

      // Any other AiServiceError – use its status
      return NextResponse.json(
        { reply: err.message },
        { status: err.statusCode },
      )
    }

    // ── Legacy fallback for non-AiServiceError exceptions ──
    if (err?.message?.includes("not configured")) {
      return NextResponse.json(
        {
          reply:
            language === "ar"
              ? "مفتاح OpenAI غير مُعدّ. يرجى ضبطه من لوحة التحكم."
              : "OpenAI API Key is not configured. Please set it in the Admin Dashboard.",
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        reply:
          language === "ar"
            ? "حدث خطأ غير متوقع في الخادم. يرجى المحاولة لاحقاً."
            : "Unexpected server error. Please try again later.",
      },
      { status: 500 },
    )
  }
}