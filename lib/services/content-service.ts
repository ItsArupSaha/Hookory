import { extractTextFromUrl } from "@/lib/url-extractor"
import { adminDb } from "@/lib/firebase/admin"
import { Timestamp } from "firebase-admin/firestore"
import { MAX_INPUT_LENGTH_CREATOR, MAX_INPUT_LENGTH_FREE } from "./user-service"

export class ContentService {
    static async extract(inputType: "text" | "url", inputText?: string, url?: string, isPaid = false) {
        let finalInputText = ""
        const maxInputLength = isPaid ? MAX_INPUT_LENGTH_CREATOR : MAX_INPUT_LENGTH_FREE

        if (inputType === "url") {
            if (!url) {
                throw new Error("URL is required.")
            }
            try {
                finalInputText = await extractTextFromUrl(url)
                if (finalInputText.length > maxInputLength) {
                    finalInputText = finalInputText.slice(0, maxInputLength)
                }
            } catch (extractError: any) {
                console.error("URL extraction failed:", extractError)
                throw new Error(extractError.message || "Failed to extract content from URL. Please try copying the content directly.")
            }
        } else {
            if (!inputText || inputText.trim().length === 0) {
                throw new Error("Input text is required.")
            }
            if (inputText.length > maxInputLength) {
                throw new Error(`Input too long. Maximum ${maxInputLength} characters for ${isPaid ? "Creator" : "Free"} plan. Upgrade to Creator plan for ${MAX_INPUT_LENGTH_CREATOR} characters.`)
            }
            finalInputText = inputText
        }

        return finalInputText
    }
}

export class HistoryService {
    /**
     * Creates a new job record in Firestore.
     * This is required for tracking regeneration limits on this specific output.
     */
    static async createJob(uid: string, inputText: string, context: any, formats: string[], outputs: Record<string, string>, isPaid: boolean) {
        // Truncate input text if needed for storage
        const maxStoredLength = MAX_INPUT_LENGTH_CREATOR

        const jobRef = adminDb.collection("jobs").doc()
        const now = Timestamp.now()

        await jobRef.set({
            userId: uid,
            inputText: inputText.length > maxStoredLength ? inputText.slice(0, maxStoredLength) : inputText,
            context,
            formatsSelected: formats,
            outputs,
            isPaid,
            createdAt: now,
            regenerationCount: 0, // Start with 0
            visibleInHistory: true // Useful if we want to hide specific jobs later
        })

        return jobRef.id
    }

    /**
     * Checks if regeneration is allowed (limit <= 5) and increments the counter.
     */
    static async validateAndIncrementRegeneration(uid: string, jobId: string, format: string) {
        const jobRef = adminDb.collection("jobs").doc(jobId)

        // Transaction to ensure atomic increment and check
        await adminDb.runTransaction(async (t) => {
            const doc = await t.get(jobRef)
            if (!doc.exists) {
                throw new Error("Job not found.")
            }

            const data = doc.data()
            if (data?.userId !== uid) {
                throw new Error("Unauthorized.")
            }

            const currentCount = data.regenerationCount || 0
            if (currentCount >= 5) {
                throw new Error("To many regeneration attempts. Please generate a new post.")
            }

            t.update(jobRef, {
                regenerationCount: currentCount + 1,
                lastUpdatedAt: Timestamp.now()
            })
        })
    }
}
