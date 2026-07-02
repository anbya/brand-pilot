import { Card, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { calendarItems } from "@/lib/mock-data";

export default function CalendarPage() {
  return (
    <Shell
      eyebrow="Content Calendar"
      title="30-day calendar generator dengan topic, hook, objective, CTA, dan asset need."
      description="Mewakili output otomatis calendar planner agent dan status per item konten."
    >
      <Card>
        <SectionTitle
          title="Calendar items"
          description="Setiap row berisi struktur yang disebutkan di PRD."
        />
        <Table
          headers={["Day", "Topic", "Hook", "CTA", "Asset", "Platform", "Status"]}
          rows={calendarItems.map((item) => [
            `Day ${item.dayNumber}`,
            item.topic,
            item.hook,
            item.cta,
            item.assetNeeded,
            item.platform,
            <StatusBadge key={`${item.id}-status`} status={item.status} />,
          ])}
        />
      </Card>
    </Shell>
  );
}
