import type { PlanningBriefStatus } from "@/lib/calendar/planning-brief-types";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";

const presentation: Record<PlanningBriefStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "neutral" }, pending_approval: { label: "Pending Approval", tone: "warning" }, approved: { label: "Approved", tone: "success" }, changes_requested: { label: "Changes Requested", tone: "danger" },
};

export function PlanningBriefStatusBadge({ status }: { status: PlanningBriefStatus }) { const item = presentation[status]; return <StatusBadge tone={item.tone}>{item.label}</StatusBadge>; }
