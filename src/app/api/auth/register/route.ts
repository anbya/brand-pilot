import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { authCookieName } from "@/lib/auth/constants";
import { createAuthSession, getClientIp, getCookieOptions } from "@/lib/auth/session";
import { initialsFromName, validateRegisterPayload } from "@/lib/auth/validation";

const defaultWorkspaceId = "workspace-brand-pilot";

export async function POST(request: Request) {
  const validation = validateRegisterPayload(await readBody(request));
  if (!validation.ok) return NextResponse.json({ message: validation.message, field: validation.field }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email: validation.data.email } });
  if (existing) return NextResponse.json({ message: "An account with this email already exists.", field: "email" }, { status: 409 });

  const passwordHash = await hashPassword(validation.data.password);
  const userId = `user-${crypto.randomUUID()}`;
  const now = new Date();

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        id: userId,
        email: validation.data.email,
        passwordHash,
        passwordUpdatedAt: now,
        emailVerifiedAt: now,
        name: validation.data.name,
        initials: initialsFromName(validation.data.name),
        role: "admin",
      },
    });

    await tx.workspaceMembership.create({
      data: {
        id: `membership-${crypto.randomUUID()}`,
        workspaceId: defaultWorkspaceId,
        userId: created.id,
        role: "admin",
      },
    });

    await tx.operationJob.create({
      data: {
        workspaceId: defaultWorkspaceId,
        type: "account_registration",
        entityId: created.id,
        status: "completed",
        message: "Owner account registered",
        metadata: { businessName: validation.data.businessName } satisfies Prisma.InputJsonObject,
      },
    });

    return created;
  });

  const session = await createAuthSession({
    userId: user.id,
    remember: true,
    userAgent: request.headers.get("user-agent"),
    ipAddress: getClientIp(request),
  });

  const response = NextResponse.json(
    {
      message: "Account created",
      user: { id: user.id, email: user.email, name: user.name, initials: user.initials, role: user.role },
    },
    { status: 201 },
  );
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
