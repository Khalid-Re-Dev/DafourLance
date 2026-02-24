// lib/ai/ask-ai.ts
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import prisma from "@/lib/db"

export type ChatMessageRole = "system" | "user" | "assistant"

export interface ChatMessage {
  role: ChatMessageRole
  content: string
}

/**
 * Resolve the OpenAI API key:
 *   1. Database (SystemSettings.openAiKey)  ← Admin Dashboard
 *   2. Environment variable (OPENAI_API_KEY) ← .env fallback
 *   3. null → caller should return a graceful error
 */
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
  model = "gpt-4o-mini",
}: {
  messages: ChatMessage[]
  temperature?: number
  model?: string
}): Promise<string> {
  const apiKey = await resolveApiKey()

  if (!apiKey) {
    throw new Error(
      "OpenAI API Key is not configured. Please set it in the Admin Dashboard.",
    )
  }

  // Create the provider per-request so it always uses the latest key
  const openaiProvider = createOpenAI({ apiKey })

  try {
    const { text } = await generateText({
      model: openaiProvider(model),
      messages,
      temperature,
    })

    return text
  } catch (error: any) {
    console.error("AI API error:", error)

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("api key")
    ) {
      throw new Error("AI service configuration error. Please contact support.")
    }

    throw new Error("Failed to generate AI response")
  }
}