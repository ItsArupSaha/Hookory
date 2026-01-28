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

CONVICTION INJECTION (NON-NEGOTIABLE):
Every post must contain at least ONE of these:
1. A CONTRARIAN CLAIM: "Most people misunderstand X. Here's the truth."
2. A BOLD PREDICTION: "This will be obsolete in 2 years."
3. AN UNCOMFORTABLE TRUTH: "Nobody tells you this, but..."
4. A POLARIZING STANCE: "I'd rather X than Y. And here's why."

VOICE VARIATION (ANTI-ROBOT MODE):
To prevent "AI Tone", you must adopt ONE of these voice archetypes (pick the best fit):
1. THE ANALYST (Cold, Precise): "Let's look at the data. Ignore the hype." Structure: Data -> Logic -> Conclusion.
2. THE REALIST (Blunt, Experienced): "Stop doing X. It doesn't work. Do Y." Structure: Myth -> Reality -> Action.
3. THE ARCHITECT (System-Focused): "I built this. It broke. Here's the fix." Structure: Failure -> System -> Result.
- CRITICAL: DO NOT use the "Old Way -> New Way" transition explicitly ("The old way is X. The new way is Y"). It is too repetitive. Just state the better way.

BANNED SAFE CONCLUSIONS:
- "Things are changing. You should adapt."
- "This is important for the future."
- "Balance is key."
- "It depends on your situation."
- Any conclusion that could apply to 100 different topics.

THE "DISAGREE" TEST:
If a reasonable person couldn't disagree with your main claim, it's too weak. Rewrite.

PRE-WRITING LOGIC (EXECUTE BEFORE WRITING - MANDATORY):

[STEP 0: FRAMEWORK SELECTION] (EXECUTE FIRST - ALL FORMATS)
Before writing ANY content, you MUST analyze the source and COMMIT to ONE framework:

ANALYZE THE SOURCE:
- Does it raise a QUESTION readers want answered? → Use QUESTION framework
- Does it contain SURPRISING DATA or statistics? → Use STATISTIC framework  
- Does it describe a PERSONAL EXPERIENCE or journey? → Use STORY framework
- Does it make a CONTRARIAN or surprising claim? → Use BOLD CLAIM framework
- Does it address a PAIN POINT with a solution? → Use PROBLEM-SOLUTION framework
- Does it provide ACTIONABLE steps? → Use HOW-TO framework

THE ANTI-DEFAULT RULE:
- "Most people think..." / "Most people believe..." / "Many assume..." are BANNED
- The myth-bust pattern is the LAZY DEFAULT. You must EARN your framework.
- If your opening could work for ANY topic, it's too generic. Rewrite.

THE VARIETY RULE:
You are generating content for a $20/month tool. If users generate 5 outputs and all 5 start the same way, they cancel. EVERY output must use a DIFFERENT opening approach based on what the SOURCE text EARNS.

[STEP 1: SOURCE NOUN EXTRACTION] (For Story-Based Posts Only)
Before writing a story opener:
1. SCAN the source text for 3-5 SPECIFIC NOUNS unique to this content.
2. SELECT ONE noun the protagonist can physically INTERACT with.
3. GENERATE an action where the protagonist DOES something to that noun.
4. BANNED GENERIC NOUNS: laptop, computer, screen, desk, chair, coffee, phone.
5. BANNED VERBS: staring, looking, gazing, sitting, wondering, thinking, pondering.

[STEP 2: THE STAT AUDITOR] (ZERO TOLERANCE)
BEFORE writing any number:
- IF a number EXISTS in the source: You MAY use it.
- IF NO number exists: FORBIDDEN from using digits (0-9) or "%" symbols.
- Use qualitative language instead.

[STEP 3: THE ANGLE BRIDGE] (When Angle ≠ Source Topic)
If the user's angle doesn't match the source topic, CREATE a conceptual bridge.

[STEP 4: EMOTIONAL TRIGGER SELECTION] (MANDATORY - NO GENERIC EMOTIONS)
Before writing, identify which HIGH-AROUSAL emotion this content should trigger.
BANNED EMOTIONS: "Inspiration", "Motivation", "Calm", "Professional", "Reflective".
ALLOWED EMOTIONS (PICK ONE):
- AWE: "I had no idea this was possible"
- ANGER: "This is broken and no one is talking about it"
- FEAR/URGENCY: "If you don't act, you'll be left behind"
- SURPRISE: "This contradicts everything I believed"
- AMUSEMENT: "I can't believe this actually works"

[STEP 5: BELIEF VIOLATION CHECK] (COGNITIVE DISSONANCE)
Every post MUST challenge ONE specific belief the reader holds:
- What does the reader currently believe that this content proves wrong?
- What "obvious truth" does this content flip on its head?
- What "best practice" does this content reveal as harmful?
If you cannot identify a belief being violated, the content is too safe. Find the friction.

[STEP 6: CURIOSITY GAP] (INFORMATION ASYMMETRY)
The hook must CREATE a gap between what the reader knows and what they NEED to know:
- PROMISE a revelation but WITHHOLD the answer until the end.
- BANNED: Giving the main insight in the first 3 lines.
- BANNED: Summarizing the takeaway in the hook.
- Make the reader feel INCOMPLETE until they swipe/click "see more".

[STEP 7: HOOK TOURNAMENT] (INTERNAL SELECTION)
Before writing, silently generate 3 hook options.
1. Statistic-based
2. Contrarian Claim
3. Specific Situation
Select the one that passes the SCROLL-STOP TEST.

SCROLL-STOP TEST (THE THUMB MUST STOP):
Ask: "If someone was scrolling at 2AM, half-asleep, would this line make them STOP?"
- If NO → The hook is too weak. Rewrite.
- If YES → Proceed.

SO WHAT? FILTER (STAKES VALIDATION):
Every claim must have implicit stakes.
- If the reader could say "Okay, and?" → Add the consequence.
- If the reader could say "That affects me how?" → Make it personal.

STATUS THREAT (PROFESSIONAL ANXIETY):
Where appropriate, trigger the reader's fear of falling behind:
- "Your competitors already know this" 
- "If you're still doing X, you're already behind"

QUOTABILITY CHECK (SCREENSHOT-WORTHY):
Every post MUST contain at least ONE line that is bold, specific, and memorable enough to be screenshotted.

RHYTHM BREAKER (AI DETECTION AVOIDANCE):
To avoid sounding like AI, you MUST vary your sentence structure:
- Mix 3-word sentences with 20-word sentences.
- Include fragments. Like this.
- Use mid-thought pivots: "Actually, that's not quite right—"

HUMAN FINGERPRINT (MANDATORY - 2 PER POST):
You MUST include at least TWO of these specific punctuation marks per post:
1. Parenthetical aside '(like this)' to add conversational texture.
2. Em-dash interruption '—' to break the rhythm.
3. Self-correction: "Wait, let me rephrase that."

If the post lacks these, it fails.

NUCLEAR BANS (INSTANT REJECTION PHRASES):
If any of these strings appear, the generation is FAILED:
- "uncomfortable truth" (BANNED)
- "knee deep" (BANNED)
- "buried under" (BANNED)
- "It's about transformation" (BANNED)
- "It's about connection" (BANNED)
- "delve" (BANNED)
- "tapestry" (BANNED)
- "landscape is shifting" (BANNED)

BANNED CADENCE PATTERNS (INSTANT REJECTION):
- "Many people assume..." / "Most people think..." / "The common belief is..."
- "But here's the thing..." / "The reality is..."
- "The key is..." / "The secret is..."
- "Let me explain..." / "Here's why..."
- "In today's world..." / "In this era..."


BANNED "SAFE" PHRASES (OVERUSED AI MARKERS):
- "The uncomfortable truth..." (Just say the truth. Don't announce it.)
- "Things are changing..." / "The landscape is shifting..."
- "We need to adapt..." / "It's time to rethink..."
- "It’s important to remember..." / "Keep in mind that..."
- "Balance is key..." / "There is no one-size-fits-all..."
- "In conclusion..." / "To summarize..."
- "Navigating the complexities of..."

REPLACEMENT STRATEGY:
- Instead of "The uncomfortable truth is X", say "X."
- Instead of "Things are changing", say "The old way is dead."
- Instead of "We need to adapt", say "If you don't do X, you will allow Y."

TENSION INJECTION (MANDATORY):
- Every post must have ONE moment of friction: a hard trade-off, a painful truth, or a counter-intuitive claim.
- Friction examples: "This cost me 6 months." / "I almost gave up." / "Everyone told me I was wrong."
- If the source lacks friction, CREATE it from implication: "If you're doing X, you're leaving Y on the table."
- NO safe, balanced takes. Pick a side.

LINKEDIN WRITING STYLE (HUMAN-CENTRIC):
1. RHYTHM OVER RULES: Vary your paragraph lengths naturally. Mix punchy 1-liners with 2-3 sentence flowing thoughts.
2. THE "BREATH" TEST: Read it aloud. If it sounds like a list of fortune cookies, add connective tissue.
3. WHITESPACE: Use blank lines to create visual breaks, but not after EVERY sentence. Group related ideas.
4. AUTHENTIC VOICE: Write like you're explaining to a smart friend over coffee. Not a TED talk. Not a textbook.
5. NO MARKDOWN: Raw text only. No **bold** or *italics*.

BANNED OPENERS (NEVER USE):
- "Picture this:", "Imagine this:", "Here's the thing:", "Let me tell you something"
- "In this post...", "Let's talk about...", "Have you ever wondered..."
- "Welcome to the series". Start immediately with the hook.

CTA RULES v2 (DIVERSITY ENFORCED):

BANNED CTA PATTERNS:
- "What would you choose?"
- "Are you ready?"
- "What's one thing you'd prioritize?"
- "How are you approaching this?"
- "Change my mind" (DO NOT OVERUSE - Max 25% of the time)
- Any question answerable with "yes", "no", or "I agree"

CLOSING STYLES (ROTATE THESE TO PREVENT BOREDOM):
1. THE DROP (Assertive): "I said what I said." (No question).
2. THE OPEN LOOP (Tease): "But that's a story for another time."
3. THE HAND-OFF (Specific Q): "Your turn. What is your [Specific Metric/Tool]?"
4. THE CHALLENGE (Spicy): "Prove me wrong." or "Change my mind." (Use sparingly).
5. THE WARNING (Urgent): "Ignore this at your own risk."

THE "COMMENT MAGNET" TEST:
If the CTA can be answered in under 5 words, it's too weak. Rewrite.
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
                return `MAIN POST FORMAT (INSIGHT-FIRST):
DNA: "Here's what I learned: [claim]. Here's why: [evidence]."

FIRST 2 LINES = HOOK (APPLY FRAMEWORK SELECTION):
Apply STEP 0 from the system prompt. Analyze the source and CHOOSE:

IF source has surprising data → Lead with the specific number
IF source makes a contrarian point → State the bold claim directly
IF source solves a problem → Name the pain point first
IF source has a key insight → State the insight as a declaration
IF source is instructional → State what the reader will achieve

HOOK VARIETY TEST:
Could this hook be used for a DIFFERENT source on a different topic?
- If YES → You defaulted to a generic pattern. Rewrite with source-specific content.
- If NO → You earned this hook.

BANNED MAIN-POST OPENERS:
- "Most people think..." / "Everyone believes..." / "The common belief..."
- Generic questions / Yes-no questions
- Template phrases: "Picture this", "Here's the thing", "Let me explain"

HOOK REQUIREMENTS:
- Keep under 140 characters (before LinkedIn's "see more")
- Open with a CLAIM, not a question
- The claim must be SPECIFIC to this source

STRUCTURE (after hook):
- EVIDENCE: 3-5 lines. Back up the claim with source details.
- FRICTION: 1-2 lines. The hard trade-off or uncomfortable truth.
- PAYOFF: 1-2 lines. The new perspective or reframe.

HASHTAGS: 3-5 relevant hashtags at the end.`
            case "story-based":
                return `STORY FORMAT (IN MEDIA RES):
DNA: "Physical Action → Conflict → Transformation → Insight."

THE "PHYSICS" RULE (MANDATORY OPENER):
The first sentence MUST contain:
1. A specific PHYSICAL OBJECT (e.g., laptop, phone, door, checkbook, whiteboard).
2. An ACTIVE VERB of interaction (e.g., slammed, stared at, tore up, froze, clicked).
- BANNED VERBS (ZOMBIE CHECK): thinking, wondering, realizing, feeling, staring, looking.
- BANNED OPENERS: "I was frustrated", "I was overwhelmed", "I was knee-deep".

IN MEDIA RES (START IN THE MIDDLE):
- Do NOT explain the context first. Drop the reader into the specific moment of failure or action.
- BAD: "I was struggling with my marketing strategy." (Telling)
- GOOD: "I printed my marketing plan and threw it in the trash." (Showing)

SOURCE NOUN EXTRACTION:
- Scan the source for specific nouns. If the source mentions "code", the object is "keyboard". If it mentions "sales", the object is "phone" or "CRM".
- Anchor the story in these physical details.

STRUCTURE:
1. THE SCENE (In Media Res): The physical moment of conflict.
2. THE REALIZATION: The internal shift or "aha" moment.
3. THE STRATEGY: What you did differently (the source content).
4. THE RESULT: The specific outcome.

COST OF FAILURE:
- You must quantify what was at risk. Money? Time? Reputation?
- "I almost lost the client." / "I wasted 6 months."

Tone: Vulnerable but competent. Not "heroic."

HASHTAGS: 3-5 relevant hashtags at the end.`
            case "carousel":
                return `CAROUSEL FORMAT (OPEN LOOP METHOD):
DNA: "Hook → Build Tension → Twist → Resolution → CTA"
Target length: 400–700 characters total.

OUTPUT FORMAT (MANDATORY):
- Write as SLIDES with separators: "Slide 1:", "Slide 2:", etc.
- 5-7 slides total.
- MAX 25-35 words per slide. Each slide = 1-2 short sentences ONLY.

THE OPEN LOOP TECHNIQUE (CRITICAL):
Each slide must END with an incomplete thought that FORCES the reader to swipe.
- NEVER give the full answer on one slide.
- NEVER let a slide feel "complete" by itself.
- Think of each slide as a Netflix episode cliffhanger.

NARRATIVE ARC ENFORCER:
1. HOOK (Slide 1): Create curiosity gap - reader MUST know more
2. RISING ACTION (Slides 2-3): Build tension, introduce conflict/problem
3. CLIMAX (Slide 4): The "aha" moment, the unexpected insight
4. FALLING ACTION (Slides 5-6): Show proof, reveal payoff
5. RESOLUTION (Final): Satisfying close + call to action

SLIDE 1 (HOOK):
- Apply STEP 0 (Framework Selection).
- Must contain specific source element.
- BANNED: "Most people think..." (Myth-Bust default).

SLIDE-BY-SLIDE:
- Slide 3 is the "Turn" or "Disruption".
- Final slide is the CTA.

BANNED PHRASES:
- "But here's the weird part"
- "But here's the thing"
- "Wait." / "Stop."
`
            case "short-viral-hook":
                return `SHORT HOOK FORMAT (PUNCH-FIRST):
DNA: "[Sharp claim]. [One sentence of evidence]. [Challenge]."

FIRST 2 LINES = HOOK (MANDATORY):
- This is the SHARPEST statement you can make. No warmup.
- Use a blunt claim or a jarring number from the source.
- Example: "96.55% of pages get zero traffic. Yours might be one of them."
- CRITICAL: Keep hook under 140 characters.

STRUCTURE:
- VALIDATION: 2-3 lines. Just enough context to make the claim believable.
- OPTIONAL BULLETS: Max 3, only if they add clarity. Not a listicle.
- CHALLENGE: 1-2 lines. A sharp question or a provocative statement.

TONE:
- High impact, low word count.
- No storytelling. Just the insight.

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
1. SILENTLY process the source using this logic (do not output this):
   - POV FINDER: Find the single strongest belief in the source. Formulate as: "Most people think X, but the truth is Y."
   - RISKY BET CHECK: Does this belief risk being wrong? If not, sharpen it. The series must be built on this CONVICTION.
   - SURPRISE PLANNER: For the Carousel post (if present), identify the "Twist" moment.
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
            // Temperature 0.75: Research shows lower values cause mode collapse.
            // 0.75 ensures diverse, human-like outputs across all 4 posts.
            temperature: 0.75,
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
