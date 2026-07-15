import { reserveRenderCredits } from "@/lib/billing/entitlements";
import { renderCreditUsageMock, workspaceSubscriptionMock } from "@/lib/billing/mock-data";
import { getRenderCreditsRemaining } from "@/lib/billing/selectors";

const IMAGE_RENDER_CREDITS = 10;
let renderCreditUsages = renderCreditUsageMock.map((usage) => ({ ...usage }));

export async function POST(
  request: Request,
  context: RouteContext<"/api/image/[id]/generate">,
) {
  const { id } = await context.params;
  if (request.headers.get("x-workspace-role") === "viewer") return Response.json({ message: "Viewers cannot start rendering.", code: "permission_denied" }, { status: 403 });
  const now = new Date().toISOString();
  const renderJobId = `image-${id}`;
  const reservation = reserveRenderCredits({
    subscription: workspaceSubscriptionMock,
    usages: renderCreditUsages,
    contentId: id,
    renderJobId,
    credits: IMAGE_RENDER_CREDITS,
    now,
  });

  if (!reservation.ok) {
    return Response.json({ message: reservation.message, code: reservation.code }, { status: 409 });
  }
  renderCreditUsages = reservation.usages;

  return Response.json({
    message: "Image generation queued",
    calendarItemId: id,
    renderJobId,
    status: "queued",
    creditUsage: reservation.usage,
    credits: getRenderCreditsRemaining(reservation.usages, workspaceSubscriptionMock),
  });
}
