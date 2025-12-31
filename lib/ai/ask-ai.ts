// lib/ai/ask-ai.ts
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export type ChatMessageRole = "system" | "user" | "assistant"

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}

// تعريف مزود OpenAI وربطه بمفتاح البيئة
const openaiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function askAi({
  messages,
  temperature = 0.2,
  model = "gpt-4o-mini", // نستخدم اسم الموديل مباشرة هنا
}: {
  messages: ChatMessage[]
  temperature?: number
  model?: string
}): Promise<string> {
  try {
    const { text } = await generateText({
      // نمرر المزود مع تحديد الموديل المطلوب
      model: openaiProvider(model), 
      messages,
      temperature,
    })

    return text
  } catch (error: any) {
    console.error("AI API error:", error)

    // رسالة أوضح في حالة وجود مشكلة في الإعدادات
    if (error instanceof Error && error.message.toLowerCase().includes("api key")) {
      throw new Error("AI service configuration error. Please contact support.")
    }

    throw new Error("Failed to generate AI response")
  }
}