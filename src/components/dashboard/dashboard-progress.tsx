export function DashboardProgress({ value, label, valueText, barClassName = "bg-[#0058bc]" }: { value: number; label: string; valueText: string; barClassName?: string }) {
  const normalizedValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={normalizedValue} aria-valuetext={valueText} className="h-1.5 overflow-hidden rounded-full bg-[#e5eeff]"><div aria-hidden="true" className={`h-full rounded-full ${barClassName}`} style={{ width: `${normalizedValue}%` }} /></div>;
}
