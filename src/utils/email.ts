/** Normaliza un email a minusculas y sin espacios, para comparar y almacenar de forma consistente. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
