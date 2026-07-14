"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SchedulePostDialog, type SchedulePostPayload } from "@/components/calendar/schedule-post-dialog";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import { readContentWorkflow, saveManualWorkflow } from "@/lib/calendar/content-workflow-store";
import type { ContentWorkflowItem } from "@/lib/calendar/content-workflow-types";

export default function NewContentPage() {
  const router = useRouter();
  const [existing, setExisting] = useState<ContentWorkflowItem>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      const editId = new URLSearchParams(window.location.search).get("edit");
      if (editId) setExisting(readContentWorkflow(window.localStorage).find((item) => item.id === editId && item.source === "create_post" && item.stage === "idea_draft"));
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  function save(payload: SchedulePostPayload) {
    saveManualWorkflow(window.localStorage, payload, existing);
    window.sessionStorage.setItem("content-list-message", existing ? "Idea Draft updated." : "Content saved to Content List as an Idea Draft.");
    router.push("/calendar/content");
  }

  if (!ready) return <main className="min-h-screen bg-[#f8f9ff] p-8"><p role="status" className="mx-auto max-w-[960px] text-sm font-bold text-[#657080]">Loading content form…</p></main>;
  return <SchedulePostDialog open presentation="page" pillars={initialCalendarState.pillars} initialPayload={existing?.manualInput} onClose={() => router.push("/calendar/content")} onSubmit={save} />;
}
