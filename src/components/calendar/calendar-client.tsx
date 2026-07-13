"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { Dispatch } from "react";
import { AiPlanDialog } from "@/components/calendar/ai-plan-dialog";
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
import { SchedulePostDialog, type SchedulePostPayload } from "@/components/calendar/schedule-post-dialog";
import { WeekGrid } from "@/components/calendar/week-grid";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";
import { generateMockAiPlan } from "@/lib/calendar/ai-plan-generator";
import { createGeneratedPlan, getGeneratedPlanByBriefId, getGeneratedPlanById, readGeneratedPlans, saveGeneratedPlan } from "@/lib/calendar/generated-plan-store";
import type { GeneratedDraftPlan, GeneratedDraftPlanItem } from "@/lib/calendar/generated-plan-types";
import { getGeneratedItemScheduleIssue, getGeneratedItemTime } from "@/lib/calendar/generated-plan-utils";
import { readPlanningBriefs, savePlanningBrief } from "@/lib/calendar/planning-brief-store";
import { activePlanningBriefPermissions, getPlanningBriefPermissions } from "@/lib/calendar/planning-brief-permissions";
import type { PlanningBrief } from "@/lib/calendar/planning-brief-types";
import { getManualPostById, manualPostToInput, readManualPosts, saveManualPostDraft } from "@/lib/calendar/manual-post-store";
import { activeManualPostPermissions } from "@/lib/calendar/manual-post-permissions";
import type { ManualPostDraft } from "@/lib/calendar/manual-post-types";
import { calendarReducer, type CalendarAction } from "@/lib/calendar/reducer";
import { getCalendarEvents, getFilteredVersions, getIdeaById, getPillarById, getVersionById } from "@/lib/calendar/selectors";
import type { CalendarState, ContentIdea, ContentVersion } from "@/lib/calendar/types";

const today = "2026-07-11";
const planningBriefPermissions = activePlanningBriefPermissions;
const planningBriefViewerPermissions = getPlanningBriefPermissions("viewer");
type PostAction = "edit" | "reschedule" | "delete";

export function CalendarClient() {
  const router = useRouter();
  const [state, dispatch] = useReducer(calendarReducer, initialCalendarState);
  const [agendaDate, setAgendaDate] = useState<string>();
  const [activePostAction, setActivePostAction] = useState<PostAction>();
  const [actionVersionId, setActionVersionId] = useState<string>();
  const [pendingAiPlanRequest, setPendingAiPlanRequest] = useState<AiPlanRequest>();
  const [editingPlanningBrief, setEditingPlanningBrief] = useState<PlanningBrief>();
  const [editingManualPost, setEditingManualPost] = useState<ManualPostDraft>();
  const [activeGeneratedPlan, setActiveGeneratedPlan] = useState<GeneratedDraftPlan>();
  const [storedGeneratedPlans, setStoredGeneratedPlans] = useState<GeneratedDraftPlan[]>([]);
  const [storedPlanningBriefs, setStoredPlanningBriefs] = useState<PlanningBrief[]>([]);
  const [pendingAiPlanResult, setPendingAiPlanResult] = useState<GeneratedDraftPlanItem[]>([]);
  const [aiPlanResultOpen, setAiPlanResultOpen] = useState(false);
  const [aiPlanMessage, setAiPlanMessage] = useState("");
  const [focusedGeneratedItemId, setFocusedGeneratedItemId] = useState<string>();
  const [generatedPlanReadOnly, setGeneratedPlanReadOnly] = useState(false);
  const [returnToPostVersionId, setReturnToPostVersionId] = useState<string>();
  const [sourcePlanningBriefId, setSourcePlanningBriefId] = useState<string>();
  const [newlyAddedVersionIds, setNewlyAddedVersionIds] = useState<ReadonlySet<string>>(() => new Set());
  const manualPostSaveRef = useRef(false);
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
      const editId = params.get("editBrief"); const generateId = params.get("generateBrief"); const viewPlanId = params.get("viewPlan"); const create = params.get("newBrief"); const editDraftId = params.get("editDraft"); const createPost = params.get("createPost"); const postId = params.get("post");
      const briefs = readPlanningBriefs(window.localStorage);
      const plans = readGeneratedPlans(window.localStorage);
      const manualPosts = readManualPosts(window.localStorage);
      setStoredPlanningBriefs(briefs);
      setStoredGeneratedPlans(plans);
      restoreGeneratedCalendarPosts(plans, dispatch);
      restoreManualCalendarPosts(manualPosts, dispatch);
      if (generateId && !planningBriefPermissions.canGenerate) return;
      if (editDraftId && activeManualPostPermissions.canEdit) { const post = getManualPostById(manualPosts, editDraftId); if (post && (post.status === "draft" || post.status === "changes_requested")) { setEditingManualPost(post); dispatch({ type: "OPEN_SCHEDULE_DIALOG" }); } }
      else if (postId) { const post = manualPosts.find((item) => item.versions.some((version) => version.id === postId) && item.status === "scheduled"); const version = post?.versions.find((item) => item.id === postId); if (version) { dispatch({ type: "SET_CURRENT_DATE", payload: version.publishDate }); dispatch({ type: "OPEN_POST_DETAIL", payload: version.id }); } }
      else if (editId) { const brief = briefs.find((item) => item.id === editId && (item.status === "draft" || item.status === "changes_requested")); if (brief) { setEditingPlanningBrief(brief); setPendingAiPlanRequest(brief.request); dispatch({ type: "OPEN_AI_PLAN_DIALOG" }); } }
      else if (generateId) { const brief = briefs.find((item) => item.id === generateId && item.status === "approved"); if (brief) { const plan = getGeneratedPlanByBriefId(plans, brief.id) ?? createGeneratedPlan(window.localStorage, brief, generateMockAiPlan(brief.request, initialCalendarState.pillars, initialCalendarState.versions)); setStoredGeneratedPlans((current) => upsertGeneratedPlan(current, plan)); setPendingAiPlanRequest(brief.request); setActiveGeneratedPlan(plan); setPendingAiPlanResult(plan.items); setGeneratedPlanReadOnly(false); setAiPlanResultOpen(true); } }
      else if (viewPlanId) { const plan = getGeneratedPlanById(plans, viewPlanId); setActiveGeneratedPlan(plan); setPendingAiPlanResult(plan?.items ?? []); setGeneratedPlanReadOnly(false); setAiPlanResultOpen(true); }
      else if (create) dispatch({ type: "OPEN_AI_PLAN_DIALOG" });
      else if (createPost && activeManualPostPermissions.canCreate) dispatch({ type: "OPEN_SCHEDULE_DIALOG" });
    });
    return () => { active = false; };
  }, []);

  function openEvent(versionId: string) {
    drawerTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setNewlyAddedVersionIds((current) => current.has(versionId) ? new Set([...current].filter((id) => id !== versionId)) : current);
    setAgendaDate(undefined);
    dispatch({ type: "OPEN_POST_DETAIL", payload: versionId });
  }

  function handleSchedulePost(payload: SchedulePostPayload) {
    if (manualPostSaveRef.current) return;
    manualPostSaveRef.current = true;
    saveManualPostDraft(window.localStorage, payload, editingManualPost);
    window.sessionStorage.setItem("post-draft-message", "Post saved as draft.");
    setEditingManualPost(undefined);
    dispatch({ type: "CLOSE_SCHEDULE_DIALOG" });
    router.push("/calendar/drafts");
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

  function openAiPlan() {
    setAgendaDate(undefined);
    setActivePostAction(undefined);
    setActionVersionId(undefined);
    dispatch({ type: "CLOSE_POST_DETAIL" });
    dispatch({ type: "CLOSE_SCHEDULE_DIALOG" });
    dispatch({ type: "OPEN_AI_PLAN_DIALOG" });
  }

  function handleSaveAiPlanRequest(request: AiPlanRequest) {
    const brief = savePlanningBrief(window.localStorage, request, editingPlanningBrief);
    setStoredPlanningBriefs((current) => [brief, ...current.filter((item) => item.id !== brief.id)]);
    window.sessionStorage.setItem("planning-brief-message", editingPlanningBrief ? "Planning Brief updated." : "Planning Brief saved as Draft.");
    setPendingAiPlanRequest(request); setEditingPlanningBrief(undefined);
    dispatch({ type: "CLOSE_AI_PLAN_DIALOG" });
    router.push("/calendar/planning-briefs");
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

  function viewActivePlanInCalendar() {
    if (!activeGeneratedPlan) return;
    const targetItems = activeGeneratedPlan.items.filter((item) => item.calendarStatus === "added_to_calendar" && item.calendarPostId && !getGeneratedItemScheduleIssue(item)).sort((first, second) => first.publishDate.localeCompare(second.publishDate) || first.id.localeCompare(second.id));
    const target = targetItems[0];
    if (!target?.calendarPostId) return;
    const targetVersion = getVersionById(state, target.calendarPostId);
    const targetIdea = targetVersion ? getIdeaById(state, targetVersion.contentIdeaId) : undefined;
    if (targetVersion) revealTargetThroughFilters(state, targetVersion, targetIdea, dispatch);
    setNewlyAddedVersionIds(new Set(targetItems.flatMap((item) => item.calendarPostId ? [item.calendarPostId] : [])));
    setReturnToPostVersionId(undefined);
    setFocusedGeneratedItemId(undefined);
    setGeneratedPlanReadOnly(false);
    setAiPlanResultOpen(false);
    dispatch({ type: "SET_CURRENT_DATE", payload: target.publishDate });
  }

  function approveAiPlan() {
    if (!activeGeneratedPlan) return;
    const selected = pendingAiPlanResult.filter((item) => item.selected && item.calendarStatus === "not_added" && !item.calendarPostId);
    if (!selected.length || selected.some((item) => item.conflicts.length)) return;
    const valid = selected.filter((item) => !getGeneratedItemScheduleIssue(item));
    const invalidCount = selected.length - valid.length;
    if (!valid.length) { setAiPlanMessage(`${invalidCount} selected item${invalidCount === 1 ? " needs" : "s need"} a date or platform before it can be added.`); return; }
    const timestamp = new Date().toISOString();
    valid.forEach((item) => addGeneratedItemToCalendar(item, activeGeneratedPlan, timestamp, dispatch));
    const addedIds = new Set(valid.map((item) => item.id));
    const items = pendingAiPlanResult.map((item): GeneratedDraftPlanItem => addedIds.has(item.id) ? { ...item, selected: false, calendarStatus: "added_to_calendar", calendarPostId: generatedVersionId(item.id) } : item);
    const plan = saveGeneratedPlan(window.localStorage, { ...activeGeneratedPlan, items });
    setStoredGeneratedPlans((current) => upsertGeneratedPlan(current, plan));
    setActiveGeneratedPlan(plan); setPendingAiPlanResult(plan.items); setAiPlanMessage(formatApprovalResult(valid, invalidCount));
  }

  return <>
    <CalendarWorkspaceShell header={<CalendarWorkspaceHeader variant="calendar" view={state.view} onViewChange={(view) => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "SET_VIEW", payload: view }); }} onCreatePost={activeManualPostPermissions.canCreate ? () => { manualPostSaveRef.current = false; setEditingManualPost(undefined); dispatch({ type: "OPEN_SCHEDULE_DIALOG" }); } : undefined} onOpenAiPlan={planningBriefPermissions.canCreate ? openAiPlan : undefined} />}>
        <CalendarToolbar view={state.view} currentDate={state.currentDate} filters={state.filters} pillars={state.pillars} creators={creators} onPrevious={() => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "GO_TO_PREVIOUS_PERIOD" }); }} onNext={() => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "GO_TO_NEXT_PERIOD" }); }} onToday={() => { setNewlyAddedVersionIds(new Set()); dispatch({ type: "GO_TO_TODAY", payload: today }); }} onFilterChange={(key, value) => dispatch({ type: "SET_FILTER", payload: { key, value } })} onResetFilters={() => dispatch({ type: "RESET_FILTERS" })} />
        <CalendarLegend pillars={state.pillars} />
        {filteredVersions.length === 0 && <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d3e4fe] bg-white px-4 py-3 text-sm text-[#657080]"><span>No content matches the selected filters.</span><button type="button" disabled={!filtersActive} onClick={() => dispatch({ type: "RESET_FILTERS" })} className="font-bold text-[#0058bc] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0058bc]">Reset filters</button></div>}
        {state.view === "month" ? <MonthGrid currentDate={state.currentDate} events={calendarEvents} highlightedVersionIds={newlyAddedVersionIds} today={today} onEventClick={openEvent} onMoreClick={setAgendaDate} /> : <WeekGrid currentDate={state.currentDate} events={calendarEvents} highlightedVersionIds={newlyAddedVersionIds} today={today} onEventClick={openEvent} />}
    </CalendarWorkspaceShell>
    <DayAgendaPopover date={agendaDate} events={agendaEvents} onEventClick={openEvent} onClose={() => setAgendaDate(undefined)} />
    <PostDetailDrawer open={state.postDetailDrawerOpen} version={selectedVersion} idea={selectedIdea} pillar={selectedPillar} generatedPlan={selectedGeneratedPlan} generatedItem={selectedGeneratedItem} planningBrief={selectedPlanningBrief} returnFocusRef={drawerTriggerRef} onClose={() => dispatch({ type: "CLOSE_POST_DETAIL" })} onEdit={(id) => openPostAction("edit", id)} onDuplicate={handleDuplicatePost} onReschedule={(id) => openPostAction("reschedule", id)} onDelete={(id) => openPostAction("delete", id)} onViewGeneratedPlan={viewGeneratedPlan} onViewPlanningBrief={viewPlanningBrief} />
    {state.scheduleDialogOpen && <SchedulePostDialog open pillars={state.pillars} defaultDate={state.selectedDate ?? state.currentDate} initialPayload={editingManualPost ? manualPostToInput(editingManualPost) : undefined} onClose={() => { const returnToDrafts = Boolean(editingManualPost); setEditingManualPost(undefined); dispatch({ type: "CLOSE_SCHEDULE_DIALOG" }); if (returnToDrafts) router.push("/calendar/drafts"); }} onSubmit={handleSchedulePost} />}
    {activePostAction === "edit" && <EditPostDialog open idea={actionIdea} version={actionVersion} pillars={state.pillars} onClose={() => closePostAction()} onSubmit={handleEditPost} />}
    {activePostAction === "reschedule" && <ReschedulePostDialog open idea={actionIdea} version={actionVersion} onClose={() => closePostAction()} onSubmit={handleReschedulePost} />}
    {activePostAction === "delete" && <DeletePostDialog open idea={actionIdea} version={actionVersion} siblingVersionCount={siblingVersions.length} onClose={() => closePostAction()} onConfirm={handleDeletePost} />}
    {state.aiPlanDialogOpen && <AiPlanDialog open pillars={state.pillars} defaultStartDate={state.currentDate} initialRequest={pendingAiPlanRequest} onClose={() => dispatch({ type: "CLOSE_AI_PLAN_DIALOG" })} onSubmit={handleSaveAiPlanRequest} />}
    {aiPlanResultOpen && <AiPlanResultDialog open plan={activeGeneratedPlan} items={pendingAiPlanResult} canApprove={!generatedPlanReadOnly} message={aiPlanMessage} focusedItemId={focusedGeneratedItemId} onViewInCalendar={activeGeneratedPlan?.items.some((item) => item.calendarStatus === "added_to_calendar" && item.calendarPostId) ? viewActivePlanInCalendar : undefined} onClose={closeAiResult} onToggleItem={(id, selected) => { if (generatedPlanReadOnly) return; setPendingAiPlanResult((current) => current.map((item) => item.id === id && item.calendarStatus === "not_added" ? { ...item, selected } : item)); setAiPlanMessage(""); }} onSelectAll={() => { if (!generatedPlanReadOnly) setPendingAiPlanResult((current) => current.map((item) => ({ ...item, selected: item.calendarStatus === "not_added" }))); }} onClearSelection={() => { if (!generatedPlanReadOnly) setPendingAiPlanResult((current) => current.map((item) => ({ ...item, selected: false }))); }} onApproveSelected={approveAiPlan} />}
    {sourcePlanningBrief && <PlanningBriefPreviewDrawer brief={sourcePlanningBrief} generatedPlan={getGeneratedPlanByBriefId(storedGeneratedPlans, sourcePlanningBrief.id)} permissions={planningBriefViewerPermissions} onClose={closeSourcePlanningBrief} onSubmit={() => undefined} onApprove={() => undefined} onRequestChanges={() => undefined} onViewGeneratedPlan={viewPlanFromSourcePlanningBrief} />}
  </>;
}

function generatedIdeaId(itemId: string) { return `idea-generated-${itemId}`; }
function generatedVersionId(itemId: string) { return `version-generated-${itemId}`; }
function addGeneratedItemToCalendar(item: GeneratedDraftPlanItem, plan: GeneratedDraftPlan, timestamp: string, dispatch: Dispatch<CalendarAction>) {
  const ideaId = generatedIdeaId(item.id); const versionId = generatedVersionId(item.id);
  dispatch({ type: "ADD_IDEA", payload: { id: ideaId, title: item.title, coreTopic: item.coreTopic, pillarId: item.pillarId, objective: item.objective, targetAudience: item.targetAudience, mainMessage: item.mainMessage, campaignId: plan.campaignId, campaignName: plan.campaignName, brandId: plan.brandId, brandName: plan.brandName, creationSource: "generated_plan", planningBriefId: plan.planningBriefId, generatedPlanId: plan.id, generatedPlanItemId: item.id, createdAt: timestamp, updatedAt: timestamp } });
  dispatch({ type: "ADD_VERSION", payload: { id: versionId, contentIdeaId: ideaId, platform: item.platform, assetType: item.assetType, headline: item.headline, caption: item.caption, cta: item.cta, hashtags: item.hashtags, visualBrief: item.visualBrief, publishDate: item.publishDate, publishTime: getGeneratedItemTime(item), timezone: item.timezone, status: "scheduled", createdBy: plan.generatedBy, planningBriefId: plan.planningBriefId, generatedPlanId: plan.id, generatedPlanItemId: item.id, createdAt: timestamp, updatedAt: timestamp } });
}
function restoreGeneratedCalendarPosts(plans: GeneratedDraftPlan[], dispatch: Dispatch<CalendarAction>) {
  for (const plan of plans) for (const item of plan.items) if (item.calendarStatus === "added_to_calendar" && item.calendarPostId && !getGeneratedItemScheduleIssue(item)) addGeneratedItemToCalendar(item, plan, plan.updatedAt, dispatch);
}
function restoreManualCalendarPosts(posts: ManualPostDraft[], dispatch: Dispatch<CalendarAction>) {
  for (const post of posts) if (post.status === "scheduled") { dispatch({ type: "ADD_IDEA", payload: { ...post.idea, approvalNote: post.approvalNote, submittedAt: post.submittedAt, submittedBy: post.submittedBy, approvedAt: post.approvedAt, approvedBy: post.approvedBy, changesRequestedAt: post.changesRequestedAt, changesRequestedBy: post.changesRequestedBy } }); for (const version of post.versions) dispatch({ type: "ADD_VERSION", payload: { ...version, status: "scheduled" } }); }
}

function upsertGeneratedPlan(plans: GeneratedDraftPlan[], plan: GeneratedDraftPlan): GeneratedDraftPlan[] { return [plan, ...plans.filter((item) => item.id !== plan.id)]; }
function revealTargetThroughFilters(state: CalendarState, version: ContentVersion, idea: ContentIdea | undefined, dispatch: Dispatch<CalendarAction>) {
  if (state.filters.platform !== "all" && state.filters.platform !== version.platform) dispatch({ type: "SET_FILTER", payload: { key: "platform", value: "all" } });
  if (state.filters.status !== "all" && state.filters.status !== version.status) dispatch({ type: "SET_FILTER", payload: { key: "status", value: "all" } });
  if (state.filters.createdBy !== "all" && state.filters.createdBy !== version.createdBy) dispatch({ type: "SET_FILTER", payload: { key: "createdBy", value: "all" } });
  if (idea && state.filters.pillarId !== "all" && state.filters.pillarId !== idea.pillarId) dispatch({ type: "SET_FILTER", payload: { key: "pillarId", value: "all" } });
}
function formatApprovalResult(items: GeneratedDraftPlanItem[], invalidCount: number): string {
  if (invalidCount) return `${items.length} post${items.length === 1 ? "" : "s"} added to Calendar. ${invalidCount} item${invalidCount === 1 ? " still needs" : "s still need"} schedule information.`;
  const dates = [...new Set(items.map((item) => item.publishDate))].sort();
  if (dates.length === 1) return `${items.length} post${items.length === 1 ? "" : "s"} added to Calendar on ${formatCalendarDate(dates[0])}.`;
  return `${items.length} post${items.length === 1 ? "" : "s"} added to Calendar for ${formatCalendarDateRange(dates[0], dates[dates.length - 1])}.`;
}
function parseCalendarDate(value: string): Date { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); }
function formatCalendarDate(value: string): string { return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(parseCalendarDate(value)); }
function formatCalendarDateRange(first: string, last: string): string {
  const start = parseCalendarDate(first); const end = parseCalendarDate(last);
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) return `${new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(start)}–${end.getDate()}, ${end.getFullYear()}`;
  return `${formatCalendarDate(first)}–${formatCalendarDate(last)}`;
}
