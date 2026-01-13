"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase/client"
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
} from "firebase/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SignupPage() {
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
            const result = await signInWithPopup(auth, provider)
            if (result.user && !result.user.emailVerified) {
                try {
                    await sendEmailVerification(result.user)
                } catch {
                    // ignore
                }
            }
            toast({
                title: "Welcome to Hookory",
                description: "Verify your email to start generating.",
            })
            router.push("/dashboard")
        } catch (err: any) {
            console.error(err)
            toast({
                title: "Google signup failed",
                description: err?.message || "Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoadingGoogle(false)
        }
    }

    async function handleEmailSignup(e: FormEvent) {
        e.preventDefault()
        if (!auth) return
        setLoadingEmail(true)
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            try {
                await sendEmailVerification(cred.user)
            } catch {
                // ignore
            }
            toast({
                title: "Account created",
                description: "Check your inbox and verify your email before generating.",
            })
            router.push("/dashboard")
        } catch (err: any) {
            console.error(err)
            toast({
                title: "Signup failed",
                description: err?.message || "Please try again.",
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
                        Create your free account
                    </CardTitle>
                    <p className="text-xs text-slate-500">
                        Start with 5 free repurposes this month. No credit card required.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        type="button"
                        className="w-full text-xs"
                        onClick={handleGoogle}
                        disabled={loadingGoogle || loadingEmail}
                    >
                        {loadingGoogle ? "Signing up…" : "Continue with Google"}
                    </Button>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="h-px flex-1 bg-slate-200" />
                        or
                        <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <form className="space-y-3" onSubmit={handleEmailSignup}>
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
                            {loadingEmail ? "Creating account…" : "Sign up with email"}
                        </Button>
                    </form>

                    <p className="pt-1 text-center text-[11px] text-slate-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-sky-400 hover:text-sky-300">
                            Log in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </main>
    )
}

