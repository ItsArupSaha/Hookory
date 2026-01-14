"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/firebase/client"
import { BLOG_TEXT, GENERATED_POSTS } from "@/lib/landing-examples"
import { onAuthStateChanged, User } from "firebase/auth"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

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
        <section className="mt-0 py-16 px-4 md:px-6 lg:px-8 space-y-8 bg-gradient-to-b from-white via-indigo-50/40 to-slate-50">
          <div className="text-center max-w-3xl mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Purpose-built for LinkedIn
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Why this is different
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Hookory doesn&apos;t try to write everything. It specializes in turning long-form content
              into posts that actually get read, saved, and replied to on LinkedIn.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Card className="border-2 border-indigo-300 bg-white/80 backdrop-blur-sm shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-sm text-slate-900">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-600">
                    1
                  </span>
                  LinkedIn-first engine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs text-slate-600">
                <p>
                  Prompts, formatting, and structure are all tuned for LinkedIn&apos;s fast-scrolling feed —
                  not blogs, emails, or generic &quot;social posts.&quot;
                </p>
                <p>
                  Hooks, line breaks, and punchy sentences are baked in so your posts don&apos;t read like
                  AI essays.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-300 bg-white/80 backdrop-blur-sm shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-sm text-slate-900">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-[11px] font-semibold text-purple-600">
                    2
                  </span>
                  Crafted, not copy-pasted
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs text-slate-600">
                <p>
                  Each format has its own structure (story, carousel, hook-first, thought leadership) so
                  you don&apos;t get one bland template repeated four times.
                </p>
                <p>
                  Posts are organized into clear sections with flow, tension, and payoff — ready to tweak,
                  not rewrite.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-300 bg-white/80 backdrop-blur-sm shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-sm text-slate-900">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-600">
                    3
                  </span>
                  Ready to post in minutes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-xs text-slate-600">
                <p>
                  You paste a link or blog, Hookory returns 4 LinkedIn-ready drafts — with hooks, body,
                  and CTA already in place.
                </p>
                <p>
                  Edit a few lines to add your voice, then paste into LinkedIn. No wrestling with empty
                  text boxes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Who it's for */}
        <section className="mt-12 py-12 px-4 md:px-6 lg:px-8 bg-indigo-50/40">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-slate-900">Who it&apos;s for</h2>
            <p className="mt-2 text-sm text-slate-600">
              Hookory is for people who already create value — blogs, newsletters, case studies,
              release notes — and want LinkedIn to finally reflect that work.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="rounded-lg bg-white/80 p-4 shadow-sm border-2 border-indigo-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                1 · Creators &amp; educators
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900 text-center">
                You publish long-form content already.
              </p>
              <p className="mt-1.5 text-xs text-slate-600 text-center">
                Turn deep-dive blogs, newsletters, or YouTube scripts into daily posts that build trust,
                not just impressions.
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-sm border-2 border-purple-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                2 · Freelancers &amp; consultants
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900 text-center">
                You want leads, not just likes.
              </p>
              <p className="mt-1.5 text-xs text-slate-600 text-center">
                Repurpose client work, case studies, and how-to articles into consistent LinkedIn
                content that brings in inbound DMs.
              </p>
            </div>
            <div className="rounded-lg bg-white/80 p-4 shadow-sm border-2 border-orange-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-center">
                3 · Founders &amp; small teams
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900 text-center">
                You&apos;re busy shipping product.
              </p>
              <p className="mt-1.5 text-xs text-slate-600 text-center">
                Turn changelogs, docs, and internal memos into simple LinkedIn updates so your market
                actually sees what you&apos;re building.
              </p>
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

