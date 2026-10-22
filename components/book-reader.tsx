'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { DeskBar, deskLink } from '@/components/book-page'
import type { Entry } from '@/lib/entries/schema'

// Every strip holds a full clone of the page, so the count is what the turn costs. Shading hides the facets.
const stripsFor = (width: number) => Math.min(16, Math.max(11, Math.round(width / 34)))
const TOTAL_CURL = 46
const TURN_MS = 1000

type Turn = { to: string; dir: 1 | -1 }

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const rad = (deg: number) => (deg * Math.PI) / 180

type Strip = { el: HTMLElement; shadeFront: HTMLElement; shadeBack: HTMLElement }

/**
 * Builds a leaf of nested vertical strips. Each strip shows its own slice of a clone of the page and is
 * rotated a little relative to its parent, so the sheet bends as it turns instead of swinging like a door.
 */
function buildLeaf(source: HTMLElement, width: number, height: number, count: number) {
  const w = width / count
  const strips: Strip[] = []
  let parent: HTMLElement | null = null
  let root!: HTMLElement

  const inner = (left: number) => {
    const box = document.createElement('div')
    box.className = 'strip-inner'
    box.style.cssText = `left:${left}px;width:${width}px;height:${height}px`
    box.append(source.cloneNode(true))
    return box
  }

  for (let k = 0; k < count; k++) {
    const el = document.createElement('div')
    el.className = k === 0 ? 'leaf strip' : 'strip'
    el.style.width = `${w + 1.5}px`
    if (k > 0) el.style.left = `${w}px`

    const front = document.createElement('div')
    front.className = 'face face-front'
    const shadeFront = document.createElement('div')
    shadeFront.className = 'shade'
    front.append(inner(-k * w), shadeFront)

    // The back of the sheet: bare paper, no second clone of the page.
    const back = document.createElement('div')
    back.className = 'face face-back'
    const shadeBack = document.createElement('div')
    shadeBack.className = 'shade'
    back.append(shadeBack)

    el.append(front, back)
    if (parent) parent.append(el)
    else root = el
    parent = el
    strips.push({ el, shadeFront, shadeBack })
  }
  return { root, strips }
}

/**
 * The entry detail as a book: one leaf at a time, turned with a real bend, shade and cast shadow.
 * Newer entries are back toward the front of the book, older ones forward. The position lives in the
 * URL through replaceState, so Back returns to the list rather than stepping through every page.
 */
export function BookReader({ entries, initialId, renderPage }: { entries: Entry[]; initialId: string; renderPage: (entry: Entry) => React.ReactNode }) {
  const [shown, setShown] = useState(initialId)
  const [turn, setTurn] = useState<Turn | null>(null)
  const [more, setMore] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const stashRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  const index = entries.findIndex(e => e.id === shown)
  const entry = entries[index]
  const target = turn ? entries.find(e => e.id === turn.to) : undefined

  function go(dir: 1 | -1) {
    if (busy.current) return
    const next = entries[index + dir]
    if (!next) return
    window.history.replaceState(null, '', `/entries/${next.id}`)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(next.id)
      return
    }
    busy.current = true
    setTurn({ to: next.id, dir })
  }

  useLayoutEffect(() => {
    if (!turn) return
    const stage = stageRef.current
    const from = baseRef.current?.querySelector<HTMLElement>('[data-page]')
    const to = stashRef.current?.querySelector<HTMLElement>('[data-page]')
    if (!stage || !from || !to) {
      busy.current = false
      setShown(turn.to)
      setTurn(null)
      return
    }

    const older = turn.dir > 0
    const width = stage.clientWidth
    const height = stage.clientHeight
    const source = older ? from : to
    const count = stripsFor(width)
    const { root, strips } = buildLeaf(source, width, height, count)
    root.setAttribute('aria-hidden', 'true')
    root.inert = true
    const cast = document.createElement('div')
    cast.className = 'turn-cast'
    stage.append(cast, root)
    const scrollTop = older ? from.scrollTop : 0
    root.querySelectorAll<HTMLElement>('[data-page]').forEach(n => (n.scrollTop = scrollTop))

    // q: 0 is the leaf flat over the right-hand page, 1 is the leaf lying on the left.
    const pose = (q: number) => {
      const angle = -180 * q
      const curl = -(TOTAL_CURL / count) * Math.sin(Math.PI * Math.pow(q, 0.85))
      strips.forEach((s, k) => {
        const cumulative = angle + k * curl
        s.el.style.transform = k === 0 ? `translateZ(${28 * Math.sin(Math.PI * q)}px) rotateY(${angle}deg)` : `rotateY(${curl}deg)`
        const dark = Math.min(0.6, (1 - Math.abs(Math.cos(rad(cumulative)))) * 0.55 + (Math.abs(cumulative) > 90 ? 0.06 : 0))
        s.shadeFront.style.opacity = s.shadeBack.style.opacity = String(dark)
      })
      const edge = angle + (count - 1) * curl
      const x = Math.max(0, Math.min(width, width * Math.cos(rad(edge)) * 0.92))
      cast.style.left = `${x}px`
      cast.style.opacity = String(x > 0 ? Math.sin(Math.PI * q) * 0.9 : 0)
    }

    pose(older ? 0 : 1)
    // The page under the leaf is already the new one when the leaf turns forward.
    // Synchronising React with the DOM it just cloned from, so the state change belongs here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (older) setShown(turn.to)

    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / TURN_MS)
      pose(older ? ease(t) : 1 - ease(t))
      if (t < 1) {
        frame = requestAnimationFrame(step)
        return
      }
      busy.current = false
      flushSync(() => {
        setShown(turn.to)
        setTurn(null)
      })
    }
    frame = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frame)
      root.remove()
      cast.remove()
    }
  }, [turn])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowLeft') go(1)
      if (e.key === 'ArrowRight') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // A leaf that runs past the fold shows a fade and a hint until it is read to the end.
  const checkMore = () => {
    const el = baseRef.current?.querySelector<HTMLElement>('[data-page]')
    setMore(!!el && el.scrollHeight - el.scrollTop - el.clientHeight > 24)
  }
  useEffect(() => {
    const id = requestAnimationFrame(checkMore)
    return () => cancelAnimationFrame(id)
  }, [shown, entries])

  const swipe = useRef<{ x: number; y: number } | null>(null)

  if (!entry) return null

  return (
    <div className="flex h-dvh flex-col pb-3">
      <DeskBar>
        <Link href="/" className={deskLink}>
          <ChevronLeft aria-hidden className="size-5" />
          semua catatan
        </Link>
        <Link href={`/entries/${entry.id}/edit`} className="btn-desk on-desk">
          ubah
        </Link>
      </DeskBar>

      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 touch-pan-y [perspective-origin:20%_45%] [perspective:2400px]"
        onPointerDown={e => {
          if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={e => {
          const from = swipe.current
          swipe.current = null
          if (!from) return
          const dx = e.clientX - from.x
          const dy = e.clientY - from.y
          if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(dx < 0 ? 1 : -1)
        }}
      >
        <div className="page-stack absolute inset-0">
          <div ref={baseRef} className="absolute inset-0" onScrollCapture={checkMore}>
            {page(renderPage(entry), entry.id)}
          </div>
          {more && !turn && (
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex h-16 items-end justify-center rounded-b-[6px] bg-gradient-to-t from-paper to-transparent pb-1.5 text-lg text-ink-muted">
              terus ↓
            </div>
          )}
        </div>
        {target && (
          <div ref={stashRef} aria-hidden inert className="pointer-events-none invisible absolute inset-0">
            {page(renderPage(target), target.id)}
          </div>
        )}
      </div>

      {entries.length > 1 && (
        <nav aria-label="halaman" className="mt-4 flex items-center justify-between gap-2">
          <button type="button" className="btn-desk on-desk" disabled={index === 0 || !!turn} onClick={() => go(-1)}>
            <ChevronLeft aria-hidden className="size-5" />
            lebih baru
          </button>
          <span aria-live="polite" className="text-lg text-chrome-muted">
            {index + 1} / {entries.length}
          </span>
          <button type="button" className="btn-desk on-desk" disabled={index === entries.length - 1 || !!turn} onClick={() => go(1)}>
            lebih lama
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </nav>
      )}
    </div>
  )
}

function page(children: React.ReactNode, key: string) {
  return (
    <div key={key} data-page tabIndex={0} aria-label="isi catatan" className="page-sheet absolute inset-0 overflow-y-auto overscroll-contain">
      {children}
    </div>
  )
}
