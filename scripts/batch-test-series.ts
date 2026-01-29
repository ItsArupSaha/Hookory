import { extractTextFromUrl } from "@/lib/url-extractor"
import { generateSeries, SeriesGenerationOptions } from "@/lib/ai/series"
import { GenerateContext, LinkedInFormat } from "@/lib/ai/index"
import * as fs from "fs"
import * as path from "path"
import dotenv from "dotenv"

// Load environment variables locally
dotenv.config({ path: ".env.local" })

// Test URLs - Add as many as you want!
const URLS = [
    "https://medium.com/write-a-catalyst/5-habits-from-atomic-habits-that-improved-my-life-in-6-months-efd911d364fd",
    "https://ahrefs.com/blog/what-ai-means-for-seo/",
    "https://medium.com/@karancodes0207/the-blockchains-blind-spot-what-is-the-oracle-problem-bdc76febfbe5",
    "https://blog.n8n.io/agentic-rag/",
    "https://ahrefs.com/blog/seo-content-strategy/",
    "https://blog.n8n.io/ai-workflow-builder-best-practices/",
    "https://openai.com/research/planning-for-agi-and-beyond"
]

// Format cycle: main-post -> story-based -> short-viral-hook -> carousel -> repeat
const FORMAT_CYCLE: LinkedInFormat[] = ["main-post", "story-based", "short-viral-hook", "carousel"]

// Pools for random context generation
const ANGLE_POOL = [
    "Key Insight",
    "Strategies",
    "Mistakes",
    "Future Trends",
    "Case Study",
    "Contrarian Take",
    "Practical How-To"
]

const READER_POOL = [
    "Founders",
    "Engineers",
    "Marketers",
    "Investors",
    "Creators",
    "Tech Leaders",
    "Solopreneurs"
]

const TONE_POOL: Array<"professional" | "conversational" | "bold"> = [
    "professional",
    "conversational",
    "bold"
]

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomContext(): GenerateContext {
    return {
        angle: pickRandom(ANGLE_POOL),
        readerContext: pickRandom(READER_POOL),
        tonePreset: pickRandom(TONE_POOL),
        emojiOn: Math.random() > 0.5
    }
}

// Get the format for a given URL index (cycles through FORMAT_CYCLE)
function getSeriesFormat(urlIndex: number): LinkedInFormat {
    return FORMAT_CYCLE[urlIndex % FORMAT_CYCLE.length]
}

// Get format name for display
function getFormatDisplayName(format: LinkedInFormat): string {
    const formatMap: Record<LinkedInFormat, string> = {
        "main-post": "MAIN-POST",
        "story-based": "STORY-BASED",
        "short-viral-hook": "SHORT-HOOKS",
        "carousel": "CAROUSEL"
    }
    return formatMap[format]
}

async function runSeriesBatch() {
    console.log(`🧪 Running DYNAMIC SERIES TEST (${URLS.length} URLs)...`)
    console.log(`   Format Cycle: ${FORMAT_CYCLE.map(f => getFormatDisplayName(f)).join(" → ")}`)
    console.log("=".repeat(60))

    let outputBuffer = "\n\n"
    outputBuffer += "=".repeat(60) + "\n"
    outputBuffer += "SERIES VERIFICATION TEST: DYNAMIC FORMAT CYCLING\n"
    outputBuffer += `Timestamp: ${new Date().toISOString()}\n`
    outputBuffer += `Format Cycle: ${FORMAT_CYCLE.join(" → ")}\n`
    outputBuffer += "=".repeat(60) + "\n"

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < URLS.length; i++) {
        const url = URLS[i]
        const format = getSeriesFormat(i)
        const formatDisplay = getFormatDisplayName(format)

        console.log(`\n${"=".repeat(60)}`)
        console.log(`[${i + 1}/${URLS.length}] Processing: ${url}`)
        console.log(`   👉 MODE: ALL ${formatDisplay} (Cycle Position: ${(i % FORMAT_CYCLE.length) + 1}/${FORMAT_CYCLE.length})`)
        console.log("=".repeat(60))

        // All 4 posts in series use the same format
        const postFormats: [LinkedInFormat, LinkedInFormat, LinkedInFormat, LinkedInFormat] = [format, format, format, format]

        outputBuffer += `\n\n${"=".repeat(60)}\n`
        outputBuffer += `SOURCE: ${url}\n`
        outputBuffer += `FORMAT: ${formatDisplay} (ALL 4 POSTS)\n`
        outputBuffer += "=".repeat(60) + "\n"

        try {
            console.log("  ↳ Extracting content...")
            const inputText = await extractTextFromUrl(url)
            const context = getRandomContext()

            console.log(`  ↳ Context: ${context.angle} | ${context.readerContext} | ${context.tonePreset}`)
            outputBuffer += `CONTEXT: Angle="${context.angle}", Reader="${context.readerContext}", Tone="${context.tonePreset}", Emoji=${context.emojiOn}\n`

            const options: SeriesGenerationOptions = {
                inputText,
                context,
                postFormats
            }

            console.log(`  ↳ Generating 4x ${formatDisplay} series...`)
            const posts = await generateSeries(options)

            if (posts.length !== 4) {
                console.warn(`  ⚠️ Warning: Expected 4 posts, got ${posts.length}`)
            }

            console.log("<<<SERIES_START>>>")
            console.log(`SOURCE: ${url}`)
            posts.forEach((post, index) => {
                console.log(`\n--- POST ${index + 1} (${formatDisplay}) ---`)
                console.log(post)

                outputBuffer += `\n--- POST ${index + 1} ---\n`
                outputBuffer += post + "\n"
            })
            console.log("<<<SERIES_END>>>")

            successCount++
            console.log(`      ✅ Series Generated Successfully`)

        } catch (err: any) {
            failCount++
            console.error(`      ❌ Failed: ${err.message}`)
            outputBuffer += `ERROR: ${err.message}\n`
        }
    }

    // Summary
    outputBuffer += `\n\n${"=".repeat(60)}\n`
    outputBuffer += `SUMMARY\n`
    outputBuffer += `${"=".repeat(60)}\n`
    outputBuffer += `Total URLs: ${URLS.length}\n`
    outputBuffer += `Successful Series: ${successCount}\n`
    outputBuffer += `Failed: ${failCount}\n`
    outputBuffer += "=".repeat(60) + "\n"

    const outputPath = path.resolve(process.cwd(), "verification_series.txt")
    fs.appendFileSync(outputPath, outputBuffer)

    console.log(`\n${"=".repeat(60)}`)
    console.log(`✅ Series Verification Complete`)
    console.log(`   Successful Series: ${successCount} | Failed: ${failCount}`)
    console.log(`   Results appended to: ${outputPath}`)
    console.log("=".repeat(60))
}

runSeriesBatch().catch(console.error)

