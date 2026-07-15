export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger" | "readonly";

const tones: Record<StatusTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  info: "bg-blue-50 text-blue-800",
  success: "bg-emerald-50 text-emerald-800",
  warning: "bg-amber-50 text-amber-800",
  danger: "bg-rose-50 text-rose-800",
  readonly: "bg-violet-50 text-violet-800",
};

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: StatusTone }) {
  return <span className={`bp-badge ${tones[tone]}`}>{children}</span>;
}
