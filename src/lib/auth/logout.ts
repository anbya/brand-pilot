export const loginRoute = "/auth/login";

/**
 * Replace this adapter with the auth provider's sign-out call when authentication
 * is connected. The current prototype does not persist an application session.
 */
export function logoutFromMockSession() {
  return { redirectTo: loginRoute } as const;
}
