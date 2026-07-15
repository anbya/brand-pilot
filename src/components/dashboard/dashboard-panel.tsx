export function DashboardPanel({ children, className = "", ariaHidden }: Readonly<{ children: React.ReactNode; className?: string; ariaHidden?: boolean }>) {
  return <div aria-hidden={ariaHidden} className={`bp-card ${className}`}>{children}</div>;
}
