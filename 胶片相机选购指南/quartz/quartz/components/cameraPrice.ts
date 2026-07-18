export function cameraPrice(value: unknown): number | null {
  if (value === null || value === undefined || value === "" || typeof value === "boolean") return null

  const parsed = typeof value === "number" ? value : Number(String(value).trim())
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}
