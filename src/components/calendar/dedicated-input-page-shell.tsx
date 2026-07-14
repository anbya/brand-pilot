import Link from "next/link";

export function DedicatedInputPageShell({ title, description, footer, children }: { title: string; description: string; footer: React.ReactNode; children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f8f9ff] px-4 py-6 text-[#0b1c30] sm:px-6 lg:px-10 lg:py-10">
    <div className="mx-auto max-w-[960px]">
      <Link href="/calendar/content" className="inline-flex min-h-10 items-center rounded-lg px-2 text-sm font-bold text-[#0058bc] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc]">← Back to Content List</Link>
      <header className="mt-4">
        <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0058bc]">Content Calendar</p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#657080]">{description}</p>
      </header>
      <section className="mt-7 overflow-hidden rounded-2xl border border-[#d3e4fe] bg-white shadow-sm">
        <div className="p-4 sm:p-6">{children}</div>
        <footer className="flex flex-wrap justify-end gap-3 border-t border-[#d3e4fe] bg-[#f8faff] p-4 sm:px-6">{footer}</footer>
      </section>
    </div>
  </main>;
}
