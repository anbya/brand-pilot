import { AppFrame, Card, PrimaryButton, SectionTitle, Shell } from "@/components/brandpilot";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

export default function CalendarPage() {
  return (
    <Shell
      eyebrow="Content Calendar View"
      title="Monthly publishing calendar."
      description="Visualnya mengikuti calendar grid pada referensi."
      actions={<PrimaryButton href="/content">Open Content Detail</PrimaryButton>}
    >
      <AppFrame title="July 2026">
        <Card>
          <SectionTitle title="Content Calendar" description="Campaign items placed on a monthly calendar." />
          <div className="grid grid-cols-7 gap-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {day}
              </div>
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`min-h-24 rounded-xl border p-3 text-sm ${day % 5 === 0 ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"}`}
              >
                <p className="font-medium text-slate-900">{day}</p>
                {day % 5 === 0 ? (
                  <div className="mt-2 rounded-lg bg-white px-2 py-1 text-xs text-violet-700 shadow-sm">
                    Carousel
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </AppFrame>
    </Shell>
  );
}
