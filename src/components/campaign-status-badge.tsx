import { StatusBadge } from "@/components/ui/status-badge";
import { campaignStatusLabels, type CampaignStatus } from "@/lib/campaign-status";

const tones = { blueprint: "neutral", ready: "warning", published: "success" } as const;

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <StatusBadge tone={tones[status]}>{campaignStatusLabels[status]}</StatusBadge>;
}
