import { Card, SectionTitle, Shell, StatusBadge, Table } from "@/components/brandpilot";
import { assets, calendarItems } from "@/lib/mock-data";

export default function ApprovalPage() {
  const reviewRows = [
    ...calendarItems.map((item) => ({
      name: `Calendar Day ${item.dayNumber}`,
      type: "content",
      status: item.status,
      note: item.captionPreview,
    })),
    ...assets.map((asset) => ({
      name: asset.title,
      type: asset.type,
      status: asset.status,
      note: asset.variant,
    })),
  ];

  return (
    <Shell
      eyebrow="Approval Desk"
      title="Status board untuk review, approve, reject, dan revision."
      description="Bulk approval tersedia di level experience dan menutup modul approval Phase 1."
    >
      <Card>
        <SectionTitle
          title="Approval board"
          description="Daftar item lintas content dan asset untuk diputuskan."
        />
        <Table
          headers={["Item", "Type", "Status", "Review note", "Action"]}
          rows={reviewRows.map((row) => [
            row.name,
            row.type,
            <StatusBadge key={`${row.name}-status`} status={row.status} />,
            row.note,
            <span key={`${row.name}-action`} className="text-sm font-medium text-blue-600">
              Approve / Reject / Revise
            </span>,
          ])}
        />
      </Card>
    </Shell>
  );
}
