import { getUserFromRequest } from "@/lib/auth-server"
import { adminDb } from "@/lib/firebase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const authed = await getUserFromRequest(req)
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { uid, userDoc } = authed

  if (userDoc.plan !== "creator") {
    return NextResponse.json(
      { error: "History is available on the Creator plan.", plan: userDoc.plan },
      { status: 403 }
    )
  }

  // adminDb is guaranteed to be initialised in lib/firebase/admin
  const db = adminDb

  const snap = await db
    .collection("jobs")
    .where("userId", "==", uid)
    .orderBy("createdAt", "desc")
    .limit(30)
    .get()

  const jobs = snap.docs.map((doc) => {
    const data = doc.data() as any
    return {
      id: doc.id,
      createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
      formatsSelected: data.formatsSelected ?? [],
    }
  })

  return NextResponse.json({
    plan: userDoc.plan,
    jobs,
  })
}
