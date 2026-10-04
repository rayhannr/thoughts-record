const time = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })
const dayMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })
const dayMonthYear = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** "Hari ini", "Kemarin", "30 Sep", or "30 Sep 2025" for other years. */
export function formatDay(iso: string, now = new Date()): string {
  const d = new Date(iso)
  const days = Math.round((startOfDay(now) - startOfDay(d)) / 86_400_000)
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  return d.getFullYear() === now.getFullYear() ? dayMonth.format(d) : dayMonthYear.format(d)
}

/** "Kemarin, 21.40" */
export function formatDayTime(iso: string, now = new Date()): string {
  return `${formatDay(iso, now)}, ${time.format(new Date(iso))}`
}
