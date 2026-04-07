"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { getSession } from "@/lib/auth"

/** Mask an API key for safe display: sk-proj-****...xxxx */
function maskApiKey(key: string): string {
    if (key.length <= 11) return key.slice(0, 3) + "****"
    return key.slice(0, 7) + "****..." + key.slice(-4)
}

export async function getSettings() {
    const session = await getSession()
    if (!session) {
        throw new Error("Unauthorized")
    }

    const settings = await prisma.systemSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
    })

    // Return masked key only — never expose the full key to the client
    return {
        ...settings,
        openAiKey: settings.openAiKey ? maskApiKey(settings.openAiKey) : null,
        hasKey: !!settings.openAiKey,
    }
}

export async function saveOpenAiKey(key: string) {
    const session = await getSession()
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    const trimmed = key.trim()

    if (!trimmed) {
        return { success: false, error: "API key cannot be empty." }
    }

    if (!trimmed.startsWith("sk-")) {
        return { success: false, error: "Invalid key format. Must start with sk-." }
    }

    try {
        await prisma.systemSettings.upsert({
            where: { id: "singleton" },
            update: { openAiKey: trimmed },
            create: { id: "singleton", openAiKey: trimmed },
        })
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to save OpenAI key:", error)
        return { success: false, error: "Failed to save API key. Please try again." }
    }
}

export async function deleteOpenAiKey() {
    const session = await getSession()
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.systemSettings.upsert({
            where: { id: "singleton" },
            update: { openAiKey: null },
            create: { id: "singleton" },
        })
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete OpenAI key:", error)
        return { success: false, error: "Failed to remove API key. Please try again." }
    }
}
