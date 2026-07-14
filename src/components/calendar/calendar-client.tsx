"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Dispatch } from "react";
import { AiPlanResultDialog } from "@/components/calendar/ai-plan-result-dialog";
import { CalendarWorkspaceHeader } from "@/components/calendar/calendar-workspace-header";
import { CalendarWorkspaceShell } from "@/components/calendar/calendar-workspace-shell";
import { CalendarLegend } from "@/components/calendar/calendar-legend";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { DayAgendaPopover } from "@/components/calendar/day-agenda-popover";
import { DeletePostDialog } from "@/components/calendar/delete-post-dialog";
import { EditPostDialog, type EditPostPayload } from "@/components/calendar/edit-post-dialog";
import { MonthGrid } from "@/components/calendar/month-grid";
import { PostDetailDrawer } from "@/components/calendar/post-detail-drawer";
import { PlanningBriefPreviewDrawer } from "@/components/calendar/planning-brief-preview-drawer";
import { ReschedulePostDialog, type ReschedulePostPayload } from "@/components/calendar/reschedule-post-dialog";
import { WeekGrid } from "@/components/calendar/week-grid";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import { generateMockAiPlan } from "@/lib/calendar/ai-plan-generator";
import { createGeneratedPlan, getGeneratedPlanByBriefId, getGeneratedPlanById, readGeneratedPlans } from "@/lib/calendar/generated-plan-store";
import type { GeneratedDraftPlan, GeneratedDraftPlanItem } from "@/lib/calendar/generated-plan-types";
import { readPlanningBriefs } from "@/lib/calendar/planning-brief-store";
import { activePlanningBriefPermissions, getPlanningBriefPermissions } from "@/lib/calendar/planning-brief-permissions";
import type { PlanningBrief } from "@/lib/calendar/planning-brief-types";
import { readManualPosts } from "@/lib/calendar/manual-post-store";
import { activeManualPostPermissions } from "@/lib/calendar/manual-post-permissions";
import { readContentWorkflow } from "@/lib/calendar/content-workflow-store";
import type { ContentWorkflowItem } from "@/lib/calendar/content-workflow-types";
import { calendarReducer, type CalendarAction } from "@/lib/calendar/reducer";
import { getCalendarEvents, getFilteredVersions, getIdeaById, getPillarById, getVersionById } from "@/lib/calendar/selectors";
import type { ContentVersion } from "@/lib/calendar/types";

const today = "2026-07-11";
const planningBriefPermissions = activePlanningBriefPermissions;
const planningBriefViewerPermissions = getPlanningBriefPermissions("viewer");
type PostAction = "edit" | "reschedule" | "delete";

export function CalendarClient() {
  const [state, dispatch] = useReducer(calendarReducer, initialCalendarState);
  const [agendaDate, setAgendaDate] = useState<string>();
  const [activePostAction, setActivePostAction] = useState<PostAction>();
  const [actionVersionId, setActionVersionId] = useState<string>();
  const [activeGeneratedPlan, setActiveGeneratedPlan] = useState<GeneratedDraftPlan>();
  const [storedGeneratedPlans, setStoredGeneratedPlans] = useState<GeneratedDraftPlan[]>([]);
  const [storedPlanningBriefs, setStoredPlanningBriefs] = useState<PlanningBrief[]>([]);
  const [pendingAiPlanResult, setPendingAiPlanResult] = useState<GeneratedDraftPlanItem[]>([]);
  const [aiPlanResultOpen, setAiPlanResultOpen] = useState(false);
  const [aiPlanMessage, setAiPlanMessage] = useState("");
  const [focusedGeneratedItemId, setFocusedGeneratedItemId] = useState<string>();
  const [, setGeneratedPlanReadOnly] = useState(false);
  const [returnToPostVersionId, setReturnToPostVersionId] = useState<string>();
  const [sourcePlanningBriefId, setSourcePlanningBriefId] = useState<string>();
  const [newlyAddedVersionIds, setNewlyAddedVersionIds] = useState<ReadonlySet<string>>(() => new Set());
  const drawerTriggerRef = useRef<HTMLElement | null>(null);
  const filteredVersions = getFilteredVersions(state);
  const calendarEvents = getCalendarEvents(state);
  const creators = useMemo(() => [...new Set(state.versions.map((version) => version.createdBy))].sort(), [state.versions]);
  const agendaEvents = agendaDate ? calendarEvents.filter((event) => event.publishDate === agendaDate) : [];
  const filtersActive = Object.values(state.filters).some((value) => value !== "all");
  const selectedVersion = state.selectedVersionId ? getVersionById(state, state.selectedVersionId) : undefined;
  const selectedIdea = selectedVersion ? getIdeaById(state, selectedVersion.contentIdeaId) : undefined;
  const selectedPillar = selectedIdea ? getPillarById(state, selectedIdea.pillarId) : undefined;
  const selectedGeneratedPlanId = selectedIdea?.generatedPlanId ?? selectedVersion?.generatedPlanId;
  const selectedGeneratedItemId = selectedIdea?.generatedPlanItemId ?? selectedVersion?.generatedPlanItemId;
  const selectedPlanningBriefId = selectedIdea?.planningBriefId ?? selectedVersion?.planningBriefId;
  const selectedGeneratedPlan = selectedGeneratedPlanId ? storedGeneratedPlans.find((plan) => plan.id === selectedGeneratedPlanId) : undefined;
  const selectedGeneratedItem = selectedGeneratedItemId ? selectedGeneratedPlan?.items.find((item) => item.id === selectedGeneratedItemId) : undefined;
  const selectedPlanningBrief = selectedPlanningBriefId ? storedPlanningBriefs.find((brief) => brief.id === selectedPlanningBriefId) : undefined;
  const sourcePlanningBrief = sourcePlanningBriefId ? storedPlanningBriefs.find((brief) => brief.id === sourcePlanningBriefId) : undefined;
  const actionVersion = actionVersionId ? getVersionById(state, actionVersionId) : undefined;
  const actionIdea = actionVersion ? getIdeaById(state, actionVersion.contentIdeaId) : undefined;
  const siblingVersions = actionIdea ? state.versions.filter((version) => version.contentIdeaId === actionIdea.id) : [];

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      if (!active) return;
      const params = new URLSearchParams(window.location.search);
      const generateId = params.get("generateBrief"); const viewPlanId = params.get("viewPlan"); const postId = params.get("post");
      const briefs = readPlanningBriefs(window.localStorage);
      const plans = readGeneratedPlans(window.localStorage);
      const manualPosts = readManualPosts(window.localStorage);
      const workflowItems = readContentWorkflow(window.localStorage);
      setStoredPlanningBriefs(briefs);
      setStoredGeneratedPlans(plans);
      restoreWorkflowCalendarPosts(workflowItems, dispatch);
      if (generateId && !planningBriefPermissions.canGenerate) return;
      if (postId) { const post = manualPosts.find((item) => item.versions.some((version) => version.id === postId) && item.status === "scheduled"); const version = post?.versions.find((item) => item.id === postId); if (version) { dispatch({ type: "SET_CURRENT_DATE", payload: version.publishDate }); dispatch({ type: "OPEN_POST_DETAIL", payload: version.id }); } }
      else if (generateId) { const brief = briefs.find((item) => item.id === generateId && item.status === "approved"); if (brief) { const plan = getGeneratedPlanByBriefId(plans, brief.id) ?? createGeneratedPlan(window.localStorage, brief, generateMockAiPlan(brief.request, initialCalendarState.pillars, initialCalendarState.versions)); setStoredGeneratedPlans((current) => upsertGeneratedPlan(current, plan)); setActiveGeneratedPlan(plan); setPendingAiPlanResult(plan.items); setGeneratedPlanReadOnly(false); setAiPlanResultOpen(true); } }
      else if (viewPlanId) { const plan = getGeneratedPlanById(plans, viewPlanId); setActiveGeneratedPlan(plan); setPendingAiPlanResult(plan?.items ?? []); setGeneratedPlanReadOnly(false); setAiPlanResultOpen(true); }
    });
    return () => { active = false; };
  }, []);

  function openEvent(versionId: string) {
    drawerTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setNewlyAddedVersionIds((current) => current.has(versionId) ? new Set([...current].filter((id) => id !== versionId)) : current);
    setAgendaDate(undefined);
    dispatch({ type: "OPEN_POST_DETAIL", payload: versionId });
  }

  function openPostAction(action: PostAction, versionId: string) {
    setAgendaDate(undefined);
    setActionVersionId(versionId);
    setActivePostAction(action);
    dispatch({ type: "CLOSE_POST_DETAIL" });
  }

  function closePostAction(reopenDrawer = true) {
    const versionId = actionVersionId;
    setActivePostAction(undefined);
    setActionVersionId(undefined);
    if (reopenDrawer && versionId && getVersionById(state, versionId)) dispatch({ type: "OPEN_POST_DETAIL", payload: versionId });
  }

  function handleEditPost(payload: EditPostPayload) {
    const timestamp = new Date().toISOString();
    dispatch({ type: "UPDATE_IDEA", payload: { ...payload.idea, updatedAt: timestamp } });
    dispatch({ type: "UPDATE_VERSION", payload: { ...payload.version, updatedAt: timestamp } });
    setActivePostAction(undefined); setActionVersionId(undefined);
    dispatch({ type: "OPEN_POST_DETAIL", payload: payload.version.id });
  }

  function handleDuplicatePost(versionId: string) {
    const original = getVersionById(state, versionId); if (!original) return;
    const suffix = Date.now().toString(); const timestamp = new Date().toISOString();
    const duplicate: ContentVersion = { ...original, id: `version-${original.platform}-${suffix}`, headline: `${original.headline} Copy`, status: "draft", createdAt: timestamp, updatedAt: timestamp };
    dispatch({ type: "DUPLICATE_VERSION", payload: duplicate });
    dispatch({ type: "OPEN_POST_DETAIL", payload: duplicate.id });
  }

  function handleReschedulePost(payload: ReschedulePostPayload) {
    const version = getVersionById(state, payload.versionId); if (!version) return closePostAction(false);
    const updated = { ...version, publishDate: payload.publishDate, publishTime: payload.publishTime, timezone: payload.timezone, status: payload.status, updatedAt: new Date().toISOString() };
    dispatch({ type: "UPDATE_VERSION", payload: updated });
    setActivePostAction(undefined); setActionVersionId(undefined);
    dispatch({ type: "OPEN_POST_DETAIL", payload: updated.id });
  }

  function handleDeletePost() {
    if (!actionVersion || !actionIdea) return closePostAction(false);
    if (siblingVersions.length <= 1) dispatch({ type: "DELETE_IDEA", payload: actionIdea.id });
    else dispatch({ type: "DELETE_VERSION", payload: actionVersion.id });
    closePostAction(false);
  }

  function closeAiResult() { const versionId = returnToPostVersionId; setAiPlanResultOpen(false); setAiPlanMessage(""); setFocusedGeneratedItemId(undefined); setGeneratedPlanReadOnly(false); setReturnToPostVersionId(undefined); if (versionId) dispatch({ type: "OPEN_POST_DETAIL", payload: versionId }); }

  function viewGeneratedPlan(planId: string, itemId: string, versionId: string) {
    const plan = storedGeneratedPlans.find((item) => item.id === planId);
    if (!plan) return;
    dispatch({ type: "CLOSE_POST_DETAIL" });
    setActiveGeneratedPlan(plan);
    setPendingAiPlanResult(plan.items.map((item) => ({ ...item, selected: false })));
    setFocusedGeneratedItemId(itemId);
    setGeneratedPlanReadOnly(true);
    setReturnToPostVersionId(versionId);
    setAiPlanMessage("");
    setAiPlanResultOpen(true);
  }

  function viewPlanningBrief(briefId: string, versionId: string) {
    if (!storedPlanningBriefs.some((brief) => brief.id === briefId)) return;
    dispatch({ type: "CLOSE_POST_DETAIL" });
    setReturnToPostVersionId(versionId);
    setSourcePlanningBriefId(briefId);
  }

  function closeSourcePlanningBrief() {
    const versionId = returnToPostVersionId;
    setSourcePlanningBriefId(undefined);
    setReturnToPostVersionId(undefined);
    if (versionId) dispatch({ type: "OPEN_POST_DETAIL", payload: versionId });
  }

  function viewPlanFromSourcePlanningBrief(planId: string) {
    const plan = storedGeneratedPlans.find((item) => item.id === planId);
    if (!plan) return;
    setSourcePlanningBriefId(undefined);
    setActiveGeneratedPlan(plan);
    setPendingAiPlanResult(plan.items.map((item) => ({ ...item, selected: false })));
    setFocusedGeneratedItemId(undefined);
    setGeneratedPlanReadOnly(true);
    setAiPlanMessage("");
    setAiPlanResultOpen(true);
  }

  return <>
    <CalendarWorkspaceShell header={<CalendarWorkspaceHeader variant="calendar" view={state.view} onViewChange={(view) => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "SET_VIEW", payload: view }); }} canCreatePost={activeManualPostPermissions.canCreate} canCreateAiPlan={planningBriefPermissions.canCreate} />}>
        <CalendarToolbar view={state.view} currentDate={state.currentDate} filters={state.filters} pillars={state.pillars} creators={creators} onPrevious={() => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "GO_TO_PREVIOUS_PERIOD" }); }} onNext={() => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "GO_TO_NEXT_PERIOD" }); }} onToday={() => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "GO_TO_TODAY", payload: today }); }} onFilterChange={(key, value) => dispatch({ type: "SET_FILTER", payload: { key, value } })} onResetFilters={() => dispatch({ type: "RESET_FILTERS" })} />
        <CalendarLegend pillars={state.pillars} />
        {filteredVersions.length === 0 && <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d3e4fe] bg-white px-4 py-3 text-sm text-[#657080]"><span>No content matches the selected filters.</span><button type="button" disabled={!filtersActive} onClick={() => dispatch({ type: "RESET_FILTERS" })} className="font-bold text-[#0058bc] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0058bc]">Reset filters</button></div>}
        {state.view === "month" ? <MonthGrid currentDate={state.currentDate} events={calendarEvents} highlightedVersionIds={newlyAddedVersionIds} today={today} onEventClick={openEvent} onMoreClick={setAgendaDate} /> : <WeekGrid currentDate={state.currentDate} events={calendarEvents} highlightedVersionIds={newlyAddedVersionIds} today={today} onEventClick={openEvent} />}
    </CalendarWorkspaceShell>
    <DayAgendaPopover date={agendaDate} events={agendaEvents} onEventClick={openEvent} onClose={() => setAgendaDate(undefined)} />
    <PostDetailDrawer open={state.postDetailDrawerOpen} version={selectedVersion} idea={selectedIdea} pillar={selectedPillar} generatedPlan={selectedGeneratedPlan} generatedItem={selectedGeneratedItem} planningBrief={selectedPlanningBrief} returnFocusRef={drawerTriggerRef} onClose={() => dispatch({ type: "CLOSE_POST_DETAIL" })} onEdit={(id) => openPostAction("edit", id)} onDuplicate={handleDuplicatePost} onReschedule={(id) => openPostAction("reschedule", id)} onDelete={(id) => openPostAction("delete", id)} onViewGeneratedPlan={viewGeneratedPlan} onViewPlanningBrief={viewPlanningBrief} />
    {activePostAction === "edit" && <EditPostDialog open idea={actionIdea} version={actionVersion} pillars={state.pillars} onClose={() => closePostAction()} onSubmit={handleEditPost} />}
    {activePostAction === "reschedule" && <ReschedulePostDialog open idea={actionIdea} version={actionVersion} onClose={() => closePostAction()} onSubmit={handleReschedulePost} />}
    {activePostAction === "delete" && <DeletePostDialog open idea={actionIdea} version={actionVersion} siblingVersionCount={siblingVersions.length} onClose={() => closePostAction()} onConfirm={handleDeletePost} />}
    {aiPlanResultOpen && <AiPlanResultDialog open plan={activeGeneratedPlan} items={pendingAiPlanResult} canApprove={false} message={aiPlanMessage || "Legacy generated plans are read-only. Use Content List for the CCA-606 workflow."} focusedItemId={focusedGeneratedItemId} onClose={closeAiResult} onToggleItem={() => undefined} onSelectAll={() => undefined} onClearSelection={() => undefined} onApproveSelected={() => undefined} />}
    {sourcePlanningBrief && <PlanningBriefPreviewDrawer brief={sourcePlanningBrief} generatedPlan={getGeneratedPlanByBriefId(storedGeneratedPlans, sourcePlanningBrief.id)} permissions={planningBriefViewerPermissions} onClose={closeSourcePlanningBrief} onSubmit={() => undefined} onApprove={() => undefined} onRequestChanges={() => undefined} onViewGeneratedPlan={viewPlanFromSourcePlanningBrief} />}
  </>;
}

function restoreWorkflowCalendarPosts(items: ContentWorkflowItem[], dispatch: Dispatch<CalendarAction>) {
  for (const item of items) {
    if (item.stage !== "scheduled") continue;
    item.drafts.forEach((draft, index) => {
      const ideaId = `workflow-idea-${item.id}-${index}`;
      const versionId = `workflow-version-${item.id}-${index}`;
      dispatch({ type: "ADD_IDEA", payload: { id: ideaId, title: draft.title, coreTopic: draft.coreTopic, pillarId: draft.pillarId, objective: draft.objective, targetAudience: draft.targetAudience, mainMessage: draft.mainMessage, campaignId: item.campaignId, campaignName: item.campaignName, brandId: item.brandId, brandName: item.brandName, ownerName: item.ownerName, approvedAt: item.approvedAt, approvedBy: item.approvedBy, creationSource: item.source === "ai_plan" ? "generated_plan" : "manual", createdAt: item.createdAt, updatedAt: item.updatedAt } });
      dispatch({ type: "ADD_VERSION", payload: { id: versionId, contentIdeaId: ideaId, platform: draft.platform, assetType: draft.assetType, headline: draft.headline, caption: draft.caption, cta: draft.cta, hashtags: draft.hashtags, visualBrief: draft.visualBrief, publishDate: draft.publishDate, publishTime: draft.publishTime, timezone: draft.timezone, status: "scheduled", createdBy: item.ownerName, createdAt: item.createdAt, updatedAt: item.updatedAt } });
    });
  }
}

function upsertGeneratedPlan(plans: GeneratedDraftPlan[], plan: GeneratedDraftPlan): GeneratedDraftPlan[] { return [plan, ...plans.filter((item) => item.id !== plan.id)]; }
