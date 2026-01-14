"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/firebase/client"
import { onAuthStateChanged, User } from "firebase/auth"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const BLOG_TEXT = `Web development is an in-demand field even in 2025. According to the US Bureau of Labor Statistics, the Employment rate for web developers is expected to increase by 7% from 2024 to 2034. The web is the backbone of modern business, communication, and creativity.

As of 2025, learning to build apps and websites is a smart move for your career. As technologies evolve, the core principles of web development remain the same: structure, style, interactivity, logic, and problem-solving ability. With the right mindset and roadmap, you can go from a complete beginner to an employed or freelance web developer.

Here's how:

Is it too late to learn web development in 2025?
The answer is "No." Many people believe web development is no longer a viable career, but the truth is, it's evolving — not dying. New frameworks, cloud, no-code/low-code actually create more opportunities, not fewer. As one blog puts it, "The web will keep evolving, and you can always build a solid career if you pick the right mindset."

According to the BrainStation guide, Mastering HTML, CSS, and JavaScript is still the first step to learn web development. In other words, the foundation remains the same, but the ecosystem is richer and requires a lifetime of learning.

A Step-by-Step Roadmap

Everyone's learning path is different, but here's a foundational roadmap you can personalize as you grow.

Stage 1: Fundamentals
Start by learning HTML (building blocks of webpages), CSS (styling, layout, responsive design), and JavaScript (interactivity). These are the core foundations of any website. Without these three, you cannot claim to understand the web. At this point, you should be able to build static pages, dig into how browsers work, try small experiments, and perhaps build your own personal website. Once you can build static pages confidently, It's time to make them dynamic and interactive — this is where front-end specialization comes in.

Stage 2: Front-end specialization
Once you are comfortable with the fundamentals, dig deeper into advanced CSS (Flexbox, Grid), responsive design, and then move to a JavaScript framework like React or Vue. According to BrainStation, a front-end developer works on the viewing side of website development — the part that is displayed to users. At this point, you should be working with dynamic web pages or more complex layouts.

Front-end specialization itself is a full career path, but if you want to explore further, go to the next stage. I'd recommend following all stages to truly understand what you enjoy most and where to focus your career.

Stage 3: Back end/ full stack
You can become either a specialized back-end developer or a full-stack developer, depending on your interests. To do so, you must learn server-side development: web servers, APIs, databases, routing, templating, and authentication.

The FreeCodeCamp guide advises building full-stack applications (front-end + back-end + database) to gain real-world experience. Build projects with user accounts, data persistence, admin dashboards, and deployment to a live server.

Stage 4: Advanced topics and professional readiness
At this stage, you'll dive into advanced topics like architecture, optimization, DevOps, security, performance, large code bases, and teamwork. You will also build a strong portfolio, featuring high-quality projects that demonstrate your abilities.

According to a Medium article by James McArthur, your journey doesn't stop at learning code — you must learn how to learn, how to present yourself, build a portfolio, and how to stand out from thousands of applicants.

Focus on professional skills like version control, test-driven development, documentation, collaboration, and communication.

Is starting with WordPress a good idea?
Many newcomers ask, "Is starting with WordPress a good idea?" The answer depends on how you use it. WordPress is a fantastic starting point for beginners — it lets you build real sites fast and even earn your first income. But remember: it's a launchpad, not a destination.

Pros of starting with WordPress:
You get something live quickly, and it looks legitimate.
You'll pick up hosting/domain basics, real user workflows, plugin/theme logic.
It's relevant for clients who just need a presentable website
Many startups hire WordPress developers since it's an affordable and fast option.
Cons (If you're not careful)
If you stay only in templated website work, you may stagnate.
You won't gain deep programming skills or learn to build complex interactive apps.
To qualify for full-stack roles, you'll eventually need to move beyond WordPress.
My recommendation
Use WordPress as a launchpad — especially for your first few months, build 2–3 websites, get familiar with web-hosting workflows, and take on small freelance projects.

But don't stop there. In parallel, start learning the fundamentals (HTML, CSS, JS) and by your third or fourth month, transition into front-end frameworks and backend development. Treat WordPress as one tool in your toolbox, not the whole journey.

Portfolio, freelancing, and career strategy

According to BrainStation, "you'll need a portfolio of completed projects for your job search." Whether you aim to be hired or freelance, your portfolio is your credibility.

Once you've built a few projects, whether custom-coded or WordPress based, start showcasing them and exploring real opportunities. If you plan to freelance, the Upwork guide offers practical steps to help you identify your niche, build your profile, and grow sustainably.

Final Thoughts
Becoming a web developer in 2025 is absolutely worth it and more exciting than ever. Start with fundamentals, explore both front-end and back-end, and don't fear using WordPress as your first stepping stone.

What matters most is progress, consistency, and curiosity. Remember: mistakes are part of the journey. You don't need to know every step in advance. Just start, keep building, and the path will unfold.`

const GENERATED_POSTS = {
  "thought-leadership": {
    content: `Web development isn't dead. It's just misunderstood.

Many believe the field is saturated or dying.
The truth? It's evolving rapidly.

New frameworks and no-code/low-code tools aren't threats.
They create new opportunities for growth.

Learning web development in 2025 is a smart career move.
The core principles remain essential: structure, style, interactivity, logic.

You can absolutely go from beginner to employed developer.
It requires the right mindset and a clear roadmap.

Start with the fundamentals: HTML, CSS, JavaScript.
These are the non-negotiables for understanding the web.

From there, specialize in front-end frameworks like React or Vue.
Or dive into back-end with servers, APIs, and databases.

What about WordPress?
It's an excellent launchpad, especially for quick projects and first income.
But treat it as a tool, not the entire journey.
Use it to learn hosting basics and client workflows.
Then, quickly transition to deeper programming skills.

Your portfolio is your credibility.
Build quality projects, whether custom-coded or WordPress-based initially.
Showcase your abilities.

The journey demands consistency and curiosity.
Mistakes are part of the process.
Just start building, and the path will unfold.

What's your biggest challenge starting in web development today?

#WebDevelopment #CareerAdvice #TechCareers`,
    improvements: [
      "Strong contrarian hook that stops scrollers",
      "Short, punchy sentences optimized for mobile reading",
      "Clear structure: problem → solution → CTA",
      "Engaging question at the end drives comments"
    ]
  },
  "story-based": {
    content: `Everyone told me web development was dead.

"Don't bother," they'd say. "It's too late. The field is saturated."

But I looked closer.

The truth?

Web development isn't dying. It's evolving.

And it's more in-demand than ever.

The US Bureau of Labor Statistics projects a 7% growth for web developers by 2034.

This isn't about chasing trends.

It's about understanding the backbone of modern business.

So, where do you start?

First, master the fundamentals:
HTML for structure.
CSS for style.
JavaScript for interactivity.

These are your non-negotiables.

Once you have that, then explore.

Front-end frameworks like React.
Back-end development with servers and databases.
Becoming a full-stack force.

And what about WordPress?

Many wonder if it's a good starting point.

My take: Use it as a launchpad, not a destination.

Build a few sites, get client experience. Earn your first income.

But simultaneously, commit to deep programming fundamentals.

WordPress teaches you workflows.

HTML, CSS, JS teach you "how the web actually works."

Your journey won't stop at code.

Build a portfolio. Learn to present yourself. Stand out.

The biggest mistake is waiting for perfect clarity.

Just start. Keep building. The path unfolds.

What's one skill you wish you mastered earlier in your web dev journey?

#WebDevelopment #CareerGrowth #TechSkills`,
    improvements: [
      "Personal narrative hook creates emotional connection",
      "Story arc: conflict → discovery → resolution",
      "Relatable &quot;they told me&quot; opening hooks readers",
      "Ends with reflection question for engagement"
    ]
  },
  "educational-carousel": {
    content: `Is it too late to become a web developer in 2025?

Many believe the field is oversaturated or dying.
The truth? It's evolving, not shrinking, creating fresh opportunities.
The US Bureau of Labor Statistics projects a 7% growth for web developers from 2024-2034.
Here is your actionable roadmap to building a successful career in web development now.

1.  Start with the Fundamentals
    HTML, CSS, JavaScript are the bedrock.
    Master these to understand how the web is structured, styled, and made interactive.
    Build static pages and small experiments to solidify your understanding.
    This foundational knowledge is non-negotiable.

2.  Deep Dive into Front-End
    After fundamentals, explore advanced CSS like Flexbox and Grid.
    Master responsive design to make sites look great on any device.
    Then, pick a JavaScript framework such as React or Vue.
    This enables you to create dynamic, interactive user experiences.

3.  Conquer the Back-End (or Full Stack)
    Ready for more? Learn server-side development.
    Dive into web servers, APIs, databases, and user authentication.
    Build full-stack applications with user accounts and data persistence.
    This connects what users "see" with how your application "works."

4.  Professional Readiness and Advanced Topics
    Move beyond basic coding: explore architecture, optimization, and security.
    Focus on professional skills like version control, testing, and clear documentation.
    Build a strong portfolio showcasing high-quality projects.
    "Learning to learn" is crucial for long-term success in this ever-changing field.

5.  The "WordPress" Question
    WordPress is a great "launchpad," not a final destination.
    It helps you build live sites quickly and understand hosting basics.
    Use it to secure your first projects and initial income.
    However, don't stop there; integrate it into a broader learning path.

6.  Build Your Portfolio and Strategy
    Your portfolio is your credibility in the tech world.
    Showcase all your projects, whether custom-coded or WordPress-based.
    Identify your niche, optimize your profile, and actively explore opportunities.
    Consistency, curiosity, and a willingness to grow are your greatest assets.

What's one web development project you're excited to build first?

#WebDevelopment #CareerDevelopment #TechCareer`,
    improvements: [
      "Perfect for carousel format (6 slides)",
      "Numbered structure makes it scannable",
      "Each point is actionable and specific",
      "Great for saving and sharing"
    ]
  },
  "short-viral-hook": {
    content: `Is web development dead in 2025?

Many think so. But it's actually projected to grow 7% by 2034. The real secret? Master HTML, CSS, and JavaScript fundamentals. Even "WordPress" can be a smart launchpad.

What's your biggest misconception about the tech job market today?

#WebDevelopment #CareerGrowth #TechJobs`,
    improvements: [
      "Ultra-short format (312 chars) gets maximum reach",
      "Contrarian hook creates instant curiosity",
      "Quick, digestible insight perfect for busy feeds",
      "Question drives comments and shares"
    ]
  }
}

export default function LandingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [navLoading, setNavLoading] = useState<null | "login" | "signup">(null)

  const handleScrollToPricing = () => {
    if (typeof window === "undefined") return
    const el = document.getElementById("pricing")
    if (!el) return
    const navbarOffset = 72 // approximate sticky navbar height
    const rect = el.getBoundingClientRect()
    const targetY = rect.top + window.scrollY - navbarOffset

    window.scrollTo({ top: targetY, behavior: "smooth" })
  }
  const [animationState, setAnimationState] = useState<'idle' | 'step1' | 'step2' | 'step3' | 'complete'>('idle')
  const [typingText, setTypingText] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  const stepsRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([])
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    // Check auth state
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  // Realistic simulation animation - loops continuously
  useEffect(() => {
    const runAnimation = () => {
      // Clear any existing intervals before starting new animation
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
        typingIntervalRef.current = null
      }
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current)
        processingIntervalRef.current = null
      }

      // Reset state
      setAnimationState('step1')
      setTypingText('')
      setProcessingProgress(0)

      // Step 1: Show URL typing animation
      const urlToType = 'https://example.com/blog-post'
      let charIndex = 0

      typingIntervalRef.current = setInterval(() => {
        if (charIndex < urlToType.length) {
          setTypingText(urlToType.slice(0, charIndex + 1))
          charIndex++
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current)
            typingIntervalRef.current = null
          }
          // Move to step 2 after typing completes
          const timeout1 = setTimeout(() => {
            setAnimationState('step2')
            setTypingText('')

            // Simulate AI processing with progress
            let progress = 0
            processingIntervalRef.current = setInterval(() => {
              progress += 2
              setProcessingProgress(progress)
              if (progress >= 100) {
                if (processingIntervalRef.current) {
                  clearInterval(processingIntervalRef.current)
                  processingIntervalRef.current = null
                }
                // Move to step 3
                const timeout2 = setTimeout(() => {
                  setAnimationState('step3')
                  setProcessingProgress(0)
                  // Step 3 completes quickly
                  const timeout3 = setTimeout(() => {
                    setAnimationState('complete')
                    // Wait 5 seconds then restart if still visible
                    const timeout4 = setTimeout(() => {
                      if (isVisibleRef.current) {
                        runAnimation()
                      }
                    }, 5000)
                    animationTimeoutRef.current.push(timeout4)
                  }, 800)
                  animationTimeoutRef.current.push(timeout3)
                }, 300)
                animationTimeoutRef.current.push(timeout2)
              }
            }, 50)
          }, 500)
          animationTimeoutRef.current.push(timeout1)
        }
      }, 80)
    }

    let hasStarted = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisibleRef.current = true
            if (!hasStarted) {
              hasStarted = true
              runAnimation()
            }
          } else {
            isVisibleRef.current = false
            // Reset when leaving viewport so it can restart when coming back
            hasStarted = false
            // Clear intervals when leaving viewport
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current)
              typingIntervalRef.current = null
            }
            if (processingIntervalRef.current) {
              clearInterval(processingIntervalRef.current)
              processingIntervalRef.current = null
            }
          }
        })
      },
      { threshold: 0.2 }
    )

    const currentElement = stepsRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      // Cleanup: clear all intervals and timeouts
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current)
        typingIntervalRef.current = null
      }
      if (processingIntervalRef.current) {
        clearInterval(processingIntervalRef.current)
        processingIntervalRef.current = null
      }
      animationTimeoutRef.current.forEach(timeout => clearTimeout(timeout))
      animationTimeoutRef.current = []
      // Keep observer active during component lifetime - only disconnect on unmount
      // This allows animation to restart when scrolling back into view
      observer.disconnect()
    }
  }, [])

  return (
    <main
      className={`min-h-screen bg-slate-50 text-slate-900 transition-opacity duration-200 ${navLoading ? "opacity-60" : "opacity-100"
        }`}
    >

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/hookoryLogo.png"
              alt="Hookory"
              width={32}
              height={32}
              className="h-8 w-8 object-contain transition-transform group-hover:-translate-y-0.5"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Hookory
              </span>
              <span className="text-[11px] text-slate-400">
                LinkedIn Repurposer
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={handleScrollToPricing}
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Pricing
            </button>
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
            ) : user ? (
              <Button size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-1">
                  Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setNavLoading("login")
                    router.push("/login")
                  }}
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  {navLoading === "login" ? "Loading..." : "Log in"}
                </button>
                <Button
                  size="sm"
                  onClick={() => {
                    setNavLoading("signup")
                    router.push("/signup")
                  }}
                  className="flex items-center gap-1"
                >
                  {navLoading === "signup" ? (
                    <span className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      Try free
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto pb-16 md:pb-24">
        {/* Hero */}
        <section className="bg-white pt-8 pb-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Built for LinkedIn-first creators · Free plan included
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Turn one idea into{" "}
                <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500 bg-clip-text text-transparent">
                  four scroll-stopping
                </span>{" "}
                LinkedIn posts.
              </h1>
              <p className="max-w-xl text-base text-slate-600 sm:text-lg">
                Paste a blog, thread, or doc and get multiple LinkedIn-ready
                versions with strong hooks, clean structure, and clear CTAs —
                in under 30 seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {user ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/signup" className="flex items-center gap-2">
                      Try free (5 repurposes)
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="flex flex-col text-xs text-slate-500">
                    <span>No credit card required</span>
                    <span>Google login · Email login · Cancel anytime</span>
                  </div>
                </>
              )}
            </div>

            <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
                <span className="h-6 w-6 rounded-full bg-indigo-50 text-center text-[11px] font-semibold leading-6 text-indigo-600">
                  TL
                </span>
                <div>
                  <p className="font-medium text-slate-800">
                    Thought leadership, done
                  </p>
                  <p>Hook-first posts, not fluffy AI essays.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
                <span className="h-6 w-6 rounded-full bg-indigo-50 text-center text-[11px] font-semibold leading-6 text-indigo-600">
                  🎯
                </span>
                <div>
                  <p className="font-medium text-slate-800">
                    Creator-first controls
                  </p>
                  <p>Audience, goal, tone &amp; emojis in one place.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm transition-transform duration-150 hover:-translate-y-0.5">
                <span className="h-6 w-6 rounded-full bg-indigo-50 text-center text-[11px] font-semibold leading-6 text-indigo-600">
                  ✓
                </span>
                <div>
                  <p className="font-medium text-slate-800">
                    Clear free vs creator
                  </p>
                  <p>5 free / 100 creator · No dark patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Before / After section - Full width, stacked */}
        <section className="mt-20 py-16 bg-gradient-to-b from-slate-50 to-white px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-6 lg:px-0">
            {/* Section Headline */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                See the Difference:{" "}
                <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-sky-500 bg-clip-text text-transparent">
                  From Blog to LinkedIn Gold
                </span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                Watch how we transform a 2,800-word blog post into four scroll-stopping LinkedIn formats, each optimized for maximum engagement.
              </p>
            </div>

            {/* Before Card */}
            <Card className="border-slate-200 bg-white/90 shadow-sm transition-transform duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Before · 2,800-word blog post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-600 max-h-[300px] overflow-y-auto">
                  <p className="whitespace-pre-wrap leading-relaxed">{BLOG_TEXT}</p>
                  <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                    {BLOG_TEXT.length} characters · No hook · No structure · Not LinkedIn-ready
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* After Header */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900">After using Hookory · 4 formats generated</h3>
              <p className="text-sm text-slate-500 mt-2">Each format optimized for different engagement goals</p>
            </div>

            {/* Format 1: Thought Leadership */}
            <Card className="border border-indigo-200 bg-white shadow-md transition-transform duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  Format 1: Thought Leadership
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 border border-indigo-100">
                    Generated
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-indigo-100 bg-indigo-50/30 px-3 py-2 text-[12px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                  {GENERATED_POSTS["thought-leadership"].content}
                </div>
                <div className="space-y-1.5 pt-2 border-t border-indigo-100">
                  <p className="text-[10px] font-semibold text-indigo-700">Why this works:</p>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    {GENERATED_POSTS["thought-leadership"].improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 mt-0.5">✓</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Format 2: Story-Based */}
            <Card className="border border-purple-200 bg-white shadow-md transition-transform duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-purple-700">
                  Format 2: Story-Based
                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 border border-purple-100">
                    Generated
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-purple-100 bg-purple-50/30 px-3 py-2 text-[12px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                  {GENERATED_POSTS["story-based"].content}
                </div>
                <div className="space-y-1.5 pt-2 border-t border-purple-100">
                  <p className="text-[10px] font-semibold text-purple-700">Why this works:</p>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    {GENERATED_POSTS["story-based"].improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-500 mt-0.5">✓</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Format 3: Educational Carousel */}
            <Card className="border border-emerald-200 bg-white shadow-md transition-transform duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Format 3: Educational Carousel
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-100">
                    Generated
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-emerald-100 bg-emerald-50/30 px-3 py-2 text-[12px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                  {GENERATED_POSTS["educational-carousel"].content}
                </div>
                <div className="space-y-1.5 pt-2 border-t border-emerald-100">
                  <p className="text-[10px] font-semibold text-emerald-700">Why this works:</p>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    {GENERATED_POSTS["educational-carousel"].improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Format 4: Short Viral Hook */}
            <Card className="border border-orange-200 bg-white shadow-md transition-transform duration-200 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-orange-700">
                  Format 4: Short Viral Hook
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700 border border-orange-100">
                    Generated
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-md border border-orange-100 bg-orange-50/30 px-3 py-2 text-[12px] text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {GENERATED_POSTS["short-viral-hook"].content}
                </div>
                <div className="space-y-1.5 pt-2 border-t border-orange-100">
                  <p className="text-[10px] font-semibold text-orange-700">Why this works:</p>
                  <ul className="space-y-1 text-[10px] text-slate-600">
                    {GENERATED_POSTS["short-viral-hook"].improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Hookline - Bold conversion moment */}
        <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border-y-4 border-orange-200">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-0 text-center">
            <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-orange-300">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                Why pay{" "}
                <span className="text-slate-500 line-through decoration-2 decoration-red-500">$20-50/month</span>{" "}
                on other tools with less quality?
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-3 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                We deliver REAL VALUE only at{" "}
                <span className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                  $9.99/month!
                </span>
              </p>
              <p className="text-sm sm:text-base text-slate-700 mt-4 font-medium">
                Better quality. Better features. Still 70% cheaper.
              </p>
              {!user && (
                <div className="mt-6">
                  <Button size="lg" asChild className="shadow-lg">
                    <Link href="/signup" className="flex items-center gap-2">
                      Start saving today
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 md:px-6 lg:px-8 bg-white" ref={stepsRef}>
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">How Hookory Works</h2>
              <p className="text-slate-600 mt-2">From long-form to LinkedIn-ready in 30 seconds</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line (Desktop only) - Progressive drawing */}
              <div className="hidden md:block absolute top-12 left-[20%] h-0.5 -z-10 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-orange-200 via-indigo-200 to-emerald-200 transition-all duration-1000 ease-out ${animationState === 'step2' || animationState === 'step3' || animationState === 'complete'
                    ? 'w-[60%]'
                    : 'w-0'
                    }`}
                />
              </div>

              {/* Step 1 - URL Input Simulation */}
              <div
                className={`relative flex flex-col items-center text-center bg-white p-6 rounded-lg border transition-all duration-500 ${animationState !== 'idle'
                  ? 'opacity-100 translate-y-0 scale-100 border-orange-200 shadow-md'
                  : 'opacity-0 translate-y-8 scale-95 border-slate-100 shadow-sm'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl border-4 border-white shadow-sm transition-all duration-500 ${animationState !== 'idle'
                  ? 'bg-orange-100 text-orange-600 scale-100'
                  : 'bg-slate-100 text-slate-400 scale-0'
                  }`}>
                  1
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">Paste URL</h3>
                {/* URL Input Simulation */}
                <div className="w-full mt-3 mb-2 px-3 py-2 bg-slate-50 rounded-md border border-slate-200 text-left min-h-[2.5rem]">
                  {animationState === 'step1' && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-600 font-mono">{typingText}</span>
                      <span className="animate-pulse text-orange-500">|</span>
                    </div>
                  )}
                  {animationState === 'step2' || animationState === 'step3' || animationState === 'complete' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-slate-500">URL processed</span>
                    </div>
                  ) : animationState === 'idle' ? (
                    <span className="text-xs text-slate-400">Waiting...</span>
                  ) : null}
                </div>
                <p className="text-sm text-slate-500">Drop in a link to your blog, newsletter, or YouTube video transcript.</p>
              </div>

              {/* Step 2 - AI Processing Simulation */}
              <div
                className={`relative flex flex-col items-center text-center bg-white p-6 rounded-lg border transition-all duration-500 ${animationState === 'step2' || animationState === 'step3' || animationState === 'complete'
                  ? 'opacity-100 translate-y-0 scale-100 border-indigo-200 shadow-md'
                  : 'opacity-0 translate-y-8 scale-95 border-slate-100 shadow-sm'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl border-4 border-white shadow-sm transition-all duration-500 relative ${animationState === 'step2' || animationState === 'step3' || animationState === 'complete'
                  ? 'bg-indigo-100 text-indigo-600 scale-100'
                  : 'bg-slate-100 text-slate-400 scale-0'
                  }`}>
                  2
                  {/* Pulsing ring during processing */}
                  {animationState === 'step2' && (
                    <span className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-75" />
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">AI Analyzes</h3>
                {/* Processing Animation */}
                {animationState === 'step2' && (
                  <div className="w-full mt-3 mb-2 space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-indigo-600 font-medium animate-pulse">
                      Analyzing content... {processingProgress}%
                    </p>
                  </div>
                )}
                {animationState === 'step3' || animationState === 'complete' ? (
                  <div className="w-full mt-3 mb-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium">Analysis complete</span>
                    </div>
                  </div>
                ) : null}
                <p className="text-sm text-slate-500">AI extracts the &quot;Golden Nuggets&quot; and removes the fluff.</p>
              </div>

              {/* Step 3 - Results Generation */}
              <div
                className={`relative flex flex-col items-center text-center bg-white p-6 rounded-lg border transition-all duration-500 ${animationState === 'step3' || animationState === 'complete'
                  ? 'opacity-100 translate-y-0 scale-100 border-emerald-200 shadow-md'
                  : 'opacity-0 translate-y-8 scale-95 border-slate-100 shadow-sm'
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl border-4 border-white shadow-sm transition-all duration-500 ${animationState === 'step3' || animationState === 'complete'
                  ? 'bg-emerald-100 text-emerald-600 scale-100'
                  : 'bg-slate-100 text-slate-400 scale-0'
                  }`}>
                  3
                </div>
                <h3 className="font-semibold text-lg mb-2 text-slate-900">You Publish</h3>
                {/* Results Preview */}
                {animationState === 'step3' && (
                  <div className="w-full mt-3 mb-2 space-y-1.5 animate-pulse">
                    <div className="h-2 bg-emerald-100 rounded w-full" />
                    <div className="h-2 bg-emerald-100 rounded w-5/6 mx-auto" />
                    <div className="h-2 bg-emerald-100 rounded w-4/6 mx-auto" />
                  </div>
                )}
                {animationState === 'complete' && (
                  <div className="w-full mt-3 mb-2 space-y-1.5">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium">4 formats ready</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                      <div className="px-2 py-1 bg-emerald-50 rounded">Carousel</div>
                      <div className="px-2 py-1 bg-emerald-50 rounded">Story</div>
                      <div className="px-2 py-1 bg-emerald-50 rounded">Hook</div>
                      <div className="px-2 py-1 bg-emerald-50 rounded">Thought Leader</div>
                    </div>
                  </div>
                )}
                <p className="text-sm text-slate-500">Get 4 viral-ready formats (Carousel, Story, Hook, Thought Leader).</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why this is different */}
        <section className="mt-20 py-16 px-4 md:px-6 lg:px-8 space-y-6 bg-gradient-to-b from-white to-indigo-50/30">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Why this is different
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Not a generic AI writer. Hookory is tuned for LinkedIn readers,
                hooks, and human-sounding posts you can paste directly.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-200 bg-white shadow-sm transition-transform duration-150 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600">
                    1
                  </span>
                  LinkedIn-first
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                Not a “write anything” tool. Prompts and output are designed for
                feeds, skimmability, and LinkedIn’s rhythm.
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm transition-transform duration-150 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600">
                    2
                  </span>
                  Crafted, not robotic
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                Outputs are structured as clean posts: strong open, body with
                flow, and a specific CTA — not just “more text.”
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm transition-transform duration-150 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-900">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600">
                    3
                  </span>
                  Ready to post
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600">
                Formatting, line breaks, and hooks are handled for you — just
                tweak details, paste, and publish.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mt-16 py-12 px-4 md:px-6 lg:px-8 space-y-3 bg-indigo-50/30">
          <h2 className="text-xl font-semibold text-slate-900">Who it&apos;s for</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Creators building personal brands on LinkedIn</li>
            <li>Freelancers &amp; consultants who post to get clients</li>
            <li>Founders sharing ideas and building in public</li>
          </ul>
        </section>

        {/* Social Proof Substitute */}
        <section className="mt-20 py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/30 to-slate-50 border-y border-slate-200">
          <div className="container mx-auto text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
              Built for the modern creator economy
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                <p className="text-slate-700 italic text-sm">
                  &quot;I write great newsletters but my LinkedIn is dead. I need a way to distribute content without rewriting it.&quot;
                </p>
                <p className="mt-4 text-xs font-bold text-indigo-600">
                  — The Newsletter Writer
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                <p className="text-slate-700 italic text-sm">
                  &quot;I spend 2 hours writing a blog post. I don&apos;t have another hour to figure out a LinkedIn hook.&quot;
                </p>
                <p className="mt-4 text-xs font-bold text-indigo-600">
                  — The Solopreneur
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-100 shadow-sm">
                <p className="text-slate-700 italic text-sm">
                  &quot;My team builds great features but we suck at marketing them. We need consistent updates.&quot;
                </p>
                <p className="mt-4 text-xs font-bold text-indigo-600">
                  — The SaaS Founder
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mt-20 py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Pricing that grows with your LinkedIn
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Start free, upgrade when the platform starts driving pipeline.
          </p>
          <p className="mt-3 text-center text-xs font-medium text-orange-600">
            Better quality than $20-50/month tools — all for just $9.99/month
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="border-slate-200 bg-white shadow-sm transition-transform duration-150 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span className="text-slate-900">Free</span>
                  <span className="text-sm font-normal text-slate-500">
                    For testing the waters
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p className="text-2xl font-semibold text-slate-900">
                  $0{" "}
                  <span className="text-xs font-normal text-slate-500">
                    / month
                  </span>
                </p>
                <ul className="space-y-1.5">
                  <li>• 5 repurposes / month</li>
                  <li>• All four LinkedIn formats</li>
                  <li>• No history, no regenerate</li>
                  <li>• Paste text input only</li>
                </ul>
                <Button variant="outline" className="mt-2 w-full" asChild>
                  <Link href="/signup">Get started free</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-orange-300 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-md transition-transform duration-150 hover:-translate-y-1.5">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span className="text-slate-900">Creator</span>
                  <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-700">
                    Recommended
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-orange-900">
                <p className="text-2xl font-semibold text-slate-900">
                  $9.99{" "}
                  <span className="text-xs font-normal text-orange-700/80">
                    / month
                  </span>
                </p>
                <ul className="space-y-1.5">
                  <li>• 100 repurposes / month</li>
                  <li>• Full history &amp; one-click regenerate</li>
                  <li>• URL input (Medium, Notion, Google Docs)</li>
                  <li>• Custom tone presets &amp; emoji control</li>
                </ul>
                <Button className="mt-2 w-full" asChild>
                  <Link href="/signup">Upgrade my LinkedIn</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section >

        {/* Footer */}
        < footer className="mt-16 border-t border-slate-200 pt-6 px-4 md:px-6 lg:px-8 text-xs text-slate-500" >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Hookory. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-slate-700">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-slate-700">
                Privacy
              </Link>
            </div>
          </div>
        </footer >
      </div >
    </main >
  )
}

