import type { ManualPostStatus } from "@/lib/calendar/manual-post-types";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";

const statusMap: Record<ManualPostStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "neutral" }, pending_approval: { label: "Pending Approval", tone: "warning" }, changes_requested: { label: "Changes Requested", tone: "danger" }, scheduled: { label: "Scheduled", tone: "info" },
};
export function PostDraftStatusBadge({ status }: { status: ManualPostStatus }) { const value = statusMap[status]; return <StatusBadge tone={value.tone}>{value.label}</StatusBadge>; }
