"use client"

import { useState } from "react"
import { SinglePostGenerator } from "@/components/dashboard/SinglePostGenerator"
import { SeriesGenerator } from "@/components/dashboard/SeriesGenerator"
import { FileText, Layers } from "lucide-react"

export default function NewRepurposePage() {
    const [mode, setMode] = useState<"single" | "series">("single")

    return (
        <div className="space-y-8 text-stone-900 pb-12">

            {/* Mode Switcher */}
            <div className="flex justify-center">
                <div className="flex items-center gap-1 bg-stone-200/50 p-1.5 rounded-full border border-stone-200 backdrop-blur-sm">
                    <button
                        onClick={() => setMode("single")}
                        className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === "single"
                                ? "bg-white text-stone-800 shadow-sm ring-1 ring-stone-900/5"
                                : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
                            }`}
                    >
                        <FileText className="h-4 w-4" />
                        Single Post
                    </button>
                    <button
                        onClick={() => setMode("series")}
                        className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === "series"
                                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 text-purple-50"
                                : "text-stone-500 hover:text-stone-700 hover:bg-stone-200/50"
                            }`}
                    >
                        <Layers className="h-4 w-4" />
                        Narrative Series
                        {mode !== "series" && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {mode === "single" ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SinglePostGenerator />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SeriesGenerator />
                </div>
            )}
        </div>
    )
}
