import { NextResponse, type NextRequest } from "next/server";
import { authCookieName } from "@/lib/auth/constants";

const protectedPagePrefixes = [
  "/analytics",
  "/approval",
  "/assets",
  "/brain",
  "/brands",
  "/calendar",
  "/campaigns",
  "/content",
  "/dashboard",
  "/downloads",
  "/editor",
  "/knowledge",
  "/library",
  "/onboarding",
  "/pricing",
  "/schedule",
  "/settings",
  "/team",
  "/trends",
];

const protectedApiPrefixes = [
  "/api/assets",
  "/api/brands",
  "/api/calendar",
  "/api/campaign",
  "/api/campaigns",
  "/api/caption",
  "/api/dashboard",
  "/api/downloads",
  "/api/image",
  "/api/video",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSessionCookie = Boolean(request.cookies.get(authCookieName)?.value);
  const isProtectedApi = protectedApiPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isProtectedPage = protectedPagePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (hasSessionCookie || (!isProtectedApi && !isProtectedPage)) return NextResponse.next();

  if (isProtectedApi) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
