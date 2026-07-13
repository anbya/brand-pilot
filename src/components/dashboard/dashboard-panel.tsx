export function DashboardPanel({ children, className = "", ariaHidden }: Readonly<{ children: React.ReactNode; className?: string; ariaHidden?: boolean }>) {
  return <div aria-hidden={ariaHidden} className={`min-w-0 rounded-lg border border-[#d3e4fe]/80 bg-white p-4 shadow-sm sm:p-6 ${className}`}>{children}</div>;
}
