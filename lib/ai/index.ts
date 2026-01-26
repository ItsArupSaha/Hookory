import OpenAI from "openai"

/**
 * Supported LinkedIn Output Formats.
 * These map 1:1 with the defined format rules.
 */
export type LinkedInFormat =
  | "main-post"
  | "story-based"
  | "carousel"
  | "short-viral-hook"

/**
 * Context Interface.
 * Defines the strict set of inputs the AI considers.
 * - readerContext: Who is reading? (sets complexity/background)
 * - angle: What is the focus? (sets the core insight)
 * - emojiOn: Preference toggle
 * - tonePreset: Stylistic direction
 */
export interface GenerateContext {
  readerContext?: string
  angle?: string
  emojiOn?: boolean
  tonePreset?: "professional" | "conversational" | "bold"
}

export interface GenerateOptions {
  format: LinkedInFormat
  inputText: string
  context: GenerateContext
  regenerate?: boolean
}

// Input constants
const MAX_INPUT_CHARS = 20000
const MAX_OUTPUT_CHARS = 2900

function normalizeInput(inputText: string): string {
  let normalized = inputText.trim()
  normalized = normalized.replace(/[ \t]+/g, " ")
  normalized = normalized.replace(/\n\s*\n/g, "\n\n")
  return normalized
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
 * System Prompt: opinionated, minimal, high-leverage for gpt-4o-mini.
 * Key upgrades:
 * - Forces source-anchored writing (prevents generic "leadership wisdom").
 * - Prevents invented personal stories when source is technical.
 * - Enforces "one failure pattern" (angle) without repeating a template phrase.
 */
function getSystemPrompt(): string {
  return `You are Hookory, a LinkedIn editor and ghostwriter.
You repurpose provided source content into one LinkedIn post that feels human, specific, and worth reading.

NON-NEGOTIABLES:
- Stay grounded in the SOURCE. Use at least 2 concrete details from it (tools, steps, numbers, terms, constraints).
- Do not invent facts. If the source is technical/instructional, do NOT fabricate a personal launch story or fake "my project" narrative.
- Pick ONE central angle and keep every paragraph aligned to it (no multi-topic summaries).
- Reading level: simple, direct, grade 6–8. Prefer short common words.
- Avoid generic moralizing (e.g., "human side", "connection", "crucial", "unlock", "game-changer") unless the source explicitly supports it.

LINKEDIN WRITING STYLE (HUMAN-CENTRIC):
- RHYTHM OVER RULES: Vary paragraph lengths naturally. Mix punchy 1-liners with 2-3 sentence flowing thoughts. Monotonous short lines = robotic.
- THE "BREATH" TEST: If it sounds like a list of fortune cookies, add connective tissue. If it feels like a wall, break it up.
- WHITESPACE: Use blank lines for visual breaks, but group related ideas together. Not after EVERY sentence.
- AUTHENTIC VOICE: Write like you're explaining to a smart friend. Not a TED talk. Not a textbook.
- SCROLL-STOPPING STRUCTURE: Hook (2 lines max) → Context (2-4 lines) → Meat (your key insight) → Payoff (1-2 lines).
- NO MARKDOWN: Raw text only.
- Emojis only when explicitly requested; treat them as tone, not decoration.

HOOK QUALITY:
- The first 2 lines must create tension using a concrete element from the source (not generic life advice).
- A great hook makes the reader feel: "Wait—how can that be true?"

ENDING:
- End with a specific, high-signal question that fits the angle and audience (no "thoughts?").
- 3–5 relevant hashtags max, only if truly relevant to the source.

BANNED OPENERS (NEVER USE):
- "Picture this:", "Imagine this:", "Here's the thing:", "Let me tell you something"
- "In this post...", "Let's talk about...", "I want to share..."
- Any phrase that sounds like a writing template, not a real person.`
}

/**
 * Format rules (BODY behavior only). Hooks are enforced globally in system/process.
 */
function getFormatRules(format: LinkedInFormat): string {
  const rules: Record<LinkedInFormat, string> = {
    "main-post": `
OUTPUT TYPE: MAIN POST
Target length: 900–1600 characters.

FIRST 2 LINES = HOOK (MANDATORY):
- The very first 2 lines of the post MUST be the hook.
- CRITICAL: Keep hook under 140 characters total (before LinkedIn's "see more" fold).
- Create a "wait, what?" moment using something specific from the source.
- No intro, no setup — hook first, always.

STRUCTURE (after hook):
- CONTEXT: 2-4 lines. Set up the tension or the "old way" of thinking.
- MEAT: Your core insight. Can be 3-6 lines. This is where you deliver value — be specific, use examples.
- PAYOFF: 1-3 lines. The takeaway or a thought-provoking question.

TONE:
- Write like you're sharing a realization with a peer, not lecturing.
- Vary paragraph lengths. Some punchy. Some flowing. Monotony = robotic.
- No "In today's world..." or "Let me share..." — just start.
`,
    "story-based": `
OUTPUT TYPE: STORY-STYLE POST
Target length: 1100–1900 characters.

FIRST 2 LINES = HOOK (MANDATORY):
- The very first 2 lines of the post MUST be the hook.
- CRITICAL: Keep hook under 140 characters total (before LinkedIn's "see more" fold).
- Create a "wait, what?" moment using something specific from the source.
- No intro, no setup — hook first, always.

STRUCTURE (after hook):
- TENSION: What was the assumption? What went wrong? Build the conflict naturally.
- TURNING POINT: The insight, the shift, the "aha."
- RESOLUTION: What changed? Keep it grounded — no fake metrics or exaggerated outcomes.
- CTA: A sharp question that makes the reader reflect on their own situation.

TONE:
- If the source is personal: write in first person with vulnerability.
- If the source is not personal: write as an observer ("Here's what I noticed..." / "Most people assume...").
- Let the story breathe. Some paragraphs can be 3-4 sentences if they flow well.
`,
    "carousel": `
OUTPUT TYPE: CAROUSEL (CONCEPTUAL SLIDES)
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
- If it reads like a blog post, you've failed.
`,
    "short-viral-hook": `
OUTPUT TYPE: SHORT HOOK POST
Target length: 450–850 characters.

FIRST 2 LINES = HOOK (MANDATORY):
- The very first 2 lines of the post MUST be the hook.
- CRITICAL: Keep hook under 140 characters total (before LinkedIn's "see more" fold).
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
`
  }
  return rules[format]
}

function getInstructionPrompt(
  format: LinkedInFormat,
  context: GenerateContext,
  regenerate: boolean
): string {
  const { readerContext, angle, emojiOn, tonePreset } = context

  const emojiInstruction = emojiOn ? "Required (2–5). Usage is mandatory. Use relevantly to enhance meaning. Place at natural breaks." : "Do not use emojis"

  const regenerationInstruction = regenerate
    ? `RETRY MODE:
- Write a genuinely different hook + framing (not a paraphrase).
- Change the entry point (e.g., if previous hook was a question, use a blunt statement or contrast).
- Make it 15–25% sharper and more specific (more source detail, less abstraction).`
    : ""

  const formatRules = getFormatRules(format)

  /**
   * Critical upgrade: force a silent extraction step that:
   * - selects a single failure pattern/assumption from the source
   * - selects concrete anchors so it cannot drift into generic advice
   * - keeps the "angle" enforced without repeating "the mistake is..."
   */
  let process = ``

  if (format === 'carousel') {
    process = `PROCESS (silent, do not output):
1) Identify the "Old Way" vs "New Way" thinking in the source.
2) Extract the underlying principle (the "Why"), stripping away the "How" (tools/steps).
3) Map out a 5-6 slide journey that leads the reader to the sudden realization of the New Way.
4) Ensure the "Gap" between slides pulls the reader forward (curiosity gap).`
  } else {
    process = `PROCESS (silent, do not output):
1) Pick ONE failure pattern from the source (assumption → consequence). If angle is provided, use it as the lens.
2) Extract 3 "SOURCE ANCHORS" (specific terms/steps/tools/numbers). You must use at least 2 in the post.
3) Decide the best reader takeaway for the chosen reader context.`
  }

  const writeInstructions = `WRITE (output only the post):
- Do NOT name the angle explicitly with template phrases (avoid "the common mistake is...").
- Make the angle obvious through examples, contrast, and natural reinforcement.
- Vary paragraph lengths. Mix punchy 1-liners with 2-3 sentence thoughts. Monotony = robotic.
- Group related ideas. Use whitespace to create visual flow, not after every sentence.
- No markdown styling. Raw text only.`

  // Reader context guidance (lightweight, not persona-theatre)
  const readerGuidance = (() => {
    const rc = (readerContext || "").toLowerCase()
    if (rc.includes("decision")) {
      return `READER CONTEXT NOTE:
Write for decision-makers: frame as trade-offs, risk, cost of wrong priorities, and operational reality. Avoid emotional self-help tone.`
    }
    if (rc.includes("learner") || rc.includes("student")) {
      return `READER CONTEXT NOTE:
Write for learners: be slightly more explanatory, but still skimmable.`
    }
    if (rc.includes("peer")) {
      return `READER CONTEXT NOTE:
Write for peers: assume baseline familiarity, be concise, no hand-holding.`
    }
    return `READER CONTEXT NOTE:
Write for general LinkedIn readers: simple language, fast clarity.`
  })()

  // Angle note (kept subtle: lens, not literal)
  const angleNote = angle
    ? `ANGLE LENS:
Use this lens to choose what matters and what to ignore: "${angle}".`
    : `ANGLE LENS:
Auto-pick the strongest single lens from the source. Ignore the rest.`

  return `CONTEXT:
- Reader: ${readerContext || "General LinkedIn readers"}
- Tone: ${tonePreset || "professional"}
- Emojis: ${emojiInstruction}
${angleNote}

${readerGuidance}

${regenerationInstruction}

${process}

${writeInstructions}

${formatRules}

OUTPUT CONSTRAINTS:
- Total length must be under ${MAX_OUTPUT_CHARS} characters.
- Hashtags: 0–5 at the end, only if relevant to the source.
- Emojis: ${emojiInstruction}

BONUS OUTPUT (Mandatory):
After the post, add a separator "---EXTRA_HOOKS---" and list exactly 5 alternative hooks.
Rules for extra hooks:
- Each hook must be grounded in a concrete source anchor (no generic life advice).
- Each hook must be 1–2 lines max.
Format exactly (just the text, no labels):
1. ...
2. ...
3. ...
4. ...
5. ...`
}

function getUserPrompt(inputText: string): string {
  const safeInput = inputText.replace(/"""/g, "'''")
  // Inject explicit entropy to prevent cache/determinism loops
  const entropy = `Generation Timestamp: ${Date.now()}`

  return `SOURCE CONTENT:
"""
${safeInput}
"""

---
User Metadata (Ignore for content, but use for sampling):
${entropy}`
}

async function generateWithOpenAI(options: GenerateOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OPENAI_API_KEY not set")

  validateInput(options.inputText)

  const openai = new OpenAI({ apiKey })
  const systemPrompt = getSystemPrompt()
  const instructionPrompt = getInstructionPrompt(
    options.format,
    options.context,
    options.regenerate || false
  )
  const userPrompt = getUserPrompt(options.inputText)

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `${instructionPrompt}\n\n${userPrompt}` }
      ],
      // Slightly lower temp = less generic motivational drift
      temperature: 0.6,
      max_tokens: 1800
    })

    const text = response.choices[0].message.content
    if (!text) throw new Error("Empty response from AI")
    return text.trim()
  } catch (error: any) {
    console.error("OpenAI generation error:", error)
    if (error.status === 429) throw new Error("AI service busy. Try again shortly.")
    if (error.status === 400) throw new Error("Content could not be processed.")
    throw new Error("AI generation failed.")
  }
}

/**
 * Main entry point for generating LinkedIn content.
 * Handles normalization, validation, and race-conditions (timeouts).
 */
export async function generateLinkedInFormat(
  format: LinkedInFormat,
  inputText: string,
  context: GenerateContext,
  regenerate?: boolean
): Promise<string> {
  const normalized = normalizeInput(inputText)
  if (normalized.length > MAX_INPUT_CHARS) {
    throw new Error(`Input too long (${normalized.length} chars).`)
  }

  // Timeout wrapper (60s)
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("AI generation timeout")), 60000)
  })

  return Promise.race([
    generateWithOpenAI({ format, inputText: normalized, context, regenerate }),
    timeoutPromise
  ])
}
