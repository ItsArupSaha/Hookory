import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-xl bg-indigo-600 text-center text-sm font-bold leading-8 text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
              H
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Hookline.io
              </span>
              <span className="text-[11px] text-slate-400">
                LinkedIn Repurposer
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              Log in
            </Link>
            <Button size="sm" asChild>
              <Link href="/signup" className="flex items-center gap-1">
                Try free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-16 pt-10 md:pb-24 md:pt-14">
        {/* Hero */}
        <section className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
          <div className="space-y-7">
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
              <Button size="lg" asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  Try free (5 repurposes)
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 underline-offset-2 hover:underline"
              >
                See example
              </button>
              <div className="flex flex-col text-xs text-slate-500">
                <span>No credit card required</span>
                <span>Google login · Email login · Cancel anytime</span>
              </div>
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

          {/* Before / After card stack – example-driven */}
          <div className="relative">
            <div className="absolute -top-6 right-6 hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 shadow-sm sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live usage limits &amp; billing built-in
            </div>

            <div className="relative mx-auto max-w-md space-y-4">
              <Card className="border-slate-200 bg-white/90 shadow-sm transition-transform duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Before · Wall-of-text post
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-500">
                    <p>
                      “In today&apos;s rapidly evolving landscape, companies that
                      fail to adapt to the changing environment of digital
                      transformation will find themselves quickly left behind…”
                    </p>
                    <p className="text-[11px] text-slate-400">
                      1 big paragraph · Weak hook · No clear CTA
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-indigo-200 bg-white shadow-md transition-transform duration-200 hover:-translate-y-1.5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-indigo-700">
                    After using Hookline.io
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 border border-indigo-100">
                      Generated
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-[13px] text-slate-800">
                  <p>
                    Most “digital transformations” fail — not because of the
                    tech, but because of denial.
                  </p>
                  <p>
                    The market moved. Buyers changed. But leadership kept
                    optimising the old playbook:
                  </p>
                  <ul className="list-disc pl-5 text-[13px]">
                    <li>Reporting vanity metrics to feel “on track”</li>
                    <li>Shipping tools without a behaviour change plan</li>
                    <li>Expecting sales to fix a broken narrative</li>
                  </ul>
                  <p className="text-slate-700">
                    If you&apos;re leading transformation this year, here&apos;s the
                    simple cadence I use with teams that actually ship it 👇
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why this is different */}
        <section className="mt-20 space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Why this is different
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Not a generic AI writer. Hookline is tuned for LinkedIn readers,
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
        <section className="mt-16 space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Who it’s for</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Creators building personal brands on LinkedIn</li>
            <li>Freelancers &amp; consultants who post to get clients</li>
            <li>Founders sharing ideas and building in public</li>
          </ul>
        </section>

        {/* Pricing */}
        <section className="mt-20">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Pricing that grows with your LinkedIn
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Start free, upgrade when the platform starts driving pipeline.
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
                  $15{" "}
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
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Hookline.io. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-slate-700">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-slate-700">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

