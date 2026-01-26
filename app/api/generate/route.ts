import { getUserFromRequest } from "@/lib/auth-server"
import { NextRequest, NextResponse } from "next/server"
import { GenerateBodySchema } from "@/lib/schemas/generate"
import { AiService } from "@/lib/services/ai-service"
import { UserService } from "@/lib/services/user-service"
import { ContentService, HistoryService } from "@/lib/services/content-service"

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

    // 3. Body Parsing & Validation
    let bodyData: unknown
    try {
      bodyData = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const result = GenerateBodySchema.safeParse(bodyData)
    if (!result.success) {
      const errorMessage = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return NextResponse.json({ error: `Validation Error: ${errorMessage}` }, { status: 400 })
    }

    const {
      inputType,
      inputText,
      url,
      context,
      formats,
      regenerate = false,
      saveHistory = false,
      jobId
    } = result.data

    // 4. Plan & Validation Logic
    let isPaid = false
    try {
      const planCheck = await UserService.validatePlan(userDoc, inputType, regenerate)
      isPaid = planCheck.isPaid
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 403 })
    }

    // 5. Cooldown & Limits
    const cooldown = await UserService.checkCooldown(uid)
    if (!cooldown.allowed) {
      return NextResponse.json(
        { error: "Cooldown active", secondsRemaining: cooldown.secondsRemaining },
        { status: 429 }
      )
    }

    // Only check monthly limit if NOT regenerating (regenerations are free)
    if (!regenerate) {
      const { limited } = await UserService.checkUsageLimit(uid)
      if (limited) {
        return NextResponse.json(
          { error: "Monthly limit reached. Upgrade to increase your limit.", upgradeRequired: true },
          { status: 402 }
        )
      }
    } else {
      // If regenerating, we MUST have a jobId to track limits against
      if (!jobId) {
        return NextResponse.json({ error: "Job ID required for regeneration" }, { status: 400 })
      }
      try {
        // Check regeneration limit (10 max)
        // We use the first format key as proxy since regeneration usually happens one by one
        await HistoryService.validateAndIncrementRegeneration(uid, jobId, formats[0])
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 403 })
      }
    }

    // 6. Content Extraction
    let finalInputText = ""
    try {
      // If regenerating, we might not need to extract again if we stored it? 
      // But simpler to just extract/use input again. Client sends it.
      finalInputText = await ContentService.extract(inputType, inputText, url, isPaid)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    // 7. AI Generation
    try {
      const { outputs, fromCache } = await AiService.generateFormats(
        finalInputText,
        context,
        formats,
        regenerate
      )

      let newJobId = jobId

      // 8. Usage & History
      if (!regenerate) {
        // Charge credit only for new generations
        await UserService.incrementUsage(uid)

        // Create new job to track this generation (and future limit)
        // Always create job now, to support regeneration tracking even for free users
        newJobId = await HistoryService.createJob(uid, finalInputText, context, formats, outputs, isPaid)
      } else {
        // For regeneration, we already validated and incremented above.
        // We assume client keeps the same jobId.
      }

      return NextResponse.json({ outputs, fromCache, jobId: newJobId })

    } catch (err: any) {
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
