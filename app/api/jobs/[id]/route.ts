import { getUserFromRequest } from "@/lib/auth-server"
import { adminDb } from "@/lib/firebase/admin"
import { NextRequest, NextResponse } from "next/server"

interface Params {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  const authed = await getUserFromRequest(req)
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { uid, userDoc } = authed
  if (userDoc.plan !== "creator") {
    return NextResponse.json(
      { error: "History is available on the Creator plan." },
      { status: 403 }
    )
  }

  const db = adminDb
  const jobRef = db.collection("jobs").doc(params.id)
  const snap = await jobRef.get()
  if (!snap.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data = snap.data() as any
  if (data.userId !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({
    id: snap.id,
    createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
    formatsSelected: data.formatsSelected ?? [],
    inputText: data.inputText ?? "",
    outputs: data.outputs ?? {},
    context: data.context ?? {},
  })
}

