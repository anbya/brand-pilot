"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiPlanDialog } from "@/components/calendar/ai-plan-dialog";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import { readContentWorkflow, saveAiPlanWorkflow } from "@/lib/calendar/content-workflow-store";
import type { ContentWorkflowItem } from "@/lib/calendar/content-workflow-types";
import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";

export default function NewAiPlanPage() {
  const router = useRouter();
  const [existing, setExisting] = useState<ContentWorkflowItem>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      const editId = new URLSearchParams(window.location.search).get("edit");
      if (editId) setExisting(readContentWorkflow(window.localStorage).find((item) => item.id === editId && item.source === "ai_plan" && item.stage === "idea_draft"));
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  function save(request: AiPlanRequest) {
    saveAiPlanWorkflow(window.localStorage, request, existing);
    window.sessionStorage.setItem("content-list-message", existing ? "AI Plan Idea Draft updated." : "AI Plan saved to Content List as an Idea Draft.");
    router.push("/calendar/content");
  }

  if (!ready) return <main className="min-h-screen bg-[#f8f9ff] p-8"><p role="status" className="mx-auto max-w-[960px] text-sm font-bold text-[#657080]">Loading AI Plan form…</p></main>;
  return <AiPlanDialog open presentation="page" pillars={initialCalendarState.pillars} defaultStartDate="2026-07-11" initialRequest={existing?.aiRequest} onClose={() => router.push("/calendar/content")} onSubmit={save} />;
}
