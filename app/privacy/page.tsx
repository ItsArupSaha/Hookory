import Link from "next/link"

export default function PrivacyPage() {
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
          Hookory Privacy Policy
        </h1>
        <p className="text-slate-400 text-xs">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="text-slate-300">
          This Privacy Policy explains how Hookory collects, uses, and protects
          information when the website and services are used.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Information Collected
          </h2>
          <ul className="space-y-2 text-slate-300">
            <li>
              Account information (such as email address and authentication
              provider).
            </li>
            <li>
              Usage data (such as plan, usage counters, and feature activity).
            </li>
            <li>
              Content submitted to Hookory and the generated outputs, which may
              be temporarily stored to provide history and improve quality.
            </li>
            <li>
              Billing metadata from the payment provider (such as customer and
              subscription IDs). Hookory does not store full payment card
              details.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            How Information Is Used
          </h2>
          <ul className="space-y-2 text-slate-300">
            <li>Provide, operate, and improve the Hookory service.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Maintain security, prevent abuse, and troubleshoot issues.</li>
            <li>Respond to support requests.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Sharing and Disclosure
          </h2>
          <p className="text-slate-300">
            Hookory only shares data with trusted service providers that help
            run the service (for example, hosting, authentication, and
            payments). Hookory does not sell personal data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Data Retention
          </h2>
          <p className="text-slate-300">
            Data is retained for as long as an account is active or as needed to
            provide the service. Account deletion can be requested at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Security
          </h2>
          <p className="text-slate-300">
            Hookory uses reasonable technical and organizational measures to
            protect information. No method of transmission or storage is 100%
            secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Children&apos;s Privacy
          </h2>
          <p className="text-slate-300">
            Hookory is not intended for children under 13. Hookory does not
            knowingly collect personal information from children.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-100">
            Changes to This Policy
          </h2>
          <p className="text-slate-300">
            This policy may be updated from time to time. The
            &quot;Last updated&quot; date at the top of this page will reflect the
            latest changes.
          </p>
        </section>
      </div>
    </main>
  )
}

