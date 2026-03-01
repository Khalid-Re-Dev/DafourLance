import { generateText } from "ai"

// The Vercel AI SDK handles API keys automatically via AI Gateway
// For direct OpenAI access, set OPENAI_API_KEY environment variable

export async function askAi({
  messages,
  temperature = 0.2,
  model = "openai/gpt-4o-mini",
}: {
  messages: { role: "system" | "user" | "assistant"; content: string }[]
  temperature?: number
  model?: string
}): Promise<string> {
  try {
    // Vercel AI SDK with AI Gateway - handles API keys automatically
    const { text } = await generateText({
      model,
      messages,
      temperature,
    })

    return text
  } catch (error) {
    console.error("AI API error:", error)

    // Provide helpful error message without exposing sensitive details
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("AI service configuration error. Please contact support.")
      }
    }

    throw new Error("Failed to generate AI response")
  }
}
