"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SchedulePostDialog, type SchedulePostPayload } from "@/components/calendar/schedule-post-dialog";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import { readContentWorkflow, saveManualWorkflow, updateManualGeneratedIdeasFromInput } from "@/lib/calendar/content-workflow-store";
import type { ContentWorkflowItem } from "@/lib/calendar/content-workflow-types";

export default function NewContentPage() {
  const router = useRouter();
  const [existing, setExisting] = useState<ContentWorkflowItem>();
  const [editedIdeaId, setEditedIdeaId] = useState<string>();
  const [ready, setReady] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      const editId = new URLSearchParams(window.location.search).get("edit");
      const editIdeaId = new URLSearchParams(window.location.search).get("editIdea");
      const workflowId = editIdeaId ?? editId;
      if (workflowId) setExisting(readContentWorkflow(window.localStorage).find((item) => item.id === workflowId && item.source === "create_post" && (editIdeaId ? item.stage === "generated_ideas" : item.stage === "idea_draft")));
      setEditedIdeaId(new URLSearchParams(window.location.search).get("idea") ?? undefined);
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  function save(payload: SchedulePostPayload) {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const saved = existing?.stage === "generated_ideas"
      ? updateManualGeneratedIdeasFromInput(window.localStorage, existing, payload)
      : saveManualWorkflow(window.localStorage, payload, existing);
    const highlight = editedIdeaId && saved.ideas.some((idea) => idea.id === editedIdeaId) ? editedIdeaId : saved.ideas.find((idea) => idea.platform === payload.versions[0]?.platform)?.id;
    router.push(`/calendar/create-content/${encodeURIComponent(saved.id)}/ideas${highlight ? `?edited=${encodeURIComponent(highlight)}&saved=1` : ""}`);
  }

  const initialPayload = existing?.manualInput && editedIdeaId
    ? { ...existing.manualInput, versions: [...existing.manualInput.versions].sort((left, right) => Number(existing.ideas.find((idea) => idea.id === editedIdeaId)?.platform === right.platform) - Number(existing.ideas.find((idea) => idea.id === editedIdeaId)?.platform === left.platform)) }
    : existing?.manualInput;

  if (!ready) return <main className="min-h-screen bg-[#f8f9ff] p-8"><p role="status" className="mx-auto max-w-[960px] text-sm font-bold text-[#657080]">Loading content form…</p></main>;
  return <SchedulePostDialog open presentation="page" pillars={initialCalendarState.pillars} initialPayload={initialPayload} onClose={() => router.push(existing?.stage === "generated_ideas" ? `/calendar/create-content/${encodeURIComponent(existing.id)}/ideas` : "/calendar/content")} onSubmit={save} />;
}
