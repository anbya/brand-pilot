import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { authCookieName } from "@/lib/auth/constants";

const dayMs = 24 * 60 * 60 * 1000;

export type AuthUser = {
  id: string;
  email: string | null;
  name: string;
  initials: string;
  role: string;
};

export type AuthSession = {
  id: string;
  userId: string;
  expiresAt: Date;
  user: AuthUser;
};

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function getSessionMaxAge(remember: boolean) {
  return remember ? 30 * dayMs : dayMs;
}

export function getCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  };
}

export async function createAuthSession(options: {
  userId: string;
  remember: boolean;
  userAgent?: string | null;
  ipAddress?: string | null;
}) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + getSessionMaxAge(options.remember));
  const session = await prisma.authSession.create({
    data: {
      userId: options.userId,
      tokenHash: hashSessionToken(token),
      expiresAt,
      userAgent: options.userAgent || undefined,
      ipAddress: options.ipAddress || undefined,
    },
  });

  return { token, expiresAt, session };
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;
  if (!token) return null;
  return getSessionByToken(token);
}

export async function getSessionByToken(token: string): Promise<AuthSession | null> {
  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { user: true },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) return null;

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      initials: session.user.initials,
      role: session.user.role,
    },
  };
}

export async function revokeSessionToken(token: string | undefined) {
  if (!token) return;
  await prisma.authSession.updateMany({
    where: { tokenHash: hashSessionToken(token), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
}
