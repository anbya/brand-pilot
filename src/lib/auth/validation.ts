export type AuthValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; field?: string };

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";
}

export function validateLoginPayload(body: unknown): AuthValidationResult<{ email: string; password: string; remember: boolean }> {
  const record = isRecord(body) ? body : {};
  const email = normalizeEmail(record.email);
  const password = typeof record.password === "string" ? record.password : "";
  const remember = Boolean(record.remember);

  if (!validateEmail(email)) return { ok: false, field: "email", message: "Enter a valid email address." };
  if (!password) return { ok: false, field: "password", message: "Enter your password." };

  return { ok: true, data: { email, password, remember } };
}

export function validateRegisterPayload(body: unknown): AuthValidationResult<{
  name: string;
  email: string;
  password: string;
  businessName: string;
}> {
  const record = isRecord(body) ? body : {};
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = normalizeEmail(record.email);
  const password = typeof record.password === "string" ? record.password : "";
  const businessName = typeof record.businessName === "string" ? record.businessName.trim() : "";

  if (name.length < 2) return { ok: false, field: "name", message: "Full name must be at least 2 characters." };
  if (!validateEmail(email)) return { ok: false, field: "email", message: "Enter a valid email address." };
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { ok: false, field: "password", message: "Password must be at least 8 characters and include letters and numbers." };
  }
  if (businessName.length < 2) return { ok: false, field: "businessName", message: "Business name must be at least 2 characters." };

  return { ok: true, data: { name, email, password, businessName } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
