"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

const STEP = 5;

function snap(n: number) {
  return Math.min(100, Math.max(0, Math.round(n / STEP) * STEP));
}

/**
 * Starts empty on purpose: a pre-filled number anchors the answer before the
 * user has considered it. Shows a dash until touched, snaps in steps of 5.
 */
export function IntensitySlider({
  id,
  value,
  onChange,
  labelledBy,
  describedBy,
  invalid,
}: {
  id?: string;
  value: number | null;
  onChange: (value: number) => void;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function valueAt(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    return snap(((clientX - rect.left) / rect.width) * 100);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
    onChange(valueAt(e.clientX));
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    onChange(valueAt(e.clientX));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const current = value ?? 0;
    const next: Record<string, number> = {
      ArrowRight: current + STEP,
      ArrowUp: current + STEP,
      ArrowLeft: current - STEP,
      ArrowDown: current - STEP,
      PageUp: current + 4 * STEP,
      PageDown: current - 4 * STEP,
      Home: 0,
      End: 100,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    onChange(snap(next[e.key]));
  }

  return (
    <div className="flex items-center gap-4">
      <div
        id={id}
        role="slider"
        tabIndex={0}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value ?? undefined}
        aria-valuetext={value == null ? "belum dinilai" : String(value)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        className="group relative h-11 flex-1 cursor-pointer touch-none rounded-sm focus-visible:outline-offset-0"
      >
        <div ref={trackRef} className="absolute inset-x-2.5 top-1/2 h-0.5 -translate-y-1/2 bg-rule">
          {value != null && (
            <>
              <div
                className="intensity-fill absolute inset-y-0 left-0 h-1 -translate-y-px"
                style={{ width: `${value}%`, "--v": value } as React.CSSProperties}
              />
              <div
                className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ink"
                style={{ left: `${value}%` }}
              />
            </>
          )}
        </div>
      </div>
      <output
        aria-hidden
        className={cn(
          "w-8 text-right font-sans text-lg tabular-nums",
          value == null ? "text-ink-muted" : "text-ink",
        )}
      >
        {value ?? "–"}
      </output>
    </div>
  );
}
