import { getUserFromRequest } from "@/lib/auth-server"
import { checkStripeSubscriptionStatus, syncStripeToFirestore } from "@/lib/stripe-helpers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const authed = await getUserFromRequest(req)
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { uid, userDoc } = authed

  // ALWAYS check Stripe directly - this is the source of truth
  console.log(`[API /me] Checking Stripe for user ${uid}, customerId=${userDoc.stripeCustomerId || "none"}`)
  const subscriptionStatus = await checkStripeSubscriptionStatus(userDoc.stripeCustomerId)
  console.log(`[API /me] Stripe check result: hasCreatorAccess=${subscriptionStatus.hasCreatorAccess}, status=${subscriptionStatus.status}`)
  
  // Sync to Firestore in background (non-blocking)
  syncStripeToFirestore(uid, subscriptionStatus).catch((err) => {
    console.error("[API /me] Background sync failed:", err)
  })

  const effectivePlan: "free" | "creator" = subscriptionStatus.hasCreatorAccess ? "creator" : "free"
  const usageLimitMonthly = effectivePlan === "creator" ? 100 : 5
  
  console.log(`[API /me] Returning plan: ${effectivePlan}, usageLimitMonthly: ${usageLimitMonthly}, stripeStatus: ${subscriptionStatus.status}`)
  
  // Double-check: if stripeStatus is null or there's no valid subscription, force free plan
  if (!subscriptionStatus.status && effectivePlan === "creator") {
    console.warn(`[API /me] WARNING: No stripeStatus but plan is creator, forcing free plan`)
    return NextResponse.json({
      plan: "free",
      emailVerified: userDoc.emailVerified,
      usageCount: userDoc.usageCount,
      usageLimitMonthly: 5,
      usageResetAt: userDoc.usageResetAt.toDate().toISOString(),
      stripeStatus: null,
      subscriptionPeriodEnd: null,
    })
  }

  return NextResponse.json({
    plan: effectivePlan,
    emailVerified: userDoc.emailVerified,
    usageCount: userDoc.usageCount,
    usageLimitMonthly,
    usageResetAt: userDoc.usageResetAt.toDate().toISOString(),
    stripeStatus: subscriptionStatus.status,
    subscriptionPeriodEnd: subscriptionStatus.periodEnd?.toISOString() || null,
  })
}

