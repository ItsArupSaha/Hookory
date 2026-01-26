"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useSeries } from "@/hooks/use-series"
import { Loader2, Sparkles, Lock } from "lucide-react"
import { ToneType, FormatKey, READER_CONTEXT_OPTIONS } from "./types"
import { LinkedInPostPreview } from "../features/linkedin-post-preview"
import { UsageLimitBanner } from "./UsageLimitBanner"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const SERIES_STEPS = [
    { label: "Post 1: Context / Problem", desc: "Set the stage. Why this matters." },
    { label: "Post 2: Mistake / Tension", desc: "Create friction. What people get wrong." },
    { label: "Post 3: Solution / System", desc: "Teach the fix. How to solve it." },
    { label: "Post 4: Outcome / Takeaway", desc: "The result & authority. Future state." },
]

const FORMAT_LABELS: Record<FormatKey, string> = {
    "main-post": "Main Post",
    "story-based": "Story",
    "carousel": "Carousel Text",
    "short-viral-hook": "Short Hook"
}
export function SeriesGenerator() {
    const router = useRouter()
    const {
        user,
        plan,
        usageCount,
        usageLimitMonthly,
        // Input
        tab, setTab,
        inputText, setInputText,
        url, setUrl,
        // Context
        readerContext, setReaderContext,
        emojiOn, setEmojiOn,
        tonePreset, setTonePreset,
        // Config
        postFormats, updatePostFormat,
        // Actions
        handleGenerateSeries,
        canGenerate,
        loading,
        cooldown,
        results,
        updatePost,
        handleCopy
    } = useSeries()

    // Local state for "Custom" input visibility
    const [isCustomReader, setIsCustomReader] = useState(false)

    // Editing state - tracks which post index is being edited (null = none)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const toggleEdit = (index: number) => {
        if (editingIndex === index) {
            setEditingIndex(null)
        } else {
            setEditingIndex(index)
        }
    }

    // Sync custom state with external props on mount/update if needed
    useEffect(() => {
        if (readerContext && !READER_CONTEXT_OPTIONS.includes(readerContext as any)) {
            setIsCustomReader(true)
        }
    }, [readerContext])

    const handleReaderSelect = (val: string) => {
        if (val === "custom") {
            setIsCustomReader(true)
            setReaderContext("") // Clear for new input
        } else {
            setIsCustomReader(false)
            setReaderContext(val)
        }
    }

    // Determine limit reached (Creator only feature)
    const isLimitReached = usageCount !== null && usageLimitMonthly !== null && usageCount >= usageLimitMonthly
    const isFreePlan = plan === "free"

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    Narrative Series
                    {isFreePlan && <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full font-medium ml-2">Creator Feature</span>}
                </h2>
                <p className="text-stone-500">
                    Turn one piece of content into a connected 4-post campaign.
                </p>
            </div>

            <UsageLimitBanner
                isLimitReached={isLimitReached}
                usageCount={usageCount}
                usageLimitMonthly={usageLimitMonthly}
            />

            {/* FREE PLAN LOCK OVERLAY */}
            {isFreePlan && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-[2rem] border-2 border-stone-100 mt-24 h-[calc(100%-6rem)]">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-stone-100 text-center max-w-md animate-in zoom-in-95 duration-300">
                        <div className="h-16 w-16 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                            <Lock className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-2">Unlock Narrative Series</h3>
                        <p className="text-stone-500 mb-8 leading-relaxed">
                            Turn scattered posts into an authoritative campaign.
                            The Series feature generates 4 connected posts designed to build trust and sales.
                        </p>
                        <Button
                            onClick={() => router.push("/usage")}
                            className="w-full h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all hover:scale-[1.02]"
                        >
                            Upgrade to Creator
                        </Button>
                        <p className="mt-4 text-xs text-stone-400">
                            Includes URL extraction, higher limits, and history.
                        </p>
                    </div>
                </div>
            )}

            <div className={`grid gap-6 lg:grid-cols-[1.4fr_1fr] transition-opacity duration-300 ${isFreePlan ? 'opacity-40 pointer-events-none select-none' : ''}`}>
                {/* LEFT COLUMN: Inputs & Config */}
                <div className="space-y-6">
                    {/* 1. INPUT SOURCE */}
                    <Card className="border-stone-200 bg-white/70 backdrop-blur-xl shadow-sm rounded-[2rem] overflow-hidden">
                        <CardHeader className="border-b border-stone-100/50 pb-4">
                            <CardTitle className="text-base font-bold text-stone-800 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs shadow-sm">1</span>
                                Source Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex gap-2 text-xs bg-stone-100/50 p-1.5 rounded-full w-fit">
                                <button
                                    className={`rounded-full px-5 py-2 text-[11px] font-medium transition-all ${tab === "text"
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                        : "bg-transparent text-stone-500 hover:text-stone-700"}`}
                                    onClick={() => setTab("text")}
                                >
                                    Paste Text
                                </button>
                                <button
                                    className={`rounded-full px-5 py-2 text-[11px] font-medium transition-all ${tab === "url"
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                                        : "bg-transparent text-stone-500 hover:text-stone-700"}`}
                                    onClick={() => setTab("url")}
                                >
                                    Paste URL
                                </button>
                            </div>

                            {tab === "text" ? (
                                <Textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Paste your blog, newsletter, or notes here..."
                                    className="min-h-[200px] rounded-xl border-stone-200 bg-stone-50/50 resize-none focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            ) : (
                                <Input
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="rounded-xl border-stone-200 bg-stone-50/50 focus:ring-purple-500/20 focus:border-purple-500"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* 2. GLOBAL CONTEXT */}
                    <Card className="border-stone-200 bg-white/70 backdrop-blur-xl shadow-sm rounded-[2rem] overflow-hidden">
                        <CardHeader className="border-b border-stone-100/50 pb-4">
                            <CardTitle className="text-base font-bold text-stone-800 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs shadow-sm">2</span>
                                Global Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Field 1: Reader Context */}
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-stone-600 ml-1">
                                    Who are you writing this for?
                                </Label>
                                {!isCustomReader ? (
                                    <Select
                                        value={READER_CONTEXT_OPTIONS.includes(readerContext as any) ? readerContext : ""}
                                        onValueChange={handleReaderSelect}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl border-stone-200 bg-stone-50/50 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm shadow-sm transition-all hover:bg-stone-50">
                                            <SelectValue placeholder="Select target audience..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-stone-100 shadow-xl backdrop-blur-xl bg-white/90">
                                            {READER_CONTEXT_OPTIONS.map((opt) => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                            ))}
                                            <SelectItem value="custom" className="font-semibold text-purple-600 focus:text-purple-700">Type my own...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="flex gap-2">
                                        <Input
                                            value={readerContext}
                                            onChange={(e) => setReaderContext(e.target.value)}
                                            placeholder="E.g. Real Estate Agents in NY..."
                                            className="h-11 rounded-xl border-stone-200 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all w-full text-sm shadow-inner"
                                            autoFocus
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsCustomReader(false)
                                                setReaderContext("")
                                            }}
                                            className="h-11 text-stone-400 hover:text-stone-600"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-stone-600 ml-1">Tone</Label>
                                    <Select value={tonePreset} onValueChange={(v) => setTonePreset(v as ToneType)}>
                                        <SelectTrigger className="h-11 rounded-xl bg-stone-50/50 border-stone-200"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="conversational">Conversational</SelectItem>
                                            <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-stone-600 ml-1">Emojis</Label>
                                    <div className="flex items-center gap-3 text-xs text-stone-600 h-11 px-1">
                                        <button
                                            type="button"
                                            onClick={() => setEmojiOn(!emojiOn)}
                                            className={`flex h-7 w-12 items-center rounded-full border px-1 transition-all duration-300 ${emojiOn
                                                ? "border-purple-500 bg-purple-500 shadow-purple-200 shadow-md"
                                                : "border-stone-200 bg-stone-100"
                                                }`}
                                        >
                                            <span
                                                className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${emojiOn ? "translate-x-5" : "translate-x-0"
                                                    }`}
                                            />
                                        </button>
                                        <span className="font-medium text-stone-500">{emojiOn ? "Enabled" : "Disabled"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. SERIES SEQUENCE */}
                    <Card className="border-stone-200 bg-white/70 backdrop-blur-xl shadow-sm rounded-[2rem] overflow-hidden">
                        <CardHeader className="border-b border-stone-100/50 pb-4">
                            <CardTitle className="text-base font-bold text-stone-800 flex items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-xs shadow-sm">3</span>
                                Series Framework
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {SERIES_STEPS.map((step, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-stone-50/30">
                                    <div>
                                        <div className="text-sm font-semibold text-stone-800">{step.label}</div>
                                        <div className="text-xs text-stone-400">{step.desc}</div>
                                    </div>
                                    <Select
                                        value={postFormats[i]}
                                        onValueChange={(val) => updatePostFormat(i as 0 | 1 | 2 | 3, val as FormatKey)}
                                    >
                                        <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg border-stone-200 bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(FORMAT_LABELS).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>{label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col items-end gap-2">
                        <Button
                            onClick={handleGenerateSeries}
                            disabled={!canGenerate || cooldown > 0}
                            className="w-full h-12 rounded-full bg-purple-600 text-white font-semibold shadow-xl shadow-purple-500/20 hover:bg-purple-700 hover:scale-[1.02] transition-all disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing & Writing Series...
                                </>
                            ) : cooldown > 0 ? (
                                `Cooldown (${cooldown}s)`
                            ) : (
                                "Generate Series Campaign"
                            )}
                        </Button>
                        <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1.5 px-2">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Each series costs 3 credits
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Results */}
                <div className="space-y-6">
                    {results.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-stone-800">Your Campaign</h3>
                                <span className="inline-flex items-center justify-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                    4 Posts Ready
                                </span>
                            </div>
                            <div className="relative space-y-8 pl-4 border-l-2 border-stone-100 ml-4">
                                {results.map((content, i) => (
                                    <div key={i} className="relative group">
                                        {/* Connector Dot */}
                                        <div className="absolute -left-[25px] top-6 h-4 w-4 rounded-full bg-purple-100 border-2 border-purple-500 z-10" />

                                        <div className="mb-2 pl-2">
                                            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                                {SERIES_STEPS[i].label.split(":")[0]}
                                            </span>
                                            <span className="ml-2 text-xs text-stone-400">
                                                {FORMAT_LABELS[postFormats[i]]}
                                            </span>
                                        </div>

                                        {editingIndex === i ? (
                                            <Card className="border-stone-200 bg-white/80 backdrop-blur-xl shadow-lg shadow-stone-200/50 rounded-[2rem] overflow-hidden transition-all hover:shadow-xl">
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-stone-100 bg-white/50 px-6 py-4">
                                                    <CardTitle className="text-sm font-bold text-stone-800">
                                                        Edit Content
                                                    </CardTitle>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleEdit(i)}
                                                        className="rounded-lg border border-stone-200 bg-emerald-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm transition-all hover:bg-emerald-700"
                                                    >
                                                        Done
                                                    </button>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    <Textarea
                                                        rows={Math.max(7, Math.ceil(content.length / 80))}
                                                        value={content}
                                                        onChange={(e) => updatePost(i, e.target.value)}
                                                        className="min-h-[160px] w-full resize-y border-0 bg-transparent p-6 text-sm text-stone-700 focus:ring-0 leading-relaxed"
                                                        style={{ overflowY: 'auto' }}
                                                        placeholder="Edit your post content..."
                                                    />
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <LinkedInPostPreview
                                                content={content}
                                                user={user}
                                                onEdit={() => toggleEdit(i)}
                                                onCopy={() => handleCopy(content)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 rounded-[2rem] border-2 border-dashed border-stone-200 bg-stone-50/50">
                            <div className="h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-stone-300" />
                            </div>
                            <h3 className="text-stone-900 font-medium">Ready to write?</h3>
                            <p className="text-stone-500 text-sm max-w-xs mt-2">
                                Hookory will turn your single blog post into a full week of consistent LinkedIn content.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
