import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { authCookieName } from "@/lib/auth/constants";
import { createAuthSession, getClientIp, getCookieOptions } from "@/lib/auth/session";
import { validateLoginPayload } from "@/lib/auth/validation";

export async function POST(request: Request) {
  const validation = validateLoginPayload(await readBody(request));
  if (!validation.ok) return NextResponse.json({ message: validation.message, field: validation.field }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: validation.data.email } });
  const valid = await verifyPassword(validation.data.password, user?.passwordHash);
  if (!user || !valid) return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });

  const session = await createAuthSession({
    userId: user.id,
    remember: validation.data.remember,
    userAgent: request.headers.get("user-agent"),
    ipAddress: getClientIp(request),
  });

  const response = NextResponse.json({
    message: "Logged in",
    user: { id: user.id, email: user.email, name: user.name, initials: user.initials, role: user.role },
  });
  response.cookies.set(authCookieName, session.token, getCookieOptions(session.expiresAt));
  return response;
}

async function readBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
