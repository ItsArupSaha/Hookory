"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase/client"
import { cn } from "@/lib/utils"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface MeResponse {
    plan: "free" | "creator"
    emailVerified: boolean
    usageCount: number
    usageLimitMonthly: number
    usageResetAt: string
    stripeStatus: string | null
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
    const [me, setMe] = useState<MeResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [checkingMe, setCheckingMe] = useState(false)
    const [upgrading, setUpgrading] = useState(false)
    const [portalLoading, setPortalLoading] = useState(false)

    useEffect(() => {
        if (!auth) return

        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setFirebaseUser(null)
                setMe(null)
                setLoading(false)
                // Only redirect if we're not already on a public page
                if (!pathname?.startsWith("/login") && !pathname?.startsWith("/signup") && !pathname?.startsWith("/terms") && !pathname?.startsWith("/privacy")) {
                    router.push("/login")
                }
                return
            }
            setFirebaseUser(user)
            setLoading(false)
            setCheckingMe(true)
            try {
                const token = await user.getIdToken()
                const res = await fetch("/api/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) {
                    throw new Error("Failed to load account data")
                }
                const data = (await res.json()) as MeResponse
                setMe(data)
            } catch (err: any) {
                console.error(err)
                toast({
                    title: "Error",
                    description: err?.message || "Failed to load account data",
                    variant: "destructive",
                })
            } finally {
                setCheckingMe(false)
            }
        })

        return () => unsub()
    }, [router, pathname])

    const isActive = (href: string) => pathname?.startsWith(href)

    const usagePercent = me
        ? Math.min(100, (me.usageCount / Math.max(1, me.usageLimitMonthly)) * 100)
        : 0

    async function handleUpgrade() {
        if (!firebaseUser || upgrading) return
        setUpgrading(true)
        try {
            const token = await firebaseUser.getIdToken()
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Failed to start checkout")
            }
            if (data.url) {
                // Small delay for smooth transition before redirect
                await new Promise((resolve) => setTimeout(resolve, 300))
                window.location.href = data.url
            }
        } catch (err: any) {
            setUpgrading(false)
            toast({
                title: "Upgrade failed",
                description: err?.message || "Please try again later.",
                variant: "destructive",
            })
        }
    }

    async function handleBillingPortal() {
        if (!firebaseUser || portalLoading) return
        setPortalLoading(true)
        try {
            const token = await firebaseUser.getIdToken()
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Failed to open billing portal")
            }
            if (data.url) {
                // Small delay for smooth transition before redirect
                await new Promise((resolve) => setTimeout(resolve, 300))
                window.location.href = data.url
            }
        } catch (err: any) {
            setPortalLoading(false)
            toast({
                title: "Billing portal error",
                description: err?.message || "Please try again later.",
                variant: "destructive",
            })
        }
    }

    async function handleLogout() {
        if (!auth) return
        await signOut(auth)
        router.push("/")
    }

    const initials =
        (firebaseUser?.email && firebaseUser.email[0]?.toUpperCase()) || "U"
    const [profileOpen, setProfileOpen] = useState(false)

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
                <p className="text-sm text-slate-500">Loading your workspace…</p>
            </div>
        )
    }

    if (!firebaseUser) {
        return null
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            {/* Sidebar */}
            <aside className="hidden w-60 border-r border-slate-200 bg-white px-4 py-6 shadow-sm sm:flex sm:flex-col">
                <div className="mb-8">
                    <Link href="/app/new" className="flex items-center gap-2">
                        <span className="h-7 w-7 rounded-lg bg-indigo-600 text-center text-sm font-bold leading-7 text-white shadow-sm">
                            H
                        </span>
                        <span className="text-sm font-semibold tracking-tight">
                            Hookline.io
                        </span>
                    </Link>
                </div>
                <nav className="flex flex-1 flex-col gap-1 text-sm">
                    <Link
                        href="/app/new"
                        className={cn(
                            "rounded-md px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-orange-700",
                            isActive("/app/new") && "bg-orange-50 text-orange-700 font-medium"
                        )}
                    >
                        New Repurpose
                    </Link>
                    <Link
                        href="/app/history"
                        className={cn(
                            "rounded-md px-3 py-2 text-slate-600 hover:bg-orange-50 hover:text-orange-700",
                            isActive("/app/history") && "bg-orange-50 text-orange-700 font-medium"
                        )}
                    >
                        History
                        {me?.plan === "free" && (
                            <span className="ml-2 rounded-full bg-orange-100 px-1.5 text-[10px] uppercase tracking-wide text-orange-700">
                                Pro
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/app/usage"
                        className={cn(
                            "rounded-md px-3 py-2 text-slate-600 hover:bg-orange-50 hover:text-orange-700",
                            isActive("/app/usage") && "bg-orange-50 text-orange-700 font-medium"
                        )}
                    >
                        Usage
                    </Link>
                    <Link
                        href="/app/settings"
                        className={cn(
                            "rounded-md px-3 py-2 text-slate-600 hover:bg-orange-50 hover:text-orange-700",
                            isActive("/app/settings") && "bg-orange-50 text-orange-700 font-medium"
                        )}
                    >
                        Settings
                    </Link>
                </nav>
                {me && (
                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                            <span>
                                {me.usageCount}/{me.usageLimitMonthly} uses
                            </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </aside>

            {/* Main */}
            <div className="flex min-h-screen flex-1 flex-col">
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            Plan:{" "}
                            <span className="ml-1 rounded-full bg-indigo-600 text-white px-1.5">
                                {me?.plan === "creator" ? "Creator" : "Free"}
                            </span>
                        </span>
                        {checkingMe && (
                            <span className="text-xs text-slate-500">Syncing billing…</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {me?.plan === "creator" ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="min-w-[120px] text-xs transition-all duration-200"
                                onClick={handleBillingPortal}
                                disabled={portalLoading}
                            >
                                {portalLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Opening...</span>
                                    </span>
                                ) : (
                                    "Manage billing"
                                )}
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                className="min-w-[100px] text-xs transition-all duration-200 hover:scale-105 active:scale-95"
                                onClick={handleUpgrade}
                                disabled={upgrading}
                            >
                                {upgrading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Redirecting...</span>
                                    </span>
                                ) : (
                                    "Upgrade"
                                )}
                            </Button>
                        )}
                        <div className="relative text-xs text-slate-600">
                            <button
                                type="button"
                                onClick={() => setProfileOpen((open) => !open)}
                                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 hover:bg-slate-50"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                                    {initials}
                                </span>
                                <span className="max-w-[140px] truncate text-[11px]">
                                    {firebaseUser.email ?? "Account"}
                                </span>
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 z-20 mt-2 w-52 rounded-md border border-slate-200 bg-white py-2 shadow-lg">
                                    <div className="px-3 pb-2 text-[11px] text-slate-500">
                                        <p className="font-medium text-slate-800">
                                            Profile
                                        </p>
                                        <p className="truncate">
                                            {firebaseUser.email ?? "Unknown email"}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-between px-3 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-50"
                                    >
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Email verification banner */}
                {me && !me.emailVerified && (
                    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
                        <p>
                            Verify your email to generate content. Check your inbox for a
                            verification link.
                        </p>
                    </div>
                )}

                <main className="flex-1 bg-slate-50 px-3 py-4 sm:px-6 sm:py-6">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>
            </div>
        </div>
    )
}

