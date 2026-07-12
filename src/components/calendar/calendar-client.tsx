"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AiPlanDialog } from "@/components/calendar/ai-plan-dialog";
import { AiPlanItemDialog } from "@/components/calendar/ai-plan-item-dialog";
import { AiPlanResultDialog } from "@/components/calendar/ai-plan-result-dialog";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarLegend } from "@/components/calendar/calendar-legend";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { DayAgendaPopover } from "@/components/calendar/day-agenda-popover";
import { DeletePostDialog } from "@/components/calendar/delete-post-dialog";
import { EditPostDialog, type EditPostPayload } from "@/components/calendar/edit-post-dialog";
import { MonthGrid } from "@/components/calendar/month-grid";
import { PostDetailDrawer } from "@/components/calendar/post-detail-drawer";
import { ReschedulePostDialog, type ReschedulePostPayload } from "@/components/calendar/reschedule-post-dialog";
import { SchedulePostDialog, type SchedulePostPayload } from "@/components/calendar/schedule-post-dialog";
import { ScheduleUnscheduledIdeaDialog, type ScheduleUnscheduledIdeaPayload } from "@/components/calendar/schedule-unscheduled-idea-dialog";
import { DeleteUnscheduledIdeaDialog } from "@/components/calendar/delete-unscheduled-idea-dialog";
import { UnscheduledIdeaDialog, type UnscheduledIdeaFormPayload } from "@/components/calendar/unscheduled-idea-dialog";
import { UnscheduledIdeasPanel } from "@/components/calendar/unscheduled-ideas-panel";
import { WeekGrid } from "@/components/calendar/week-grid";
import { initialCalendarState } from "@/lib/calendar/mock-data";
import type { AiPlanRequest } from "@/lib/calendar/ai-plan-types";
import { derivePlanTime, detectAiPlanConflicts, generateMockAiPlan, getAvailablePlanDates } from "@/lib/calendar/ai-plan-generator";
import type { AiPlanDraftItem } from "@/lib/calendar/ai-plan-result-types";
import { platformAssetTypes } from "@/lib/calendar/platform-options";
import { initialUnscheduledIdeas } from "@/lib/calendar/unscheduled-idea-mock-data";
import { filterUnscheduledIdeas, sortUnscheduledIdeas } from "@/lib/calendar/unscheduled-idea-utils";
import type { UnscheduledIdea, UnscheduledIdeaFilters } from "@/lib/calendar/unscheduled-idea-types";
import { calendarReducer } from "@/lib/calendar/reducer";
import { getCalendarEvents, getFilteredVersions, getIdeaById, getPillarById, getVersionById } from "@/lib/calendar/selectors";
import type { ContentVersion } from "@/lib/calendar/types";

const today = "2026-07-11";
type PostAction = "edit" | "reschedule" | "delete";
type UnscheduledIdeaAction = "create" | "edit" | "schedule" | "delete";
const navItems = [["Dashboard", "/dashboard"], ["Brands", "/brands"], ["Campaigns", "/campaigns"], ["Content Calendar", "/calendar"], ["Assets", "/assets"], ["Analytics", "/analytics"]] as const;

export function CalendarClient() {
  const [state, dispatch] = useReducer(calendarReducer, initialCalendarState);
  const [agendaDate, setAgendaDate] = useState<string>();
  const [activePostAction, setActivePostAction] = useState<PostAction>();
  const [actionVersionId, setActionVersionId] = useState<string>();
  const [pendingAiPlanRequest, setPendingAiPlanRequest] = useState<AiPlanRequest>();
  const [pendingAiPlanResult, setPendingAiPlanResult] = useState<AiPlanDraftItem[]>([]);
  const [aiPlanResultOpen, setAiPlanResultOpen] = useState(false);
  const [aiPlanGenerating, setAiPlanGenerating] = useState(false);
  const [activeAiPlanItemId, setActiveAiPlanItemId] = useState<string>();
  const [aiPlanItemMode, setAiPlanItemMode] = useState<"create" | "edit">();
  const [aiApprovalError, setAiApprovalError] = useState("");
  const aiGenerationTimerRef = useRef<number | undefined>(undefined);
  const manualAiItemCounterRef = useRef(0);
  const [unscheduledIdeas, setUnscheduledIdeas] = useState<UnscheduledIdea[]>(initialUnscheduledIdeas);
  const [unscheduledIdeaFilters, setUnscheduledIdeaFilters] = useState<UnscheduledIdeaFilters>({ search: "", pillarId: "all", platform: "all", source: "all" });
  const [activeUnscheduledAction, setActiveUnscheduledAction] = useState<UnscheduledIdeaAction>();
  const [activeUnscheduledIdeaId, setActiveUnscheduledIdeaId] = useState<string>();
  const drawerTriggerRef = useRef<HTMLElement | null>(null);
  const filteredVersions = getFilteredVersions(state);
  const calendarEvents = getCalendarEvents(state);
  const creators = useMemo(() => [...new Set(state.versions.map((version) => version.createdBy))].sort(), [state.versions]);
  const agendaEvents = agendaDate ? calendarEvents.filter((event) => event.publishDate === agendaDate) : [];
  const filtersActive = Object.values(state.filters).some((value) => value !== "all");
  const selectedVersion = state.selectedVersionId ? getVersionById(state, state.selectedVersionId) : undefined;
  const selectedIdea = selectedVersion ? getIdeaById(state, selectedVersion.contentIdeaId) : undefined;
  const selectedPillar = selectedIdea ? getPillarById(state, selectedIdea.pillarId) : undefined;
  const actionVersion = actionVersionId ? getVersionById(state, actionVersionId) : undefined;
  const actionIdea = actionVersion ? getIdeaById(state, actionVersion.contentIdeaId) : undefined;
  const siblingVersions = actionIdea ? state.versions.filter((version) => version.contentIdeaId === actionIdea.id) : [];
  const activeAiPlanItem = activeAiPlanItemId ? pendingAiPlanResult.find((item) => item.id === activeAiPlanItemId) : undefined;
  const aiPlanItem = aiPlanItemMode === "create" && pendingAiPlanRequest && activeAiPlanItemId ? createManualAiItem(pendingAiPlanRequest, state.pillars, activeAiPlanItemId) : activeAiPlanItem;
  const visibleUnscheduledIdeas = sortUnscheduledIdeas(filterUnscheduledIdeas(unscheduledIdeas, unscheduledIdeaFilters));
  const activeUnscheduledIdea = activeUnscheduledIdeaId ? unscheduledIdeas.find((idea) => idea.id === activeUnscheduledIdeaId) : undefined;

  useEffect(() => () => { if (aiGenerationTimerRef.current !== undefined) window.clearTimeout(aiGenerationTimerRef.current); }, []);

  function openEvent(versionId: string) {
    drawerTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setAgendaDate(undefined);
    dispatch({ type: "OPEN_POST_DETAIL", payload: versionId });
  }

  function handleSchedulePost(payload: SchedulePostPayload) {
    const suffix = Date.now().toString();
    const timestamp = new Date().toISOString();
    const ideaId = `idea-${suffix}`;
    dispatch({
      type: "ADD_IDEA",
      payload: { id: ideaId, ...payload.idea, createdAt: timestamp, updatedAt: timestamp },
    });
    for (const version of payload.versions) {
      dispatch({
        type: "ADD_VERSION",
        payload: {
          id: `version-${version.platform}-${suffix}`,
          contentIdeaId: ideaId,
          ...version,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      });
    }
    dispatch({ type: "CLOSE_SCHEDULE_DIALOG" });
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
    setPendingAiPlanRequest(request);
    dispatch({ type: "CLOSE_AI_PLAN_DIALOG" });
  }

  function runAiGeneration(request: AiPlanRequest) {
    if (aiGenerationTimerRef.current !== undefined) window.clearTimeout(aiGenerationTimerRef.current);
    setAiPlanResultOpen(true); setAiPlanGenerating(true); setPendingAiPlanResult([]); setAiApprovalError("");
    aiGenerationTimerRef.current = window.setTimeout(() => {
      setPendingAiPlanResult(generateMockAiPlan(request, state.pillars, state.versions));
      setAiPlanGenerating(false); aiGenerationTimerRef.current = undefined;
    }, 800);
  }

  function handleGenerateAiPlan(request: AiPlanRequest) {
    setPendingAiPlanRequest(request);
    dispatch({ type: "CLOSE_AI_PLAN_DIALOG" });
    runAiGeneration(request);
  }

  function closeAiResult() { if (aiGenerationTimerRef.current !== undefined) window.clearTimeout(aiGenerationTimerRef.current); aiGenerationTimerRef.current = undefined; setAiPlanGenerating(false); setAiPlanResultOpen(false); setAiPlanItemMode(undefined); setActiveAiPlanItemId(undefined); }
  function recalculate(items: AiPlanDraftItem[]) { return detectAiPlanConflicts(items, state.versions); }
  function saveAiPlanItem(item: AiPlanDraftItem) { const next = aiPlanItemMode === "edit" ? pendingAiPlanResult.map((current) => current.id === item.id ? item : current) : [...pendingAiPlanResult, item]; setPendingAiPlanResult(recalculate(next)); setAiPlanItemMode(undefined); setActiveAiPlanItemId(undefined); setAiApprovalError(""); }
  function removeAiPlanItem(id: string) { setPendingAiPlanResult((current) => recalculate(current.filter((item) => item.id !== id))); setAiApprovalError(""); }
  function openCreateAiItem() { manualAiItemCounterRef.current += 1; setActiveAiPlanItemId(`ai-plan-manual-${manualAiItemCounterRef.current}`); setAiPlanItemMode("create"); }

  function approveAiPlan() {
    const selected = pendingAiPlanResult.filter((item) => item.selected);
    if (!selected.length) return setAiApprovalError("Select at least one plan item.");
    if (selected.some((item) => item.conflicts.length)) return setAiApprovalError("Resolve schedule conflicts before approving selected posts.");
    const suffix = Date.now().toString(); const timestamp = new Date().toISOString();
    selected.forEach((item, index) => { const ideaId = `idea-ai-${suffix}-${index + 1}`; dispatch({ type: "ADD_IDEA", payload: { id: ideaId, title: item.title, coreTopic: item.coreTopic, pillarId: item.pillarId, objective: item.objective, targetAudience: item.targetAudience, mainMessage: item.mainMessage, creationSource: "ai", createdAt: timestamp, updatedAt: timestamp } }); dispatch({ type: "ADD_VERSION", payload: { id: `version-ai-${item.platform}-${suffix}-${index + 1}`, contentIdeaId: ideaId, platform: item.platform, assetType: item.assetType, headline: item.headline, caption: item.caption, cta: item.cta, hashtags: item.hashtags, visualBrief: item.visualBrief, publishDate: item.publishDate, publishTime: item.publishTime, timezone: item.timezone, status: "draft", createdBy: "AI Planner", createdAt: timestamp, updatedAt: timestamp } }); });
    setPendingAiPlanResult([]); setAiPlanResultOpen(false); setAiPlanItemMode(undefined); setActiveAiPlanItemId(undefined); setAiApprovalError("");
  }

  function editAiBrief() { closeAiResult(); dispatch({ type: "OPEN_AI_PLAN_DIALOG" }); }

  function openUnscheduledAction(action: UnscheduledIdeaAction, ideaId?: string) {
    setAgendaDate(undefined); dispatch({ type: "CLOSE_POST_DETAIL" }); dispatch({ type: "CLOSE_SCHEDULE_DIALOG" }); dispatch({ type: "CLOSE_AI_PLAN_DIALOG" });
    setActivePostAction(undefined); setActionVersionId(undefined); closeAiResult();
    setActiveUnscheduledIdeaId(ideaId); setActiveUnscheduledAction(action);
  }
  function closeUnscheduledAction() { setActiveUnscheduledAction(undefined); setActiveUnscheduledIdeaId(undefined); }
  function saveUnscheduledIdea(payload: UnscheduledIdeaFormPayload) { const timestamp=new Date().toISOString(); if(activeUnscheduledAction==="edit"&&activeUnscheduledIdea){setUnscheduledIdeas(current=>current.map(idea=>idea.id===activeUnscheduledIdea.id?{...idea,...payload,id:idea.id,createdAt:idea.createdAt,updatedAt:timestamp}:idea));}else{setUnscheduledIdeas(current=>[{...payload,id:`unscheduled-idea-${Date.now()}`,createdAt:timestamp,updatedAt:timestamp},...current]);}closeUnscheduledAction(); }
  function deleteUnscheduledIdea() { if(activeUnscheduledIdeaId)setUnscheduledIdeas(current=>current.filter(idea=>idea.id!==activeUnscheduledIdeaId)); closeUnscheduledAction(); }
  function scheduleUnscheduledIdea(payload: ScheduleUnscheduledIdeaPayload) { const suffix=Date.now().toString();const timestamp=new Date().toISOString();const ideaId=`idea-unscheduled-${suffix}`;dispatch({type:"ADD_IDEA",payload:{id:ideaId,title:payload.idea.title,coreTopic:payload.idea.coreTopic,pillarId:payload.idea.pillarId,objective:payload.idea.objective,targetAudience:payload.idea.targetAudience,mainMessage:payload.idea.mainMessage,campaignId:payload.idea.campaignId,creationSource:payload.idea.creationSource,createdAt:timestamp,updatedAt:timestamp}});payload.versions.forEach((version,index)=>dispatch({type:"ADD_VERSION",payload:{id:`version-unscheduled-${version.platform}-${suffix}-${index+1}`,contentIdeaId:ideaId,...version,createdAt:timestamp,updatedAt:timestamp}}));if(payload.removeAfterScheduling)setUnscheduledIdeas(current=>current.filter(idea=>idea.id!==payload.idea.id));closeUnscheduledAction(); }

  return <main className="min-h-screen overflow-x-hidden bg-[#f8f9ff] text-[#0b1c30] lg:pl-64">
    <CalendarSidebar />
    <section className="min-h-screen">
      <CalendarHeader view={state.view} onViewChange={(view) => dispatch({ type: "SET_VIEW", payload: view })} onSchedulePost={() => dispatch({ type: "OPEN_SCHEDULE_DIALOG" })} onOpenAiPlan={openAiPlan} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <CalendarToolbar view={state.view} currentDate={state.currentDate} filters={state.filters} pillars={state.pillars} creators={creators} onPrevious={() => dispatch({ type: "GO_TO_PREVIOUS_PERIOD" })} onNext={() => dispatch({ type: "GO_TO_NEXT_PERIOD" })} onToday={() => dispatch({ type: "GO_TO_TODAY", payload: today })} onFilterChange={(key, value) => dispatch({ type: "SET_FILTER", payload: { key, value } })} onResetFilters={() => dispatch({ type: "RESET_FILTERS" })} />
        <CalendarLegend pillars={state.pillars} />
        {filteredVersions.length === 0 && <div role="status" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d3e4fe] bg-white px-4 py-3 text-sm text-[#657080]"><span>No content matches the selected filters.</span><button type="button" disabled={!filtersActive} onClick={() => dispatch({ type: "RESET_FILTERS" })} className="font-bold text-[#0058bc] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#0058bc]">Reset filters</button></div>}
        {state.view === "month" ? <MonthGrid currentDate={state.currentDate} events={calendarEvents} today={today} onEventClick={openEvent} onMoreClick={setAgendaDate} /> : <WeekGrid currentDate={state.currentDate} events={calendarEvents} today={today} onEventClick={openEvent} />}
        <UnscheduledIdeasPanel ideas={visibleUnscheduledIdeas} totalCount={unscheduledIdeas.length} filters={unscheduledIdeaFilters} pillars={state.pillars} onFilterChange={(key,value)=>setUnscheduledIdeaFilters(current=>({...current,[key]:value}))} onResetFilters={()=>setUnscheduledIdeaFilters({search:"",pillarId:"all",platform:"all",source:"all"})} onCreate={()=>openUnscheduledAction("create")} onEdit={(id)=>openUnscheduledAction("edit",id)} onSchedule={(id)=>openUnscheduledAction("schedule",id)} onDelete={(id)=>openUnscheduledAction("delete",id)} />
      </div>
    </section>
    <DayAgendaPopover date={agendaDate} events={agendaEvents} onEventClick={openEvent} onClose={() => setAgendaDate(undefined)} />
    <PostDetailDrawer open={state.postDetailDrawerOpen} version={selectedVersion} idea={selectedIdea} pillar={selectedPillar} returnFocusRef={drawerTriggerRef} onClose={() => dispatch({ type: "CLOSE_POST_DETAIL" })} onEdit={(id) => openPostAction("edit", id)} onDuplicate={handleDuplicatePost} onReschedule={(id) => openPostAction("reschedule", id)} onDelete={(id) => openPostAction("delete", id)} />
    {state.scheduleDialogOpen && <SchedulePostDialog open pillars={state.pillars} defaultDate={state.selectedDate ?? state.currentDate} onClose={() => dispatch({ type: "CLOSE_SCHEDULE_DIALOG" })} onSubmit={handleSchedulePost} />}
    {activePostAction === "edit" && <EditPostDialog open idea={actionIdea} version={actionVersion} pillars={state.pillars} onClose={() => closePostAction()} onSubmit={handleEditPost} />}
    {activePostAction === "reschedule" && <ReschedulePostDialog open idea={actionIdea} version={actionVersion} onClose={() => closePostAction()} onSubmit={handleReschedulePost} />}
    {activePostAction === "delete" && <DeletePostDialog open idea={actionIdea} version={actionVersion} siblingVersionCount={siblingVersions.length} onClose={() => closePostAction()} onConfirm={handleDeletePost} />}
    {state.aiPlanDialogOpen && <AiPlanDialog open pillars={state.pillars} defaultStartDate={state.currentDate} initialRequest={pendingAiPlanRequest} onClose={() => dispatch({ type: "CLOSE_AI_PLAN_DIALOG" })} onSubmit={handleSaveAiPlanRequest} onGenerate={handleGenerateAiPlan} />}
    {aiPlanResultOpen && !aiPlanItemMode && <AiPlanResultDialog open loading={aiPlanGenerating} request={pendingAiPlanRequest} items={pendingAiPlanResult} pillars={state.pillars} approvalError={aiApprovalError} onClose={closeAiResult} onRegenerate={() => pendingAiPlanRequest && runAiGeneration(pendingAiPlanRequest)} onEditBrief={editAiBrief} onToggleItem={(id, selected) => { setPendingAiPlanResult((current) => current.map((item) => item.id === id ? { ...item, selected } : item)); setAiApprovalError(""); }} onSelectAll={() => setPendingAiPlanResult((current) => current.map((item) => ({ ...item, selected: true })))} onClearSelection={() => setPendingAiPlanResult((current) => current.map((item) => ({ ...item, selected: false })))} onEditItem={(id) => { setActiveAiPlanItemId(id); setAiPlanItemMode("edit"); }} onRemoveItem={removeAiPlanItem} onAddItem={openCreateAiItem} onApproveSelected={approveAiPlan} />}
    {aiPlanItemMode && <AiPlanItemDialog open mode={aiPlanItemMode} item={aiPlanItem} request={pendingAiPlanRequest} pillars={state.pillars} onClose={() => { setAiPlanItemMode(undefined); setActiveAiPlanItemId(undefined); }} onSubmit={saveAiPlanItem} />}
    {(activeUnscheduledAction==="create"||activeUnscheduledAction==="edit")&&<UnscheduledIdeaDialog open mode={activeUnscheduledAction} idea={activeUnscheduledIdea} pillars={state.pillars} onClose={closeUnscheduledAction} onSubmit={saveUnscheduledIdea}/>} 
    {activeUnscheduledAction==="schedule"&&<ScheduleUnscheduledIdeaDialog open idea={activeUnscheduledIdea} pillars={state.pillars} defaultDate={state.currentDate} onClose={closeUnscheduledAction} onSubmit={scheduleUnscheduledIdea}/>} 
    {activeUnscheduledAction==="delete"&&<DeleteUnscheduledIdeaDialog open idea={activeUnscheduledIdea} pillar={state.pillars.find(pillar=>pillar.id===activeUnscheduledIdea?.pillarId)} onClose={closeUnscheduledAction} onConfirm={deleteUnscheduledIdea}/>} 
  </main>;
}

function createManualAiItem(request: AiPlanRequest, pillars: import("@/lib/calendar/types").ContentPillar[], id: string): AiPlanDraftItem | undefined {
  const dates = getAvailablePlanDates(request); const platform = request.platforms[0]; const pillar = pillars.find((value) => request.pillarIds.includes(value.id));
  if (!dates[0] || !platform || !pillar) return undefined;
  return { id, selected: true, title: "Manual Draft Content Idea", coreTopic: `Content for ${request.targetAudience}`, pillarId: pillar.id, objective: request.objective, targetAudience: request.targetAudience, mainMessage: "A manually added item for this draft plan.", isPromotional: false, platform, assetType: platformAssetTypes[platform][0], headline: "New Draft Post", caption: "Draft caption ready for refinement.", cta: "Learn more", hashtags: ["contentplan", platform], visualBrief: `Create a clear ${platform} visual.`, publishDate: dates[0], publishTime: derivePlanTime(request.preferredTimes, 0), timezone: "Asia/Jakarta", conflicts: [] };
}

function CalendarSidebar() {
  return <aside className="border-b border-[#d3e4fe] bg-white lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:flex lg:h-full lg:w-64 lg:flex-col lg:border-b-0 lg:border-r"><div className="px-4 py-4"><Link className="flex items-center gap-3" href="/dashboard"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0058bc] font-black text-white">✓</span><span><span className="block text-base font-extrabold text-[#0058bc]">AI Marketing OS</span><span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#717786]">Enterprise Suite</span></span></Link></div><nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:mt-4 lg:flex-1 lg:flex-col lg:overflow-visible">{navItems.map(([label, href]) => <Link key={href} href={href} className={`inline-flex shrink-0 rounded-lg px-4 py-3 text-sm font-bold ${href === "/calendar" ? "bg-[#0070eb] text-white" : "text-[#414755] hover:bg-[#eff4ff]"}`}>{label}</Link>)}</nav><div className="hidden border-t border-[#d3e4fe] p-4 lg:block"><Link href="/campaigns" className="block rounded-lg bg-[#4648d4] px-4 py-3 text-center text-sm font-bold text-white">+ New Campaign</Link></div></aside>;
}
