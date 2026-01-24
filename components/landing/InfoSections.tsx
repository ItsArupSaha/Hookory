"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Linkedin, Layers, Rocket } from "lucide-react"

export function WhyDifferentSection() {
    return (
        <section className="pt-10 pb-20 md:pt-14 md:pb-28 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-stone-50 to-stone-100">
            <div className="max-w-6xl mx-auto">
                {/* Section intro */}
                <div className="text-center mb-14 md:mb-20">
                    {/* Badge */}
                    <p className="inline-flex items-center gap-2 rounded-full bg-stone-100 border border-stone-200 px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Built for how LinkedIn actually works
                    </p>

                    {/* Main heading */}
                    <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">
                        Writing well isn&apos;t the hard part.<br />
                        <span className="text-emerald-600">Writing for the feed is.</span>
                    </h2>

                    {/* Subheading */}
                    <p className="mt-5 text-base md:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        LinkedIn isn&apos;t a blog. It&apos;s not email. It&apos;s a fast-scrolling feed where structure, hooks, and pacing decide whether anyone stops to read.
                    </p>
                </div>

                {/* Three cards */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {/* Card 1: LinkedIn-first thinking */}
                    <div className="group relative flex flex-col bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-cyan-100 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100/50 rounded-full blur-2xl -z-10 group-hover:bg-cyan-200/50 transition-colors" />

                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-600">
                                <Linkedin className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-stone-900">
                                LinkedIn-first thinking
                            </h3>
                        </div>

                        <ul className="space-y-3 text-stone-600 text-[15px] mb-6">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                <span>Blog structure doesn&apos;t translate to scrolling feeds</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                <span>Email tone feels off in a professional network</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                <span>Hooks, line breaks, and pacing define readability</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                                <span>LinkedIn rewards clarity, not cleverness</span>
                            </li>
                        </ul>

                        <div className="mt-auto pt-4 border-t border-cyan-100">
                            <p className="text-cyan-700 font-medium text-sm">
                                → Being LinkedIn-first changes outcomes
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Crafted, not copy-pasted */}
                    <div className="group relative flex flex-col bg-gradient-to-br from-fuchsia-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-fuchsia-100 hover:shadow-xl hover:border-fuchsia-200 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-100/50 rounded-full blur-2xl -z-10 group-hover:bg-fuchsia-200/50 transition-colors" />

                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 rounded-xl bg-fuchsia-100 text-fuchsia-600">
                                <Layers className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-stone-900">
                                Crafted, not copy-pasted
                            </h3>
                        </div>

                        <ul className="space-y-3 text-stone-600 text-[15px] mb-6">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 mt-2 shrink-0" />
                                <span>One template repeated looks like one template repeated</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 mt-2 shrink-0" />
                                <span>Posts need internal flow, tension, and payoff</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 mt-2 shrink-0" />
                                <span>Editing should feel like refinement, not starting over</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 mt-2 shrink-0" />
                                <span>Readers notice when something was actually written</span>
                            </li>
                        </ul>

                        <div className="mt-auto pt-4 border-t border-fuchsia-100">
                            <p className="text-fuchsia-700 font-medium text-sm">
                                → Structure makes posts feel intentional
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Ready to post, not start from scratch */}
                    <div className="group relative flex flex-col bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100/50 rounded-full blur-2xl -z-10 group-hover:bg-orange-200/50 transition-colors" />

                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                                <Rocket className="h-5 w-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-stone-900">
                                Ready to post, not start from scratch
                            </h3>
                        </div>

                        <ul className="space-y-3 text-stone-600 text-[15px] mb-6">
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                <span>An empty text box kills momentum</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                <span>Iteration matters more than perfection</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                <span>&quot;Almost ready&quot; is still friction</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                <span>Posting consistently beats waiting for perfect</span>
                            </li>
                        </ul>

                        <div className="mt-auto pt-4 border-t border-orange-100">
                            <p className="text-orange-700 font-medium text-sm">
                                → Momentum beats motivation
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function WhoItsForSection() {
    return (
        <section className="pt-10 pb-20 md:pt-14 md:pb-28 px-4 md:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Section intro */}
                <div className="text-center mb-14 md:mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold text-stone-900">
                        Not for everyone. <span className="text-emerald-600">On purpose.</span>
                    </h2>
                    <p className="mt-5 text-base md:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        This is for people who already create real value — blogs, case studies, insights — and need LinkedIn to finally reflect that work without starting from scratch every time.
                    </p>
                </div>

                {/* Three cards */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-3">
                    {/* Card 1: Creators & Educators */}
                    <div className="group relative flex flex-col bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-emerald-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-full blur-2xl -z-10 group-hover:bg-emerald-200/50 transition-colors" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-3">
                            Creators & Educators
                        </p>

                        <h3 className="text-lg font-semibold text-stone-900 mb-4">
                            You already publish. LinkedIn should reflect that.
                        </h3>

                        <p className="text-stone-600 text-[15px] leading-relaxed mb-6">
                            Your blogs, newsletters, and videos are doing the hard work of building ideas. The missing piece is translating that depth into something LinkedIn readers actually stop for. You want trust and authority — not noise.
                        </p>

                        <div className="mt-auto pt-4 border-t border-emerald-100">
                            <p className="text-emerald-700 font-medium text-sm">
                                → Turn depth into daily presence
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Freelancers & Consultants */}
                    <div className="group relative flex flex-col bg-gradient-to-br from-amber-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-amber-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-full blur-2xl -z-10 group-hover:bg-amber-200/50 transition-colors" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 mb-3">
                            Freelancers & Consultants
                        </p>

                        <h3 className="text-lg font-semibold text-stone-900 mb-4">
                            LinkedIn is your lead channel. Treat it like one.
                        </h3>

                        <p className="text-stone-600 text-[15px] leading-relaxed mb-6">
                            You have client work, frameworks, and insights worth sharing — but sporadic posting doesn&apos;t drive pipeline. Consistency builds inbound. The goal isn&apos;t viral moments; it&apos;s conversations that start in the DMs.
                        </p>

                        <div className="mt-auto pt-4 border-t border-amber-100">
                            <p className="text-amber-700 font-medium text-sm">
                                → Consistency over virality
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Founders & Small Teams */}
                    <div className="group relative flex flex-col bg-gradient-to-br from-sky-50 to-white rounded-2xl p-6 md:p-8 shadow-lg border border-sky-100 hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/50 rounded-full blur-2xl -z-10 group-hover:bg-sky-200/50 transition-colors" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 mb-3">
                            Founders & Small Teams
                        </p>

                        <h3 className="text-lg font-semibold text-stone-900 mb-4">
                            You&apos;re building. Let the market see that.
                        </h3>

                        <p className="text-stone-600 text-[15px] leading-relaxed mb-6">
                            Your progress already exists — in docs, changelogs, and internal notes. The problem is nobody outside sees it. LinkedIn is where visibility compounds. You don&apos;t need more content; you need what you&apos;re already doing to show up.
                        </p>

                        <div className="mt-auto pt-4 border-t border-sky-100">
                            <p className="text-sky-700 font-medium text-sm">
                                → Make progress visible
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
