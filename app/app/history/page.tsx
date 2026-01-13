"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase/client"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface JobSummary {
    id: string
    createdAt: string
    formatsSelected: string[]
}

interface JobDetail extends JobSummary {
    inputText: string
    outputs: Record<string, string>
    context: any
}

interface JobsResponse {
    plan: "free" | "creator"
    jobs: JobSummary[]
}

export default function HistoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [plan, setPlan] = useState<"free" | "creator" | null>(null)
    const [jobs, setJobs] = useState<JobSummary[]>([])
    const [selectedJob, setSelectedJob] = useState<JobDetail | null>(null)

    useEffect(() => {
        async function load() {
            if (!auth) return
            const user = auth.currentUser
            if (!user) {
                router.push("/login")
                return
            }
            try {
                const token = await user.getIdToken()
                const res = await fetch("/api/jobs", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                if (res.status === 403 && data.plan === "free") {
                    setPlan("free")
                    setJobs([])
                } else if (res.ok) {
                    const payload = data as JobsResponse
                    setPlan(payload.plan)
                    setJobs(payload.jobs)
                } else {
                    throw new Error(data.error || "Failed to load history")
                }
            } catch (err: any) {
                console.error(err)
                toast({
                    title: "Error",
                    description: err?.message || "Failed to load history.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [router])

    async function openJob(id: string) {
        if (!auth) return
        const user = auth.currentUser
        if (!user) return
        try {
            const token = await user.getIdToken()
            const res = await fetch(`/api/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Failed to load job")
            }
            setSelectedJob(data as JobDetail)
        } catch (err: any) {
            toast({
                title: "Error",
                description: err?.message || "Failed to open job.",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return (
            <div className="text-xs text-slate-400">
                Loading history…
            </div>
        )
    }

    if (plan === "free") {
        return (
            <div className="flex h-full items-center justify-center">
                <Card className="max-w-md border-amber-200 bg-amber-50">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold text-slate-900">
                            History is a Creator feature
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs text-slate-700">
                        <p>
                            Save every repurpose, revisit past outputs, and quickly remix your
                            best-performing posts.
                        </p>
                        <ul className="list-disc space-y-1 pl-4 text-slate-500">
                            <li>Full history of your last 100 repurposes</li>
                            <li>Open and tweak any past LinkedIn format</li>
                            <li>Perfect for weekly content batching</li>
                        </ul>
                        <Button
                            className="mt-2 w-full"
                            onClick={() => router.push("/app/usage")}
                        >
                            Upgrade to Creator
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid gap-4 text-slate-900 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
            <div className="space-y-3">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    History
                </h1>
                <p className="text-xs text-slate-500">
                    Recent repurposes. Click to open and review outputs.
                </p>

                {jobs.length === 0 ? (
                    <p className="mt-4 text-xs text-slate-500">
                        No history yet. Generate a repurpose with &quot;Save to
                        history&quot; enabled.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {jobs.map((job) => (
                            <button
                                key={job.id}
                                type="button"
                                onClick={() => openJob(job.id)}
                                className="flex w-full flex-col items-start rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs shadow-sm hover:border-orange-300 hover:bg-orange-50/60"
                            >
                                <span className="font-medium text-slate-900">
                                    {formatDate(job.createdAt)}
                                </span>
                                <span className="mt-0.5 text-[11px] text-slate-500">
                                    {job.formatsSelected.join(", ")}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-900">
                    Details
                </h2>
                {!selectedJob ? (
                    <p className="text-xs text-slate-500">
                        Select a repurpose from the left to view inputs and outputs.
                    </p>
                ) : (
                    <div className="space-y-4">
                        <Card className="border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-slate-900">
                                    Input
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    rows={6}
                                    value={selectedJob.inputText}
                                    readOnly
                                    className="text-xs"
                                />
                            </CardContent>
                        </Card>

                        <div className="space-y-3">
                            {Object.entries(selectedJob.outputs).map(([format, text]) => (
                                <Card
                                    key={format}
                                    className="border-slate-200 bg-white text-xs"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-xs font-semibold capitalize text-slate-900">
                                            {format.replace(/-/g, " ")}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea rows={6} value={text} readOnly />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

