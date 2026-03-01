"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"

export async function getSettings() {
    const settings = await prisma.systemSettings.upsert({
        where: { id: "singleton" },
        update: {},
        create: { id: "singleton" },
    })
    return settings
}

export async function saveOpenAiKey(key: string) {
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
