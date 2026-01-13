import { adminDb } from "@/lib/firebase/admin"
import { stripe } from "@/lib/stripe"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

async function handleSubscriptionChange(subscription: any) {
  const customerId = subscription.customer as string
  const status = subscription.status as string

  const usersSnap = await adminDb
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get()

  if (usersSnap.empty) return

  const userRef = usersSnap.docs[0].ref

  const isActive =
    status === "active" ||
    status === "trialing" ||
    status === "past_due" // keep until fully canceled / unpaid

  await userRef.update({
    stripeSubscriptionId: subscription.id,
    stripeStatus: status,
    plan: isActive ? "creator" : "free",
    usageLimitMonthly: isActive ? 100 : 5,
    updatedAt: new Date(),
  })
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const sig = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook configuration missing" },
      { status: 500 }
    )
  }

  const rawBody = await req.text()

  let event: any
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error("Stripe webhook verification failed:", err?.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        if (session.customer) {
          const customerId = session.customer as string
          const subscriptionId = session.subscription as string
          const usersSnap = await adminDb
            .collection("users")
            .where("stripeCustomerId", "==", customerId)
            .limit(1)
            .get()

          if (!usersSnap.empty) {
            await usersSnap.docs[0].ref.update({
              stripeSubscriptionId: subscriptionId,
              stripeStatus: "active",
              plan: "creator",
              usageLimitMonthly: 100,
              updatedAt: new Date(),
            })
          }
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        await handleSubscriptionChange(subscription)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object
        const customerId = invoice.customer as string
        const usersSnap = await adminDb
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get()
        if (!usersSnap.empty) {
          await usersSnap.docs[0].ref.update({
            stripeStatus: "past_due",
            updatedAt: new Date(),
          })
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object
        const subscriptionId = invoice.subscription as string
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        await handleSubscriptionChange(subscription)
        break
      }

      default:
        // Ignore other events
        break
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err)
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

