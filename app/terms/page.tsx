import Link from "next/link"

export default function TermsPage() {
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
                    Hookory Terms and Conditions
                </h1>
                <p className="text-slate-400 text-xs">
                    Last updated: {new Date().toLocaleDateString()}
                </p>
                <p className="text-slate-300">
                    Legal business name: Hookory.
                </p>
                <p className="text-slate-300">
                    These Terms and Conditions govern the use of Hookory. By using
                    the service, the user agrees to these terms.
                </p>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Eligibility and Account
                    </h2>
                    <p className="text-slate-300">
                        The user must provide accurate information and keep the
                        account secure. The user is responsible for all activity
                        that occurs under the account.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Service Description
                    </h2>
                    <p className="text-slate-300">
                        Hookory provides AI-assisted content repurposing tools.
                        Features may be updated or changed over time.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Subscriptions and Billing
                    </h2>
                    <p className="text-slate-300">
                        Paid plans are billed on a recurring basis until canceled.
                        Taxes may apply based on location. Subscriptions can be
                        managed or canceled in account settings.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Refunds
                    </h2>
                    <p className="text-slate-300">
                        Refunds are handled according to our Refund Policy. Please
                        review the details on the Refund page.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Content Ownership
                    </h2>
                    <p className="text-slate-300">
                        The user owns the content submitted and the outputs
                        generated. Hookory may temporarily store content to
                        provide history, caching, and service improvements.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Prohibited Use
                    </h2>
                    <p className="text-slate-300">
                        The user agrees not to misuse the platform, attempt to
                        reverse engineer it, or use it to generate harmful, illegal,
                        or abusive content.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Availability and Disclaimers
                    </h2>
                    <p className="text-slate-300">
                        The service is provided on an &quot;as is&quot; basis without
                        warranties of any kind. Uninterrupted or error-free
                        operation is not guaranteed.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Limitation of Liability
                    </h2>
                    <p className="text-slate-300">
                        To the maximum extent permitted by law, Hookory is not
                        liable for indirect, incidental, or consequential damages
                        arising from use of the service.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-base font-semibold text-slate-100">
                        Changes to These Terms
                    </h2>
                    <p className="text-slate-300">
                        These terms may be updated from time to time. The
                        &quot;Last updated&quot; date at the top of this page will
                        reflect the latest changes.
                    </p>
                </section>
            </div>
        </main>
    )
}

