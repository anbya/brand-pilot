export type AnalyticsIconName = "analytics" | "clicks" | "conversion" | "download" | "reach" | "roas" | "trendUp" | "trendDown" | "minus" | "alert";
export function AnalyticsIcon({ name, className = "h-5 w-5" }: { name: AnalyticsIconName; className?: string }) {
  const paths: Record<AnalyticsIconName, React.ReactNode> = {
    analytics: <path d="M4 19V5M9 19V9M14 19v-6M19 19V7" />,
    clicks: <><path d="m7 3 10 9-5 1 3 6-3 1-3-6-4 4 2-15Z" /></>,
    conversion: <><path d="M4 7h12l-3-3M20 17H8l3 3" /><path d="M20 8v9M4 7v9" /></>,
    download: <><path d="M12 4v11M7 10l5 5 5-5M4 20h16" /></>,
    reach: <><circle cx="9" cy="9" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 4a4 4 0 0 1 0 8M17 15a5 5 0 0 1 4 5" /></>,
    roas: <><path d="M4 7h16v10H4z" /><circle cx="12" cy="12" r="3" /><path d="M7 12h.01M17 12h.01" /></>,
    trendUp: <path d="m4 16 6-6 4 4 6-7M15 7h5v5" />,
    trendDown: <path d="m4 8 6 6 4-4 6 7M15 17h5v-5" />,
    minus: <path d="M5 12h14" />,
    alert: <><path d="M12 3 2.8 19h18.4L12 3Z" /><path d="M12 9v4M12 16h.01" /></>,
  };
  return <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">{paths[name]}</svg>;
}
