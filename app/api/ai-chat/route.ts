// app/api/ai-chat/route.ts
import { NextRequest, NextResponse } from "next/server"
import { buildKnowledgeBase, getSystemPrompt } from "@/lib/knowledge-base"
import { askAi } from "@/lib/ai/ask-ai"

export async function POST(req: NextRequest) {
  let language: "ar" | "en" = "ar"

  try {
    const body = await req.json()
    const { message, history = [], language: langFromClient } = body

    language = langFromClient === "en" ? "en" : "ar"

    // تحقق من وجود المفتاح
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing in environment variables")
      return NextResponse.json(
        {
          reply:
            language === "ar"
              ? "إعداد خدمة الذكاء الاصطناعي غير مكتمل على الخادم."
              : "AI service is not configured on the server.",
        },
        { status: 500 },
      )
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: language === "ar" ? "الرسالة غير صالحة." : "Invalid message." },
        { status: 400 },
      )
    }

    const context = buildKnowledgeBase(language)
    const systemPrompt = getSystemPrompt(language)

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

    // استدعاء askAi مع اسم الموديل فقط
    const answer = await askAi({
      messages: messagesForModel,
      model: "gpt-4o-mini", 
      temperature: 0.2,
    })

    const reply =
      (answer && answer.trim()) ||
      (language === "ar"
        ? "عذراً، لم أتمكن من توليد إجابة."
        : "Sorry, I couldn't generate a reply.")

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("AI /api/ai-chat error:", err)

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