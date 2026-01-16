import { getUserFromRequest } from "@/lib/auth-server"
import { checkLemonSqueezySubscriptionStatus, syncLemonSqueezyToFirestore } from "@/lib/lemonsqueezy"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    try {
        const authed = await getUserFromRequest(req)
        if (!authed) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { uid, userDoc } = authed
        const email = userDoc.email

        console.log(`[Sync] Starting manual sync for user ${uid} (${email})`)

        // 1. Fetch latest status from Lemon Squeezy API
        const subscriptionStatus = await checkLemonSqueezySubscriptionStatus(email ?? undefined)

        // 2. Sync to Firestore
        await syncLemonSqueezyToFirestore(uid, subscriptionStatus)

        console.log(`[Sync] Completed manual sync for user ${uid}. Status: ${subscriptionStatus.status}`)

        return NextResponse.json({
            success: true,
            status: subscriptionStatus.status,
            plan: subscriptionStatus.hasCreatorAccess ? "creator" : "free"
        })
    } catch (error: any) {
        console.error("[Sync] Error syncing subscription:", error)
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        )
    }
}
