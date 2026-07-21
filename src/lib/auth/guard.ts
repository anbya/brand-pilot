import { getCurrentSession, type AuthSession } from "@/lib/auth/session";

export type AuthGuardResult =
  | { ok: true; session: AuthSession }
  | { ok: false; response: Response };

export async function requireAuth(): Promise<AuthGuardResult> {
  const session = await getCurrentSession();
  if (!session) {
    return {
      ok: false,
      response: Response.json({ message: "Authentication required." }, { status: 401 }),
    };
  }
  return { ok: true, session };
}
