import { getUserFromRequest } from "@/lib/auth-server"
import { NextRequest, NextResponse } from "next/server"
import { SeriesBodySchema } from "@/lib/schemas/series"
import { generateSeries } from "@/lib/ai/series"
import { UserService } from "@/lib/services/user-service"
import { ContentService } from "@/lib/services/content-service"
import { LinkedInFormat } from "@/lib/ai/index" // Import type

export async function POST(req: NextRequest) {
    try {
        // 1. DDoS Protection
        const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown"
        const rateLimit = await UserService.checkRateLimit(ip)

        if (!rateLimit.success) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later.", retryAfter: rateLimit.retryAfter },
                { status: 429, headers: { "Retry-After": rateLimit.retryAfter?.toString() || "60" } }
            )
        }

        // 2. Auth Check
        const authed = await getUserFromRequest(req)
        if (!authed) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { uid, userDoc } = authed

        // 3. Plan Check (STRICT: PAID ONLY)
        // Series feature is exclusive to Creator plan
        if (userDoc.plan !== "creator") {
            return NextResponse.json(
                { error: "The Series feature is available only on the Creator plan." },
                { status: 403 }
            )
        }

        // 4. Body Parsing & Validation
        let bodyData: unknown
        try {
            bodyData = await req.json()
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
        }

        const result = SeriesBodySchema.safeParse(bodyData)
        if (!result.success) {
            const errorMessage = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
            return NextResponse.json({ error: `Validation Error: ${errorMessage}` }, { status: 400 })
        }

        const {
            inputType,
            inputText,
            url,
            context,
            postFormats
        } = result.data

        // 5. Cooldown & Limits
        const cooldown = await UserService.checkCooldown(uid)
        if (!cooldown.allowed) {
            return NextResponse.json(
                { error: "Cooldown active", secondsRemaining: cooldown.secondsRemaining },
                { status: 429 }
            )
        }

        const { limited } = await UserService.checkUsageLimit(uid)
        if (limited) {
            return NextResponse.json(
                { error: "Monthly limit reached. Upgrade to increase your limit.", upgradeRequired: true },
                { status: 402 }
            )
        }

        // 6. Content Extraction
        let finalInputText = ""
        try {
            // isPaid is true because we enforced plan === 'creator'
            finalInputText = await ContentService.extract(inputType, inputText, url, true)
        } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 400 })
        }

        // 7. AI Generation (Series)
        try {
            const posts = await generateSeries({
                inputText: finalInputText,
                context: {
                    ...context,
                    // Ensure angle passed is undefined/ignored as per requirements
                    angle: undefined
                },
                // Cast the formats to the fixed length tuple as required by generateSeries
                postFormats: postFormats as [LinkedInFormat, LinkedInFormat, LinkedInFormat, LinkedInFormat]
            })

            // 8. Usage & History
            // Count as 1 usage? Or 4? For now, we count as 1 "generation event".
            // UPDATED: Series costs 3 credits.
            await UserService.incrementUsage(uid, 3)

            // TODO: Save to history? 
            // The current history service might be designed for single posts/records.
            // For now we skip saving series to history until we update the data model.
            // Or we could save them as 4 separate jobs? 
            // User didn't strictly request history for series yet, just the generation.
            // We will skip HistoryService.createJob for now to avoid breaking the schema.

            return NextResponse.json({ posts })

        } catch (err: any) {
            console.error("Route Error (Series):", err)
            return NextResponse.json(
                { error: err?.message || "AI generation failed." },
                { status: 500 }
            )
        }

    } catch (err: any) {
        console.error("Route Error:", err)
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
