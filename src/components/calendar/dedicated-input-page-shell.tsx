import Link from "next/link";

export function DedicatedInputPageShell({ title, description, footer, children }: { title: string; description: string; footer: React.ReactNode; children: React.ReactNode }) {
  return <main className="bp-page pb-24">
    <div className="mx-auto max-w-[960px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <Link href="/calendar/content" className="inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-bold text-[#0058bc] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">← Back to Content List</Link>
      <header className="mt-4">
        <p className="bp-eyebrow">Content Calendar</p>
        <h1 className="bp-page-title">{title}</h1>
        <p className="bp-page-description">{description}</p>
      </header>
      <section className="mt-6 overflow-hidden rounded-xl border border-[var(--bp-border)] bg-white shadow-[var(--bp-shadow-sm)]">
        <div className="p-4 sm:p-6">{children}</div>
        <footer className="bp-sticky-actions static justify-end">{footer}</footer>
      </section>
    </div>
  </main>;
}
