import type { GeneratedPlanStatus } from "@/lib/calendar/generated-plan-types";
import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
const map: Record<GeneratedPlanStatus, { label: string; tone: StatusTone }> = { generated: { label: "Generated", tone: "info" }, partially_approved: { label: "Partially Added to Calendar", tone: "warning" }, approved_to_calendar: { label: "Added to Calendar", tone: "success" } };
export function GeneratedPlanStatusBadge({ status }: { status: GeneratedPlanStatus }) { const value = map[status]; return <StatusBadge tone={value.tone}>{value.label}</StatusBadge>; }
