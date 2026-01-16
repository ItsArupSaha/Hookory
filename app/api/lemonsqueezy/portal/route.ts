import { getSubscription } from "@lemonsqueezy/lemonsqueezy.js"
import { getAuth } from "firebase-admin/auth"
import { adminDb } from "@/lib/firebase/admin"
import { configureLemonSqueezy } from "@/lib/lemonsqueezy"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Ensure setup runs
configureLemonSqueezy()

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("Authorization")
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const token = authHeader.split("Bearer ")[1]
        const decodedToken = await getAuth().verifyIdToken(token)
        const userId = decodedToken.uid

        const userDoc = await adminDb.collection("users").doc(userId).get()
        const userData = userDoc.data()

        if (!userData || !userData.lemonSqueezySubscriptionId) {
            return NextResponse.json(
                { error: "No active subscription found" },
                { status: 404 }
            )
        }

        const subscriptionId = userData.lemonSqueezySubscriptionId

        const { data: subscription, error } = await getSubscription(subscriptionId)

        if (error) {
            console.error("Lemon Squeezy Get Subscription Error:", error)
            return NextResponse.json(
                { error: "Failed to fetch subscription details" },
                { status: 500 }
            )
        }

        const portalUrl = subscription?.data?.attributes?.urls?.customer_portal

        if (!portalUrl) {
            return NextResponse.json(
                { error: "Portal URL not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ url: portalUrl })
    } catch (err: any) {
        console.error("Portal error:", err)
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        )
    }
}
