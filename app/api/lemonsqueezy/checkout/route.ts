import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js"
import { auth } from "firebase-admin"
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
        const userEmail = decodedToken.email

        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const storeId = process.env.LEMONSQUEEZY_STORE_ID
        const variantId = process.env.LEMONSQUEEZY_VARIANT_ID

        if (!storeId || !variantId) {
            console.error("Lemon Squeezy configuration missing")
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            )
        }

        // Create a checkout
        const checkout = await createCheckout(
            storeId,
            parseInt(variantId, 10),
            {
                checkoutData: {
                    custom: {
                        user_id: userId, // Pass Firebase UID to webhook
                    },
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/usage?success=true`,
                    receiptButtonText: "Return to App",
                    receiptThankYouNote: "Thank you for upgrading to Creator!",
                },
            }
        )

        if (checkout.error) {
            console.error("Lemon Squeezy Checkout Error:", checkout.error)
            return NextResponse.json(
                { error: "Failed to create checkout" },
                { status: 500 }
            )
        }

        const checkoutUrl = checkout.data?.data.attributes.url

        if (!checkoutUrl) {
            return NextResponse.json(
                { error: "Failed to retireve checkout URL" },
                { status: 500 }
            )
        }

        return NextResponse.json({ url: checkoutUrl })
    } catch (err: any) {
        console.error("Checkout creation error:", err)
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        )
    }
}
