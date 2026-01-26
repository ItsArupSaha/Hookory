import OpenAI from "openai"
import { GenerateContext, LinkedInFormat } from "./index"

// Maximum characters for the input text (same as single post for consistency)
const MAX_INPUT_CHARS = 20000

export interface SeriesGenerationOptions {
    inputText: string
    context: GenerateContext
    // The user selects specific attributes for each of the 4 posts if they want,
    // otherwise we use defaults.
    postFormats: [LinkedInFormat, LinkedInFormat, LinkedInFormat, LinkedInFormat]
}

function validateInput(inputText: string): void {
    if (!inputText || inputText.trim().length === 0) {
        throw new Error("Input text cannot be empty")
    }
    const meaningfulContent = inputText.replace(/[\s\n\r\t]/g, "")
    if (meaningfulContent.length < 50) {
        throw new Error("Input text is too short. Please provide more content to repurpose.")
    }
    if (inputText.length > MAX_INPUT_CHARS) {
        throw new Error(`Input text exceeds maximum length of ${MAX_INPUT_CHARS} characters`)
    }
}

/**
 * System Prompt for Series Generation
 * Enforces the 4-step structure and "Silent Extraction" logic.
 */
/**
 * System Prompt for Series Generation
 * Enforces the 4-step structure and "Silent Extraction" logic.
 */
function getSeriesSystemPrompt(): string {
    return `You are Hookory, a specialized LinkedIn content strategist.
You do NOT generate random posts. You generate a "Narrative Series" — 4 connected posts that guide the reader through a logical journey.

MENTAL MODEL:
1. Extract the core theme from the source.
2. Break it down into 4 distinct "movements":
   - Post 1: The Context (The wide angle / The "Why")
   - Post 2: The Mistake (The tension / What people get wrong)
   - Post 3: The Solution (The fix / The "How")
   - Post 4: The Outcome (The result / The future)

CRITICAL RULES:
- GLOBAL COHERENCE: Each post must implicitly assume the reader has seen the previous one, yet fully stand alone if read in isolation.
- INTERIOR MONOLOGUE: Build the "thread" first. Post 2 follows Post 1. Post 3 solves Post 2. Post 4 validates Post 3.
- Reference different parts of the source info to keep it fresh.
- Do NOT repeat the same hook or angle.
- NO "Here is post 1" chatter. Output ONLY the content within the strictly defined structure.
- QUALITY: Grounded in source details. No generic fluff.

LINKEDIN WRITING STYLE (HUMAN-CENTRIC):
1. RHYTHM OVER RULES: Vary your paragraph lengths naturally. Mix punchy 1-liners with 2-3 sentence flowing thoughts. Monotonous short lines feel robotic.
2. THE "BREATH" TEST: Read it aloud. If it sounds like a list of fortune cookies, add connective tissue. If it feels like a wall, break it up.
3. WHITESPACE: Use blank lines to create visual breaks, but not after EVERY sentence. Group related ideas.
4. AUTHENTIC VOICE: Write like you're explaining to a smart friend over coffee. Not a TED talk. Not a textbook.
5. NO MARKDOWN: Raw text only. No **bold** or *italics*.
6. SCROLL-STOPPING STRUCTURE: Hook (2 lines) → Context (2-4 lines) → Meat (your key insight, can be longer) → Payoff (1-2 lines).

NEGATIVE CONSTRAINTS (INSTANT BAN):
- DO NOT use phrases like: "In an era", "In today's landscape", "Game-changer", "Redefine", "Need has never been more", "Delve into", "Unlock".
- DO NOT start with: "In this post...", "Let's talk about...", "Picture this:", "Imagine this:", "Here's the thing:", "Let me tell you something".
- DO NOT write "Welcome to the series". Start immediately with the hook.
`
}

function getSeriesUserPrompt(inputText: string, options: SeriesGenerationOptions): string {
    const { context, postFormats } = options
    const { readerContext, emojiOn, tonePreset } = context

    // REFINED EMOJI LOGIC: "Sparingly" instead of forceful count.
    const emojiInstruction = emojiOn
        ? "Required but USE SPARINGLY. 1-3 emojis max per post. Do not force them if they don't fit the tone."
        : "Do not use emojis."

    // Map the 4 steps to their specific instructions
    const steps = [
        {
            name: "POST 1: CONTEXT / PROBLEM",
            focus: "Set the stage. HOOK: Must be an 'Interruption' style hook (A contradiction, a blunt number, or a counter-intuitive claim). Avoid rhetorical questions.",
            format: postFormats[0]
        },
        {
            name: "POST 2: MISTAKE / TENSION",
            focus: "Create friction. What do most people get wrong? What is the trap? Challenge the conventional wisdom.",
            format: postFormats[1]
        },
        {
            name: "POST 3: SOLUTION / SYSTEM",
            focus: "Teach the fix. How does the source solve it? Provide actionable steps.",
            format: postFormats[2]
        },
        {
            name: "POST 4: OUTCOME / TAKEAWAY",
            // REFINED POST 4 ANCHOR: Hard anchor to consequences.
            focus: "Authority & Proof. Must anchor to TANGIBLE CONSEQUENCES from the source (metrics, operational changes, decision impact). Avoid generic summaries.",
            format: postFormats[3]
        }
    ]

    // Format-specific rules for series posts (synced with index.ts)
    const getFormatInstructions = (format: string): string => {
        switch (format) {
            case "main-post":
                return `MAIN POST FORMAT:
FIRST 2 LINES = HOOK (MANDATORY):
- The very first 2 lines MUST be the hook.
- CRITICAL: Keep hook under 140 characters (before LinkedIn's "see more" fold).
- Create a "wait, what?" moment.
- No intro, no setup — hook first, always.

STRUCTURE (after hook):
- CONTEXT: 2-4 lines setting up the tension.
- MEAT: 3-6 lines delivering the core insight with specifics.
- PAYOFF: 1-3 lines with takeaway or question.
- Vary paragraph lengths naturally. Monotony = robotic.

HASHTAGS: 3-5 relevant hashtags at the end.`
            case "story-based":
                return `STORY FORMAT:
FIRST 2 LINES = HOOK (MANDATORY):
- The very first 2 lines MUST be the hook.
- CRITICAL: Keep hook under 140 characters (before LinkedIn's "see more" fold).
- Create a "wait, what?" moment.
- No intro, no setup — hook first, always.

STRUCTURE (after hook):
- Build tension naturally: assumption vs. reality.
- Turning point: the insight, the shift.
- Resolution: grounded outcome, no fake metrics.
- Let the story breathe. Some paragraphs can be 3-4 sentences.

HASHTAGS: 3-5 relevant hashtags at the end.`
            case "carousel":
                return `CONCEPTUAL CAROUSEL:
Target length: 400–700 characters total.

OUTPUT FORMAT (MANDATORY):
- Write as SLIDES with separators: "Slide 1:", "Slide 2:", etc.
- 5-7 slides total.

SLIDE TEXT RULES (CRITICAL):
- MAX 15-25 words per slide. NO PARAGRAPHS.
- Each slide = 1-2 short punchy lines. That's it.
- Think billboard, not blog post.
- NO HASHTAGS on carousel slides (they go in the post caption, not here).
- NO emojis clutter — max 1 per slide if any.

SLIDE STRUCTURE:
- Slide 1 (Hook): Bold claim or counter-intuitive statement. 8-12 words max.
- Slides 2–5: ONE insight per slide. Keep it incomplete to force swipe.
- Final Slide: The new perspective + a question. Short.

CONSTRAINTS:
- NO tech stacks, NO tool names, NO step-by-step instructions.
- Focus on insight, psychology, or strategy.
- If it reads like a blog post, you've failed.`
            case "short-viral-hook":
                return `SHORT HOOK FORMAT:
FIRST 2 LINES = HOOK (MANDATORY):
- The very first 2 lines MUST be the hook.
- CRITICAL: Keep hook under 140 characters (before LinkedIn's "see more" fold).
- Punchy. Based on ONE specific detail from the source.
- No intro — hook first, always.

STRUCTURE (after hook):
- EXPANSION: 2-4 lines. Unpack the hook with context or contrast.
- OPTIONAL BULLETS: Max 3, only if they add clarity.
- CTA: 1-2 lines. A sharp question or challenge.

TONE:
- This format is about IMPACT, not depth.
- Every word earns its place. Cut ruthlessly.
- Think tweet energy, LinkedIn packaging.

HASHTAGS: 3-5 relevant hashtags at the end.`
            default:
                return `Standard LinkedIn post with natural rhythm and varied paragraph lengths.`
        }
    }

    const stepInstructions = steps.map((step, i) => `
---POST_${i + 1}---
ROLE: ${step.name}
FOCUS: ${step.focus}
FORMAT: ${step.format.toUpperCase().replace("-", " ")}
FORMAT RULES:
${getFormatInstructions(step.format)}
`).join("\n")

    return `SOURCE CONTENT:
"""
${inputText}
"""

CONTEXT:
- Reader: ${readerContext || "General LinkedIn Professional"}
- Tone: ${tonePreset || "professional"}
- Emojis: ${emojiInstruction}

INSTRUCTIONS:
1. SILENTLY extract the core theme and 3-4 sub-ideas.
2. Generate 4 separate posts following the strict structure below.

STRUCTURED OUTPUT REQUIRED:
${stepInstructions}

IMPORTANT:
- Use the delimiter "---POST_X---" exactly as shown.
- Ensure each post fits its assigned ROLE and FOCUS.
- Adapt the writing style to the requested FORMAT (e.g. if Carousel, use "Slide 1:", etc).
`
}

export async function generateSeries(options: SeriesGenerationOptions): Promise<string[]> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error("OPENAI_API_KEY not set")

    validateInput(options.inputText)

    const openai = new OpenAI({ apiKey })

    // Default to these formats if something is wrong with the array, but it should be typed correctly
    const safeFormats = (options.postFormats && options.postFormats.length === 4)
        ? options.postFormats
        : ["main-post", "story-based", "carousel", "short-viral-hook"] as [LinkedInFormat, LinkedInFormat, LinkedInFormat, LinkedInFormat]

    const systemPrompt = getSeriesSystemPrompt()
    const userPrompt = getSeriesUserPrompt(options.inputText, { ...options, postFormats: safeFormats })

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using mini for speed/cost as refined by user preference in general
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7, // Slightly higher than 0.6 to ensure distinct angles across 4 posts
            max_tokens: 3000,  // Increased for 4 posts
        })

        const fullText = response.choices[0].message.content
        if (!fullText) throw new Error("Empty response from AI")

        return parseSeriesOutput(fullText)

    } catch (error: any) {
        console.error("OpenAI Series generation error:", error)
        if (error.status === 429) throw new Error("AI service busy. Try again shortly.")
        if (error.status === 400) throw new Error("Content could not be processed.")
        throw new Error("AI generation failed.")
    }
}

/**
 * Parses the single long string into 4 separate posts.
 * Robustly handles potential whitespace or newline variations.
 */
function parseSeriesOutput(text: string): string[] {
    // We expect ---POST_1---, ---POST_2---, etc.
    // We can split by regex.

    // 1. Initial cleanup
    const cleanText = text.trim()

    // 2. Regex to find markers: ---POST_\d---
    // capturing groups might help, but split is easier
    const parts = cleanText.split(/---POST_\d---/i)

    // The first part might be empty (if text starts with ---POST_1---)
    // or it might contain "Silent extracted thinking" if the model leaked it.
    // We generally ignore the pre-amble if it's not a post.

    // Filter out empty strings
    const validParts = parts.filter(p => p && p.trim().length > 10)

    // We expect exactly 4 posts.
    // If we have more or fewer, we try to return what we have, or pad/slice.
    if (validParts.length === 0) {
        // Fallback: return the whole text as one post (better than crashing)
        return [cleanText, "", "", ""]
    }

    // Pad with empty strings if fewer than 4 (unlikely with strict prompt)
    while (validParts.length < 4) {
        validParts.push("")
    }

    // Return exactly 4
    return validParts.slice(0, 4).map(p => p.trim())
}
