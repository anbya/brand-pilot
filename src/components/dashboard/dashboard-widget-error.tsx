import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

export function DashboardWidgetError({ title, message, onRetry, className = "" }: { title: string; message: string; onRetry?: () => void; className?: string }) {
  return <DashboardPanel className={className}><div role="alert" className="flex min-w-0 flex-col items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-700"><DashboardIcon name="alert" className="h-5 w-5" /></span><div className="min-w-0"><h2 className="break-words text-base font-extrabold text-[#0b1c30]">{title}</h2><p className="mt-1 break-words text-sm leading-5 text-[#657080]">{message}</p></div>{onRetry && <button aria-label={`Retry ${title}`} type="button" onClick={onRetry} className="min-h-10 rounded-lg border border-[#0058bc] px-4 text-sm font-bold text-[#0058bc] outline-none hover:bg-[#eff4ff] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">Try again</button>}</div></DashboardPanel>;
}
