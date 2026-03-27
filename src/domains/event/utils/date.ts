export function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDateRange(start: string, end: string): string {
  const s = start.slice(5).replace('-', '.')
  const e = end.slice(5).replace('-', '.')
  return start === end ? s : `${s} — ${e}`
}
