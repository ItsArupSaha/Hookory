"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase/client"
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [loadingGoogle, setLoadingGoogle] = useState(false)

    async function handleGoogle() {
        if (!auth) return
        setLoadingGoogle(true)
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            router.push("/dashboard")
        } catch (err: any) {
            console.error(err)
            toast({
                title: "Google sign-in failed",
                description: err?.message || "Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoadingGoogle(false)
        }
    }

    async function handleEmailLogin(e: FormEvent) {
        e.preventDefault()
        if (!auth) return
        setLoadingEmail(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push("/dashboard")
        } catch (err: any) {
            console.error(err)
            toast({
                title: "Login failed",
                description: err?.message || "Check your credentials and try again.",
                variant: "destructive",
            })
        } finally {
            setLoadingEmail(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
            <Card className="w-full max-w-md border-slate-200 bg-white/95 shadow-md">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                        Log in to your account
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                        Continue with Google or use your email and password.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        type="button"
                        className="w-full text-xs"
                        onClick={handleGoogle}
                        disabled={loadingGoogle || loadingEmail}
                    >
                        {loadingGoogle ? "Signing in…" : "Continue with Google"}
                    </Button>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="h-px flex-1 bg-slate-200" />
                        or
                        <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <form className="space-y-3" onSubmit={handleEmailLogin}>
                        <div className="space-y-1.5 text-xs">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-1.5 text-xs">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="mt-1 w-full text-xs"
                            disabled={loadingEmail || loadingGoogle}
                        >
                            {loadingEmail ? "Logging in…" : "Log in with email"}
                        </Button>
                    </form>

                    <p className="pt-1 text-center text-[11px] text-slate-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-sky-400 hover:text-sky-300">
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    )
}

