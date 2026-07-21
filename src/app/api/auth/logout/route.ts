import { NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth/constants";
import { revokeSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${authCookieName}=`))?.split("=")[1];
  await revokeSessionToken(token);

  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(authCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
