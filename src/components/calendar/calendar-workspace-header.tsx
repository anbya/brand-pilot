import Image from "next/image";
import Link from "next/link";
import type { CalendarView } from "@/lib/calendar/types";

const teamImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDAmIHHW9OsNVtDymmwxZgfn9wZZBGLyOLQwdiEey0TzxOpw86mgovDdfKHlsv9qC6m8FLVk_6bdpvrjh-aDq4ANOoTOv0lNSu6fRTxCQzmlYJLKCnM7Uy4xX6eQxVWzpDmHIyNjqABIvM9gM0trfHLUcv_OTumL1LIhL3ZcVbkmh5e8QO58GXX0HjlzRMGs4-_RFJl2Vcv31o107FDTkI3RwxIEOFfBEcyJVNvmBHD7MLfAqSNx188",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAseD8mkp2tp-psAxPjBx6XB7r1qEZXuqPZCIWPwqBKYXRmiSM1bN2fxn5cr9nleDuk3VmLIknDB94hGgL-vHn1FgLKT9UAcnaY6SUd643CodVHD5_rXqrAxjtCpDN5zdNWfHTd8YGWYxXkxzFIfETf1GDEarMANgOxU4e9gJg4mFBqRDeeRHxHxcVdIyzHUUZcvowgm_O2H9TbSnmbb3xK6Lb6Geqlh-VwLnOANr3DLp3qI4D3t299",
] as const;

type CalendarHeaderProps = {
  variant: "calendar";
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onOpenAiPlan?: () => void;
  onCreatePost?: () => void;
};

type ListHeaderProps =
  | { variant: "planning-briefs"; canCreate: boolean }
  | { variant: "post-drafts"; canCreate: boolean };

export type CalendarWorkspaceHeaderProps = CalendarHeaderProps | ListHeaderProps;

export function CalendarWorkspaceHeader(props: CalendarWorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d3e4fe]/70 bg-[#f8f9ff]/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div>
            <h1 className="text-xl font-extrabold">Content Calendar</h1>
            <p className="mt-1 text-sm text-[#657080]">Plan and review every platform version in one place.</p>
          </div>
          {props.variant === "calendar" && (
            <div aria-label="Calendar view" className="flex w-full rounded-lg bg-[#e5eeff] p-1 sm:w-fit">
              {(["month", "week"] as const).map((option) => (
                <button key={option} type="button" aria-pressed={props.view === option} onClick={() => props.onViewChange(option)} className={`min-h-10 flex-1 rounded-md px-4 text-sm font-bold capitalize outline-none focus-visible:ring-2 focus-visible:ring-[#0058bc] sm:flex-none ${props.view === option ? "bg-white text-[#0058bc] shadow-sm" : "text-[#414755] hover:text-[#0058bc]"}`}>
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex -space-x-2" aria-label="Calendar collaborators">
            {teamImages.map((src) => <Image key={src} src={src} width={32} height={32} alt="" className="h-8 w-8 rounded-full border-2 border-[#f8f9ff] object-cover" />)}
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f8f9ff] bg-[#0070eb] text-[10px] font-extrabold text-white">+3</span>
          </div>
          {props.variant === "calendar" && props.onOpenAiPlan && <button type="button" onClick={props.onOpenAiPlan} className="min-h-11 rounded-lg border border-[#4648d4] px-4 text-sm font-bold text-[#4648d4] outline-none hover:bg-[#e1e0ff] focus-visible:ring-2 focus-visible:ring-[#4648d4]">AI Plan Content</button>}
          {props.variant === "calendar" && props.onCreatePost && <button type="button" onClick={props.onCreatePost} className="min-h-11 rounded-lg bg-[#0058bc] px-4 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">+ Create Post</button>}
          {props.variant === "planning-briefs" && props.canCreate && <PrimaryAction href="/calendar?newBrief=1">Create Planning Brief</PrimaryAction>}
          {props.variant === "post-drafts" && props.canCreate && <PrimaryAction href="/calendar?createPost=1">Create Post</PrimaryAction>}
        </div>
      </div>
    </header>
  );
}

function PrimaryAction({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0058bc] px-5 text-sm font-bold text-white outline-none hover:bg-[#004493] focus-visible:ring-2 focus-visible:ring-[#0058bc] focus-visible:ring-offset-2">{children}</Link>;
}
