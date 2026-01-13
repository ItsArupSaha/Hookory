import { getUserFromRequest } from "@/lib/auth-server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const authed = await getUserFromRequest(req)
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { userDoc } = authed

  return NextResponse.json({
    plan: userDoc.plan,
    emailVerified: userDoc.emailVerified,
    usageCount: userDoc.usageCount,
    usageLimitMonthly: userDoc.usageLimitMonthly,
    usageResetAt: userDoc.usageResetAt.toDate().toISOString(),
    stripeStatus: userDoc.stripeStatus ?? null,
  })
}

