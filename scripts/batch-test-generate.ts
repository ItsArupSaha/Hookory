import { extractTextFromUrl } from "@/lib/url-extractor"
import { generateLinkedInFormat, GenerateContext, LinkedInFormat } from "@/lib/ai"
import * as fs from "fs"
import * as path from "path"
import dotenv from "dotenv"

// Load environment variables locally
dotenv.config({ path: ".env.local" })

// Test URLs for verification after prompt changes
const URLS = [
    "https://medium.com/write-a-catalyst/5-habits-from-atomic-habits-that-improved-my-life-in-6-months-efd911d364fd",
    "https://ahrefs.com/blog/what-ai-means-for-seo/",
    "https://medium.com/@karancodes0207/the-blockchains-blind-spot-what-is-the-oracle-problem-bdc76febfbe5",
    "https://blog.n8n.io/agentic-rag/",
    "https://ahrefs.com/blog/seo-content-strategy/",
    "https://blog.n8n.io/ai-workflow-builder-best-practices/",
    "https://openai.com/research/planning-for-agi-and-beyond"
]

// All 4 formats for each URL
const FORMATS: LinkedInFormat[] = ["main-post", "story-based", "carousel", "short-viral-hook"]

// Pools for random context generation
const ANGLE_POOL = [
    "Key Insight",
    "Personal Transformation",
    "Industry Disruption",
    "Technical Deep Dive",
    "Emerging Technology",
    "Strategic Framework",
    "Production Lessons",
    "Practical How-To",
    "Future Vision",
    "Contrarian Take"
]

const READER_POOL = [
    "General LinkedIn Professionals",
    "Busy Professionals seeking productivity",
    "Marketing and Growth Leaders",
    "Technical Founders and Engineers",
    "Content Creators and Writers",
    "Startup Founders",
    "Coaches and Consultants",
    "Solopreneurs",
    "Tech Leaders and Investors",
    "Career Changers"
]

const TONE_POOL: Array<"professional" | "conversational" | "bold"> = [
    "professional",
    "conversational",
    "bold"
]

// Helper to pick random item from array
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

// Dynamic random context generator - works with ANY URL
function getRandomContext(): GenerateContext {
    return {
        angle: pickRandom(ANGLE_POOL),
        readerContext: pickRandom(READER_POOL),
        tonePreset: pickRandom(TONE_POOL),
        emojiOn: Math.random() > 0.5 // 50% chance
    }
}

async function runBatch() {
    console.log(`🧪 Running VERIFICATION TEST (${URLS.length} URLs x ${FORMATS.length} Formats = ${URLS.length * FORMATS.length} Outputs)...`)
    console.log("=".repeat(60))

    let outputBuffer = "\n\n"
    outputBuffer += "=".repeat(60) + "\n"
    outputBuffer += "FULL VERIFICATION TEST: PROMPT QUALITY OVERHAUL\n"
    outputBuffer += `Timestamp: ${new Date().toISOString()}\n`
    outputBuffer += "=".repeat(60) + "\n"

    let successCount = 0
    let failCount = 0

    for (const url of URLS) {
        console.log(`\n${"=".repeat(60)}`)
        console.log(`Processing: ${url}`)
        console.log("=".repeat(60))

        outputBuffer += `\n\n${"=".repeat(60)}\n`
        outputBuffer += `SOURCE: ${url}\n`
        outputBuffer += "=".repeat(60) + "\n"

        try {
            console.log("  ↳ Extracting content...")
            const inputText = await extractTextFromUrl(url)

            const context = getRandomContext()
            outputBuffer += `CONTEXT: Angle="${context.angle}", Reader="${context.readerContext}", Tone="${context.tonePreset}", Emoji=${context.emojiOn}\n`
            console.log(`  ↳ Context: ${context.angle} | ${context.readerContext} | ${context.tonePreset}`)

            for (const format of FORMATS) {
                console.log(`    ↳ Generating ${format}...`)
                try {
                    const content = await generateLinkedInFormat(format, inputText, context)

                    outputBuffer += `\n[FORMAT: ${format.toUpperCase()}]\n`
                    outputBuffer += "-".repeat(40) + "\n"
                    outputBuffer += `${content}\n`
                    outputBuffer += "-".repeat(40) + "\n"

                    successCount++
                    console.log(`      ✅ Success`)
                } catch (err: any) {
                    failCount++
                    console.error(`      ❌ Failed: ${err.message}`)
                    outputBuffer += `\n[FORMAT: ${format.toUpperCase()}] ERROR: ${err.message}\n`
                }
            }

        } catch (err: any) {
            failCount += FORMATS.length // Count all formats as failed for this URL
            console.error(`  ❌ Extraction Failed: ${err.message}`)
            outputBuffer += `ERROR EXTRACTING CONTENT: ${err.message}\n`
        }
    }

    // Summary
    outputBuffer += `\n\n${"=".repeat(60)}\n`
    outputBuffer += `SUMMARY\n`
    outputBuffer += `${"=".repeat(60)}\n`
    outputBuffer += `Total URLs: ${URLS.length}\n`
    outputBuffer += `Total Formats: ${FORMATS.length}\n`
    outputBuffer += `Expected Outputs: ${URLS.length * FORMATS.length}\n`
    outputBuffer += `Successful: ${successCount}\n`
    outputBuffer += `Failed: ${failCount}\n`
    outputBuffer += "=".repeat(60) + "\n"

    const outputPath = path.resolve(process.cwd(), "verification_audit.txt")
    fs.appendFileSync(outputPath, outputBuffer)

    console.log(`\n${"=".repeat(60)}`)
    console.log(`✅ Verification complete!`)
    console.log(`   Successful: ${successCount} | Failed: ${failCount}`)
    console.log(`   Results appended to: ${outputPath}`)
    console.log("=".repeat(60))
}

runBatch().catch(console.error)
