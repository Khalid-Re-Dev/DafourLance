import { getAiKnowledgeSectionsAdmin, getBehaviorInstructions } from "./actions"
import AiContentClient from "./ai-content-client"

export const metadata = {
  title: "AI Knowledge Base | Admin",
}

export default async function AiContentPage() {
  const [sections, { data: behaviorData }] = await Promise.all([
    getAiKnowledgeSectionsAdmin(),
    getBehaviorInstructions(),
  ])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1f2b3b]">
          AI Knowledge Base
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Control what the AI assistant knows and how it responds to visitors.
        </p>
      </div>

      <AiContentClient
        initialSections={sections}
        initialBehavior={behaviorData}
      />
    </div>
  )
}
