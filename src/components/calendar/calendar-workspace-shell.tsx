import { CalendarSubNavigation } from "@/components/calendar/calendar-sub-navigation";

export function CalendarWorkspaceShell({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <section className="min-h-screen">
        {header}
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <CalendarSubNavigation />
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </main>
  );
}
