import { generateLinkedInFormat, type LinkedInFormat } from "@/lib/ai"
import { getUserFromRequest } from "@/lib/auth-server"
import { computeCacheKey, getCachedOutput, setCachedOutput } from "@/lib/cache"
import { adminDb } from "@/lib/firebase/admin"
import { extractTextFromUrl } from "@/lib/url-extractor"
import { checkAndResetUsage, checkCooldown, incrementUsage } from "@/lib/usage"
import { Timestamp } from "firebase-admin/firestore"
import { NextRequest, NextResponse } from "next/server"

const MAX_INPUT_LENGTH = 6000

interface GenerateBody {
  inputType: "text" | "url"
  inputText?: string
  url?: string
  context?: {
    targetAudience?: string
    goal?: "engagement" | "leads" | "authority"
    style?: "thought-leader" | "storyteller" | "educator"
    emojiOn?: boolean
    tonePreset?: "professional" | "conversational" | "storytelling" | "educational"
  }
  formats: LinkedInFormat[]
  regenerate?: boolean
  saveHistory?: boolean
}

export async function POST(req: NextRequest) {
  const authed = await getUserFromRequest(req)
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { uid, userDoc } = authed

  if (!userDoc.emailVerified) {
    return NextResponse.json(
      { error: "Email not verified. Please verify your email to generate." },
      { status: 403 }
    )
  }

  let body: GenerateBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const {
    inputType,
    inputText: rawInputText,
    url,
    context = {},
    formats,
    regenerate = false,
    saveHistory = false,
  } = body

  if (!formats || !Array.isArray(formats) || formats.length === 0) {
    return NextResponse.json(
      { error: "At least one format must be selected." },
      { status: 400 }
    )
  }

  // Plan restrictions
  const isPaid = userDoc.plan === "creator"
  if (!isPaid) {
    if (inputType === "url") {
      return NextResponse.json(
        { error: "URL input is available on the Creator plan. Upgrade to unlock." },
        { status: 403 }
      )
    }
    if (context.tonePreset) {
      return NextResponse.json(
        { error: "Tone presets are available on the Creator plan. Upgrade to unlock." },
        { status: 403 }
      )
    }
    if (regenerate) {
      return NextResponse.json(
        { error: "Regenerate is available on the Creator plan. Upgrade to unlock." },
        { status: 403 }
      )
    }
  }

  // Cooldown
  const cooldown = await checkCooldown(uid)
  if (!cooldown.allowed) {
    return NextResponse.json(
      {
        error: "Cooldown active",
        secondsRemaining: cooldown.secondsRemaining,
      },
      { status: 429 }
    )
  }

  // Usage limits
  const usage = await checkAndResetUsage(uid)
  if (usage.usageCount >= usage.usageLimitMonthly) {
    return NextResponse.json(
      {
        error: "Monthly limit reached. Upgrade to increase your limit.",
        upgradeRequired: true,
      },
      { status: 402 }
    )
  }

  let finalInputText = ""

  try {
    if (inputType === "url") {
      if (!url) {
        return NextResponse.json({ error: "URL is required." }, { status: 400 })
      }
      finalInputText = await extractTextFromUrl(url)
    } else {
      if (!rawInputText || rawInputText.trim().length === 0) {
        return NextResponse.json({ error: "Input text is required." }, { status: 400 })
      }
      if (rawInputText.length > MAX_INPUT_LENGTH) {
        return NextResponse.json(
          { error: `Input too long. Maximum ${MAX_INPUT_LENGTH} characters.` },
          { status: 400 }
        )
      }
      finalInputText = rawInputText
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process input." },
      { status: 400 }
    )
  }

  const emojiOn = !!context.emojiOn
  const tonePreset = context.tonePreset

  const outputs: Record<string, string> = {}
  const fromCache: Record<string, boolean> = {}

  for (const format of formats) {
    const cacheKey = computeCacheKey(
      finalInputText,
      context,
      format,
      emojiOn,
      tonePreset
    )

    let output = await getCachedOutput(cacheKey)
    if (output) {
      outputs[format] = output
      fromCache[format] = true
      continue
    }

    try {
      output = await generateLinkedInFormat(format, finalInputText, context, regenerate)
      outputs[format] = output
      fromCache[format] = false

      await setCachedOutput(
        cacheKey,
        output,
        process.env.AI_PROVIDER || "gemini"
      )
    } catch (err: any) {
      return NextResponse.json(
        { error: err?.message || "AI generation failed." },
        { status: 500 }
      )
    }
  }

  // Count this as one repurpose action (including regenerates)
  await incrementUsage(uid)

  // Optional history for paid users
  if (isPaid && saveHistory) {
    const jobRef = adminDb.collection("jobs").doc()
    const now = Timestamp.now()
    await jobRef.set({
      userId: uid,
      inputText: finalInputText.length > 6000 ? finalInputText.slice(0, 6000) : finalInputText,
      context,
      formatsSelected: formats,
      outputs,
      createdAt: now,
    })
  }

  return NextResponse.json({
    outputs,
    fromCache,
  })
}

