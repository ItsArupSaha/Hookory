"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase/client"
import { User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type FormatKey =
    | "thought-leadership"
    | "story-based"
    | "educational-carousel"
    | "short-viral-hook"

const MAX_INPUT_LENGTH = 6000

export default function NewRepurposePage() {
    const router = useRouter()
    const [tab, setTab] = useState<"text" | "url">("text")
    const [inputText, setInputText] = useState("")
    const [url, setUrl] = useState("")
    const [targetAudience, setTargetAudience] = useState("")
    const [audiencePreset, setAudiencePreset] = useState("")
    const [goal, setGoal] = useState<"engagement" | "leads" | "authority" | "">("engagement")
    const [style, setStyle] = useState<"thought-leader" | "storyteller" | "educator" | "">("thought-leader")
    const [emojiOn, setEmojiOn] = useState(false)
    const [tonePreset, setTonePreset] = useState<
        "professional" | "conversational" | "storytelling" | "educational" | ""
    >("professional")
    const [formats, setFormats] = useState<Record<FormatKey, boolean>>({
        "thought-leadership": true,
        "story-based": false,
        "educational-carousel": false,
        "short-viral-hook": false,
    })
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [results, setResults] = useState<Record<FormatKey, string>>({
        "thought-leadership": "",
        "story-based": "",
        "educational-carousel": "",
        "short-viral-hook": "",
    })
    const [plan, setPlan] = useState<"free" | "creator" | null>(null)

    useEffect(() => {
        async function loadMe() {
            if (!auth) return
            const user = auth.currentUser
            if (!user) return
            try {
                const token = await user.getIdToken()
                const res = await fetch("/api/me", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                if (res.ok) {
                    setPlan(data.plan as "free" | "creator")
                }
            } catch {
                // non-critical
            }
        }
        loadMe()
    }, [])

    const selectedFormats = (Object.keys(formats) as FormatKey[]).filter(
        (k) => formats[k]
    )

    const canGenerate =
        selectedFormats.length > 0 &&
        (tab === "text"
            ? inputText.trim().length > 0
            : url.trim().length > 0) &&
        !loading

    async function getUserAndToken(): Promise<{ user: User; token: string } | null> {
        if (!auth) return null
        const user = auth.currentUser
        if (!user) {
            router.push("/login")
            return null
        }
        const token = await user.getIdToken()
        return { user, token }
    }

    async function handleGenerate() {
        if (!canGenerate) return
        setLoading(true)
        try {
            const userInfo = await getUserAndToken()
            if (!userInfo) return

            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    inputType: tab === "text" ? "text" : "url",
                    inputText,
                    url,
                    context: {
                        targetAudience: targetAudience || undefined,
                        goal: (goal || undefined) as any,
                        style: (style || undefined) as any,
                        emojiOn,
                        tonePreset: (tonePreset || undefined) as any,
                    },
                    formats: selectedFormats,
                    regenerate: false,
                    saveHistory: true,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                if (res.status === 402) {
                    toast({
                        title: "Limit reached",
                        description: data.error || "Upgrade to keep generating.",
                        variant: "destructive",
                    })
                    return
                }
                if (res.status === 403 || res.status === 429) {
                    toast({
                        title: "Please wait",
                        description: data.error || "Try again in a bit.",
                        variant: "destructive",
                    })
                    if (typeof data.secondsRemaining === "number") {
                        setCooldown(data.secondsRemaining)
                    }
                    return
                }
                throw new Error(data.error || "Failed to generate")
            }

            const outputs = data.outputs as Record<string, string>
            setResults((prev) => ({
                ...prev,
                ...outputs,
            }))
            toast({
                title: "Generated",
                description: "Your LinkedIn formats are ready.",
            })
            setCooldown(45)
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    async function handleRegenerate(format: FormatKey) {
        if (!auth) return
        const userInfo = await getUserAndToken()
        if (!userInfo) return
        setLoading(true)
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({
                    inputType: tab === "text" ? "text" : "url",
                    inputText,
                    url,
                    context: {
                        targetAudience: targetAudience || undefined,
                        goal: (goal || undefined) as any,
                        style: (style || undefined) as any,
                        emojiOn,
                        tonePreset: (tonePreset || undefined) as any,
                    },
                    formats: [format],
                    regenerate: true,
                    saveHistory: true,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                if (res.status === 402) {
                    toast({
                        title: "Limit reached",
                        description: data.error || "Upgrade to keep generating.",
                        variant: "destructive",
                    })
                    return
                }
                if (res.status === 403 || res.status === 429) {
                    toast({
                        title: "Please wait",
                        description: data.error || "Try again in a bit.",
                        variant: "destructive",
                    })
                    if (typeof data.secondsRemaining === "number") {
                        setCooldown(data.secondsRemaining)
                    }
                    return
                }
                throw new Error(data.error || "Failed to regenerate")
            }

            const outputs = data.outputs as Record<string, string>
            setResults((prev) => ({
                ...prev,
                ...(outputs as any),
            }))
            toast({
                title: "Regenerated",
                description: "Updated LinkedIn format is ready.",
            })
            setCooldown(45)
            const interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Something went wrong.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    function toggleFormat(key: FormatKey) {
        setFormats((prev) => {
            const willSelect = !prev[key]
            const base: Record<FormatKey, boolean> = {
                "thought-leadership": false,
                "story-based": false,
                "educational-carousel": false,
                "short-viral-hook": false,
            }
            if (willSelect) {
                base[key] = true
            }
            return base
        })
    }

    function handleCopy(text: string) {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied",
            description: "Content copied to clipboard.",
        })
    }

    return (
        <div className="space-y-6 text-slate-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        New Repurpose
                    </h1>
                    <p className="text-xs text-slate-500">
                        Paste your content and choose a LinkedIn format.
                    </p>
                </div>
                {cooldown > 0 && (
                    <p className="text-xs text-slate-400">
                        Cooldown: {cooldown}s before next generation
                    </p>
                )}
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="space-y-4">
                    {/* Input card */}
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-900">
                                Input
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2 text-xs">
                                <button
                                    className={`rounded-full px-3 py-1 text-[11px] ${tab === "text"
                                        ? "bg-orange-500 text-white"
                                        : "bg-slate-100 text-slate-700"
                                        } border border-slate-200`}
                                    onClick={() => setTab("text")}
                                >
                                    Paste Text
                                </button>
                                <button
                                    className={`rounded-full px-3 py-1 text-[11px] ${tab === "url"
                                        ? "bg-orange-500 text-white"
                                        : "bg-slate-100 text-slate-700"
                                        } border border-slate-200`}
                                    onClick={() => setTab("url")}
                                >
                                    Paste URL
                                </button>
                            </div>

                            {tab === "text" ? (
                                <div className="space-y-2">
                                    <Label htmlFor="inputText" className="text-xs text-slate-700">
                                        Content to repurpose
                                    </Label>
                                    <Textarea
                                        id="inputText"
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value.slice(0, MAX_INPUT_LENGTH))
                                        }
                                        rows={8}
                                        maxLength={MAX_INPUT_LENGTH}
                                        placeholder="Paste your article, newsletter, or long-form content here…"
                                    />
                                    <p className="text-[11px] text-slate-500">
                                        {inputText.length}/{MAX_INPUT_LENGTH} characters
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Label htmlFor="url" className="text-xs text-slate-700">
                                        Public URL (Medium, Notion, Google Doc)
                                    </Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://"
                                    />
                                    <p className="text-[11px] text-slate-500">
                                        Paste a publicly viewable article or doc. We&apos;ll extract
                                        the readable content for you.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Context card */}
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-900">
                                Context
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label
                                    htmlFor="targetAudience"
                                    className="text-xs text-slate-700"
                                >
                                    Target audience
                                </Label>
                                <div className="flex gap-2">
                                    <Select
                                        value={audiencePreset}
                                        onValueChange={(v) => {
                                            setAudiencePreset(v)
                                            setTargetAudience(v)
                                        }}
                                    >
                                        <SelectTrigger className="h-8 w-44 text-xs">
                                            <SelectValue placeholder="Common audiences" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Freelancers">
                                                Freelancers
                                            </SelectItem>
                                            <SelectItem value="Consultants">
                                                Consultants
                                            </SelectItem>
                                            <SelectItem value="Job seekers">
                                                Job seekers
                                            </SelectItem>
                                            <SelectItem value="Founders">
                                                Founders
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        id="targetAudience"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        placeholder="e.g. B2B SaaS founders, senior product marketers…"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-700">Goal</Label>
                                <Select
                                    value={goal}
                                    onValueChange={(v) => setGoal(v as any)}
                                >
                                    <SelectTrigger className="[&>span:first-child]:flex-1 [&>span:first-child]:text-center">
                                        <SelectValue placeholder="Select goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="engagement" className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span>Engagement</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Likes, Comments, Saves)
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="authority" className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span>Authority</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Thought leadership, Expertise, Credibility)
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="leads" className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span>Leads</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Soft CTA, Curiosity-driven, Non-pushy)
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-700">Style</Label>
                                <Select
                                    value={style}
                                    onValueChange={(v) => setStyle(v as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="thought-leader">
                                            Thought leader
                                        </SelectItem>
                                        <SelectItem value="storyteller">Storyteller</SelectItem>
                                        <SelectItem value="educator">Educator</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-700">Emojis</Label>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <button
                                        type="button"
                                        onClick={() => setEmojiOn(!emojiOn)}
                                        className={`flex h-6 w-10 items-center rounded-full border px-0.5 ${emojiOn ? "border-orange-400 bg-orange-500/90" : "border-slate-300 bg-slate-100"
                                            }`}
                                    >
                                        <span
                                            className={`h-5 w-5 rounded-full bg-white transition-transform ${emojiOn ? "translate-x-4" : "translate-x-0"
                                                }`}
                                        />
                                    </button>
                                    <span>{emojiOn ? "On" : "Off"}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-slate-700">
                                    Tone preset
                                </Label>
                                <Select
                                    value={tonePreset}
                                    onValueChange={(v) => setTonePreset(v as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="professional">
                                            <div className="flex flex-col">
                                                <span>Professional</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Calm, Confident, Clean, Neutral authority)
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="conversational">
                                            <div className="flex flex-col">
                                                <span>Conversational</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Friendly, Natural, Approachable)
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="storytelling">
                                            <div className="flex flex-col">
                                                <span>Storytelling</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Personal, Narrative-driven, Relatable)
                                                </span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="educational">
                                            <div className="flex flex-col">
                                                <span>Educational</span>
                                                <span className="text-[10px] text-slate-500">
                                                    (Clear, Structured, Insight-driven)
                                                </span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formats */}
                    <Card className="border-slate-200 bg-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold text-slate-900">
                                LinkedIn formats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2">
                            {(
                                [
                                    ["thought-leadership", "Thought leadership"],
                                    ["story-based", "Story-based"],
                                    ["educational-carousel", "Educational / carousel"],
                                    ["short-viral-hook", "Short viral hook"],
                                ] as [FormatKey, string][]
                            ).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => toggleFormat(key)}
                                    className={`flex flex-col items-start rounded-md border px-3 py-2 text-left text-xs ${formats[key]
                                        ? "border-orange-400 bg-orange-50 text-slate-900"
                                        : "border-slate-200 bg-white text-slate-600"
                                        }`}
                                >
                                    <span className="font-medium">{label}</span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerate}
                            disabled={!canGenerate || cooldown > 0}
                            className="min-w-[160px]"
                        >
                            {loading
                                ? "Generating…"
                                : cooldown > 0
                                    ? `Cooldown (${cooldown}s)`
                                    : "Generate"}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Outputs
                    </h2>
                    {selectedFormats.length === 0 ? (
                        <p className="text-xs text-slate-500">
                            Select at least one format to generate LinkedIn content.
                        </p>
                    ) : (
                        selectedFormats.map((key) => {
                            const titleMap: Record<FormatKey, string> = {
                                "thought-leadership": "Thought leadership",
                                "story-based": "Story-based",
                                "educational-carousel": "Educational / carousel",
                                "short-viral-hook": "Short viral hook",
                            }
                            const value = results[key] || ""
                            const charCount = value.length
                            return (
                                <Card
                                    key={key}
                                    className="border-slate-200 bg-white text-xs shadow-sm"
                                >
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-xs font-semibold text-slate-900">
                                            {titleMap[key]}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                            <span>{charCount} chars</span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(value)}
                                                className="rounded-md border border-slate-200 px-2 py-1 text-[11px] hover:border-orange-300 hover:bg-orange-50/70"
                                            >
                                                Copy
                                            </button>
                                            {plan === "creator" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRegenerate(key)}
                                                    className="rounded-md border border-slate-200 px-2 py-1 text-[10px] text-slate-700 hover:border-orange-300 hover:bg-orange-50/70"
                                                >
                                                    Regenerate
                                                </button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            rows={7}
                                            value={value}
                                            onChange={(e) =>
                                                setResults((prev) => ({
                                                    ...prev,
                                                    [key]: e.target.value,
                                                }))
                                            }
                                        />
                                        <p className="mt-1 text-[10px] text-slate-500">
                                            Regenerate and save to history are Creator features.
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

