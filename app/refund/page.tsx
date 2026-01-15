import Link from "next/link"

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl space-y-5 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300 hover:text-emerald-200"
        >
          ← Back to Hookory
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Hookory Refund Policy
        </h1>
        <p className="text-slate-400 text-xs">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-slate-300">
          Hookory processes refunds only within the rules below.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Refund Eligibility and Window
          </h2>
          <p className="text-slate-300">
            Refund requests must be made within 3 days of purchase. A refund is
            approved only if the service has not been used at all, or if there
            is a valid service-related issue that prevents use. If the service
            has been used, refunds are not provided.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            How to Request a Refund
          </h2>
          <p className="text-slate-300">
            Please contact Hookory support through the app with the account
            email and payment details so the request can be reviewed.
          </p>
        </section>
      </div>
    </main>
  )
}
