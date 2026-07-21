export const loginRoute = "/auth/login";

export async function logoutFromSession() {
  await fetch("/api/auth/logout", { method: "POST" });
  return { redirectTo: loginRoute } as const;
}
