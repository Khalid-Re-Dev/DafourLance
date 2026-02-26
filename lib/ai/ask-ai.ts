// lib/ai/ask-ai.ts
import { generateText } from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import prisma from "@/lib/db"

export type ChatMessageRole = "system" | "user" | "assistant"

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}

export class AiServiceError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.name = "AiServiceError"
    this.statusCode = statusCode
  }
}

async function resolveApiKey(): Promise<string | null> {
  try {
    const settings = await prisma.systemSettings.findUnique({
      where: { id: "singleton" },
      select: { openAiKey: true },
    })
    if (settings?.openAiKey) return settings.openAiKey
  } catch (err) {
    console.error("Failed to fetch API key from database:", err)
  }

  return process.env.OPENAI_API_KEY ?? null
}

export async function askAi({
  messages,
  temperature = 0.2,
  model = "openrouter/free",
}: {
  messages: ChatMessage[]
  temperature?: number
  model?: string
}): Promise<string> {
  const apiKey = await resolveApiKey()

  if (!apiKey) {
    throw new AiServiceError(
      "API Key is not configured. Please set it in the Admin Dashboard.",
      503,
    )
  }

  // استخدام المزود الرسمي لـ OpenRouter
  const openrouter = createOpenRouter({
    apiKey: apiKey,
  })

  try {
    const { text } = await generateText({
      model: openrouter(model),
      messages,
      temperature,
    })

    return text
  } catch (error: any) {
    console.error("AI API error:", error)

    const statusCode: number | undefined =
      error?.statusCode ?? error?.status ?? error?.data?.statusCode

    if (
      statusCode === 429 ||
      error?.message?.toLowerCase().includes("quota") ||
      error?.message?.toLowerCase().includes("rate limit")
    ) {
      throw new AiServiceError(
        "The AI service is temporarily unavailable due to quota limits. Please contact the administrator.",
        429,
      )
    }

    if (
      statusCode === 401 ||
      statusCode === 403 ||
      (error instanceof Error &&
        error.message.toLowerCase().includes("api key"))
    ) {
      throw new AiServiceError(
        "AI service configuration error. The API key may be invalid or revoked. Please contact support.",
        statusCode ?? 401,
      )
    }

    throw new AiServiceError(
      "Failed to generate AI response. Please try again later.",
      statusCode ?? 500,
    )
  }
}