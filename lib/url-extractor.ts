import { JSDOM } from "jsdom"

const MAX_EXTRACTED_LENGTH = 10000

export async function extractTextFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Remove script and style elements
    const scripts = document.querySelectorAll("script, style, noscript")
    scripts.forEach((el) => el.remove())

    // Try to find main content
    let text = ""
    
    // Try common content selectors
    const contentSelectors = [
      "article",
      "[role='article']",
      ".post-content",
      ".article-content",
      ".content",
      "main",
      ".main-content",
    ]

    let contentElement: Element | null = null
    for (const selector of contentSelectors) {
      contentElement = document.querySelector(selector)
      if (contentElement) break
    }

    if (contentElement) {
      text = contentElement.textContent || ""
    } else {
      // Fallback: get body text
      text = document.body?.textContent || ""
    }

    // Clean up text
    text = text
      .replace(/\s+/g, " ") // Normalize whitespace
      .replace(/\n\s*\n/g, "\n\n") // Normalize line breaks
      .trim()

    // Truncate if too long
    if (text.length > MAX_EXTRACTED_LENGTH) {
      text = text.substring(0, MAX_EXTRACTED_LENGTH) + "..."
    }

    if (text.length < 100) {
      throw new Error("Extracted text too short - may not be valid content")
    }

    return text
  } catch (error: any) {
    console.error("URL extraction error:", error)
    throw new Error(`Failed to extract content from URL: ${error.message}`)
  }
}
