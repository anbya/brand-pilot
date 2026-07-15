import { CalendarSubNavigation } from "@/components/calendar/calendar-sub-navigation";

export function CalendarWorkspaceShell({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="bp-page">
      <section className="min-h-screen">
        {header}
        <div className="bp-page-container">
          <CalendarSubNavigation />
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </main>
  );
}
