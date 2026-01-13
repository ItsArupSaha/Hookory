import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"

export type LinkedInFormat =
  | "thought-leadership"
  | "story-based"
  | "educational-carousel"
  | "short-viral-hook"

export interface GenerateContext {
  targetAudience?: string
  goal?: "engagement" | "leads" | "authority"
  style?: "thought-leader" | "storyteller" | "educator"
  emojiOn?: boolean
  tonePreset?: "professional" | "conversational" | "storytelling" | "educational"
}

export interface GenerateOptions {
  format: LinkedInFormat
  inputText: string
  context: GenerateContext
  regenerate?: boolean
}

const AI_PROVIDER = (process.env.AI_PROVIDER || "gemini") as "gemini" | "openai"

// Input length guard
const MAX_INPUT_CHARS = 10000
const MAX_OUTPUT_CHARS = 3000

function normalizeInput(inputText: string): string {
  // Trim whitespace
  let normalized = inputText.trim()
  
  // Collapse excessive newlines (more than 2 consecutive newlines → 2 newlines)
  normalized = normalized.replace(/\n{3,}/g, "\n\n")
  
  // Collapse excessive spaces (more than 2 consecutive spaces → 2 spaces)
  normalized = normalized.replace(/ {3,}/g, "  ")
  
  return normalized
}

function validateInput(inputText: string): void {
  if (!inputText || inputText.trim().length === 0) {
    throw new Error("Input text cannot be empty")
  }
  
  // Check for meaningful content (not just whitespace/special chars)
  const meaningfulContent = inputText.replace(/[\s\n\r\t]/g, "")
  if (meaningfulContent.length < 10) {
    throw new Error("Input text is too short. Please provide more content to repurpose.")
  }
  
  if (inputText.length > MAX_INPUT_CHARS) {
    throw new Error(`Input text exceeds maximum length of ${MAX_INPUT_CHARS} characters`)
  }
}

function getSystemPrompt(): string {
  return `You are a LinkedIn content strategist who specializes in writing high-performing, human-sounding LinkedIn posts.

Your expertise:
- Crafting posts that feel authentic and written by a real person
- Avoiding generic AI phrasing and corporate jargon
- Writing in a conversational, engaging style that builds trust
- Creating content that drives real engagement, not just vanity metrics`
}

function getFormatRules(format: LinkedInFormat, emojiOn: boolean): string {
  const rules: Record<LinkedInFormat, string> = {
    "thought-leadership": `Format: Thought Leadership Post
- Start with a bold insight or contrarian take (first 2 lines must grab attention)
- Support with data, experience, or reasoning
- Use 8-12 short lines total (not essay-like)
- Strategic whitespace between paragraphs (2-3 sentences per paragraph max)
- End with a question or call to action that invites discussion
- Professional tone, authoritative voice
- Target length: 800-1200 characters`,
    "story-based": `Format: Story-Based Post
- Open with a personal story, anecdote, or narrative hook (first 2 lines must grab attention)
- Use a narrative arc: setup → conflict/insight → resolution/lesson
- Make it relatable and human
- Use 10-15 short lines total
- End with a reflection or actionable takeaway
- Target length: 1000-1500 characters`,
    "educational-carousel": `Format: Educational/Carousel Text
- Structure as numbered points or steps (maximum 6 points)
- Each point should be clear and actionable
- Use formatting like "${emojiOn ? "1️⃣" : "1."}", "${emojiOn ? "2️⃣" : "2."}" for each point
- Start with why this matters
- End with a summary and CTA
- Optimize for carousel format (each point can be a slide)
- Target length: 1200-1800 characters`,
    "short-viral-hook": `Format: Short Viral Hook Version
- Maximum 500 characters (strict limit)
- Ultra-engaging hook in first line
- One key insight or takeaway
- Strong CTA
- Keep it to 5-7 short lines (LinkedIn rewards restraint)
- Designed for maximum engagement in minimal space`,
  }
  return rules[format]
}

function getInstructionPrompt(
  format: LinkedInFormat,
  context: GenerateContext,
  regenerate: boolean
): string {
  const { targetAudience, goal, style, emojiOn, tonePreset } = context

  const goalText =
    goal === "engagement"
      ? "maximize likes, comments, and shares"
      : goal === "leads"
      ? "drive qualified leads and inquiries with soft CTAs"
      : "establish thought leadership and authority"

  const styleText =
    style === "thought-leader"
      ? "authoritative, insightful, forward-thinking"
      : style === "storyteller"
      ? "narrative-driven, personal, relatable"
      : "clear, educational, value-driven"

  const toneText =
    tonePreset === "professional"
      ? "professional and polished"
      : tonePreset === "conversational"
      ? "conversational and approachable, still professional"
      : tonePreset === "storytelling"
      ? "narrative and engaging"
      : tonePreset === "educational"
      ? "clear and instructive"
      : "balanced and engaging"

  const audienceText = targetAudience ? `Target audience: ${targetAudience}. ` : ""

  const emojiInstruction = emojiOn
    ? "Use 1-3 relevant emojis strategically placed (not excessive)."
    : "Do not use emojis."

  const variationHint = regenerate
    ? `CRITICAL - This is a regenerated version. You MUST create a noticeably different post:
- Use a completely different opening hook (different angle, different phrasing)
- Change the sentence rhythm and structure
- Avoid reusing any phrasing from earlier versions
- Present the same core idea but from a fresh perspective
- This should feel like a different angle, not just a rewrite`
    : ""

  return `Write a ${format.replace(/-/g, " ")} LinkedIn post.

Goal: ${goalText}
Tone: ${toneText}
Style: ${styleText}
${audienceText}${emojiInstruction}

${variationHint}

LinkedIn formatting rules:
- Strong hook in first 2 lines (must grab attention immediately)
- Short lines with strategic whitespace (2-3 sentences per paragraph max)
- No hashtags OR maximum 3 relevant hashtags at the end
- Clear CTA at the end
- Avoid filler words and fluff
- Be authentic and human
- Character limit: ${MAX_OUTPUT_CHARS} characters

CRITICAL: Avoid phrases commonly used by AI such as:
"delve into", "unlock", "in today's fast-paced world", "revolutionary", 
"game-changer", "let's explore", "dive deep", "leverage", "harness",
"unlock the power of", "transform your", "elevate your", "navigate",
"embark on a journey", "in the realm of", "unveil", "master the art of".

Write like a real LinkedIn creator would write. Use natural, conversational language.

${getFormatRules(format, !!emojiOn)}`
}

function getUserPrompt(inputText: string): string {
  // Input is already normalized before this function is called
  const truncated = inputText.substring(0, MAX_INPUT_CHARS)
  return `Original content to repurpose:
${truncated}`
}

async function generateWithGemini(options: GenerateOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set")
  }

  validateInput(options.inputText)

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const systemPrompt = getSystemPrompt()
  const instructionPrompt = getInstructionPrompt(
    options.format,
    options.context,
    options.regenerate || false
  )
  const userPrompt = getUserPrompt(options.inputText)

  // Combine prompts for Gemini (Gemini doesn't have separate system/user roles like OpenAI)
  const fullPrompt = `${systemPrompt}

${instructionPrompt}

${userPrompt}`

  try {
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from AI")
    }

    // Guard against overly long outputs
    const trimmed = text.trim()
    if (trimmed.length > MAX_OUTPUT_CHARS) {
      return trimmed.substring(0, MAX_OUTPUT_CHARS).trim()
    }

    return trimmed
  } catch (error: any) {
    console.error("Gemini generation error:", error)
    // Return user-safe error messages
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("AI service is temporarily unavailable. Please try again in a moment.")
    }
    if (error.message?.includes("timeout") || error.message?.includes("deadline")) {
      throw new Error("Request timed out. Please try again.")
    }
    throw new Error("AI generation failed. Please try again.")
  }
}

async function generateWithOpenAI(options: GenerateOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not set")
  }

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
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `${instructionPrompt}\n\n${userPrompt}`,
        },
      ],
      max_tokens: 2000,
      temperature: options.regenerate ? 0.8 : 0.7, // Slightly higher temperature for regenerate
    })

    const text = completion.choices[0]?.message?.content
    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from AI")
    }

    // Guard against overly long outputs
    const trimmed = text.trim()
    if (trimmed.length > MAX_OUTPUT_CHARS) {
      return trimmed.substring(0, MAX_OUTPUT_CHARS).trim()
    }

    return trimmed
  } catch (error: any) {
    console.error("OpenAI generation error:", error)
    // Return user-safe error messages
    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("AI service is temporarily unavailable. Please try again in a moment.")
    }
    if (error.message?.includes("timeout") || error.message?.includes("deadline")) {
      throw new Error("Request timed out. Please try again.")
    }
    throw new Error("AI generation failed. Please try again.")
  }
}

export async function generateLinkedInFormat(
  format: LinkedInFormat,
  inputText: string,
  context: GenerateContext,
  regenerate?: boolean
): Promise<string> {
  // Normalize and validate input before processing
  const normalized = normalizeInput(inputText)
  validateInput(normalized)

  const options: GenerateOptions = {
    format,
    inputText: normalized.substring(0, MAX_INPUT_CHARS), // Truncate after normalization
    context,
    regenerate,
  }

  // Timeout wrapper
  const timeoutPromise = new Promise<string>((_, reject) => {
    setTimeout(() => reject(new Error("AI generation timeout")), 60000) // 60s timeout
  })

  const generationPromise =
    AI_PROVIDER === "gemini"
      ? generateWithGemini(options)
      : generateWithOpenAI(options)

  try {
    return await Promise.race([generationPromise, timeoutPromise])
  } catch (error: any) {
    // Wrap timeout errors in user-safe messages
    if (error.message?.includes("timeout")) {
      throw new Error("Request timed out. Please try again.")
    }
    // Re-throw other errors (they're already user-safe from the generator functions)
    throw error
  }
}
