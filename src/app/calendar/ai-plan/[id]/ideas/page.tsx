import { GeneratedIdeasPage } from "@/components/calendar/generated-ideas-page";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GeneratedIdeasPage workflowId={id} source="ai_plan" />;
}
