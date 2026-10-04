import { peakIntensity, type Entry } from '@/lib/entries/schema'
import { formatDay } from '@/lib/format'

const W = 600
const H = 250
const TOP = 78
const MAX_AMP = 78
const MAX_LINES = 14

// Stable texture per entry, so a line never changes shape between renders.
function rng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * One waveform. Only the tallest spike carries data: its height is exactly the
 * entry's intensity. Everything between is held well below it as quiet texture.
 */
function wave(entry: Entry, baseline: number) {
  const rand = rng(entry.id)
  const amp = (peakIntensity(entry.feelings) / 100) * MAX_AMP
  const left = 60
  const right = W - 60
  const step = 6
  const peakAt = left + Math.round((0.38 + rand() * 0.24) * ((right - left) / step)) * step
  let d = `M${left - 30} ${baseline} L${left} ${baseline}`
  for (let x = left + step; x < right; x += step) {
    const c = (x - W / 2) / 120
    const envelope = Math.exp(-c * c)
    const jitter = 0.2 + rand() * 0.8
    const spike = x === peakAt ? 1 : Math.min(0.55, envelope * jitter * 0.7)
    d += ` L${x} ${(baseline - amp * spike).toFixed(1)}`
  }
  d += ` L${right} ${baseline} L${right + 30} ${baseline}`
  // The stroke is the open top line; the area closes below it only to hide the lines behind.
  return {
    line: d,
    area: `${d} L${right + 30} ${baseline + 40} L${left - 30} ${baseline + 40}Z`,
    peak: { x: peakAt, y: baseline - amp }
  }
}

/**
 * The record's shape: each recent entry is one line, oldest at the top, and the
 * height of its tallest spike is how strongly it was felt. A scale bar at the
 * left edge is 100. Lower lines hide the ones behind them, as on the sleeve it
 * borrows from.
 */
export function PulsePlot({ entries }: { entries: Entry[] }) {
  const recent = [...entries]
    .sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
    .slice(-MAX_LINES)

  if (recent.length === 0) return null

  const bottom = H - 10
  const gap = recent.length > 1 ? (bottom - TOP) / (recent.length - 1) : 0
  const first = recent[0]
  const last = recent[recent.length - 1]

  return (
    <figure className="relative left-1/2 mt-5 w-screen max-w-5xl -translate-x-1/2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`grafik intensitas ${recent.length} catatan terakhir, dari ${formatDay(first.occurred_at)} sampai ${formatDay(last.occurred_at)}. tinggi puncak sama dengan intensitas.`}
        className="block h-[220px] w-full sm:h-[280px]"
      >
        {recent.map((entry, i) => {
          const isLast = i === recent.length - 1
          const baseline = recent.length > 1 ? TOP + i * gap : bottom
          const { line, area, peak } = wave(entry, baseline)
          return (
            <g key={entry.id}>
              <path d={area} fill="var(--paper)" />
              <path
                d={line}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={isLast ? 2.2 : 1}
                strokeLinejoin="round"
                strokeOpacity={isLast ? 1 : 0.8}
                vectorEffect="non-scaling-stroke"
              />
              {/* Peak tip in the strip's ramp: orange means strong here too. */}
              <path
                d={`M${peak.x} ${peak.y} L${peak.x} ${peak.y}`}
                style={{ stroke: `color-mix(in oklab, var(--signal) ${Math.min(100, peakIntensity(entry.feelings) * 1.1)}%, var(--cell-low))` }}
                strokeWidth={isLast ? 9 : 6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )
        })}
        {/* Scale bar: its full height is an intensity of 100. */}
        <path
          d={`M14 ${bottom} L14 ${bottom - MAX_AMP} M10 ${bottom} L18 ${bottom} M10 ${bottom - MAX_AMP} L18 ${bottom - MAX_AMP}`}
          fill="none"
          stroke="var(--ink-muted)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <figcaption className="label-caps mx-4 mt-2 text-ink-muted">
        <span className="flex justify-between whitespace-nowrap">
          <span>{formatDay(first.occurred_at)}</span>
          <span>{formatDay(last.occurred_at)}</span>
        </span>
        <span className="mt-2 block text-center">tinggi puncak = intensitas · garis kiri = 100</span>
      </figcaption>
    </figure>
  )
}
