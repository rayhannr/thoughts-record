"use client";

import Link from "next/link";
import { useState } from "react";
import { IntensityBar } from "@/components/intensity-bar";
import { DRAFT_LABEL } from "@/components/prompts";
import type { Entry } from "@/lib/entries/schema";
import { formatDay } from "@/lib/format";
import { cn } from "@/lib/utils";

type Filter = "all" | "draft";

export function EntryList({ entries }: { entries: Entry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const drafts = entries.filter((e) => e.status === "draft");
  const shown = filter === "draft" && drafts.length > 0 ? drafts : entries;

  return (
    <>
      <header className="flex min-h-11 items-center justify-between border-b border-rule pb-2">
        <h1 className="text-base font-semibold text-ink">Thought Record</h1>
        <Link
          href="/new"
          aria-label="tulis catatan baru"
          className="-mr-2 flex size-11 items-center justify-center rounded-sm text-2xl leading-none text-ink"
        >
          +
        </Link>
      </header>

      {drafts.length > 0 && (
        <div role="group" aria-label="saring catatan" className="-ml-2 flex gap-1 pt-2 text-sm">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            semua
          </FilterButton>
          <FilterButton active={filter === "draft"} onClick={() => setFilter("draft")}>
            {DRAFT_LABEL} ({drafts.length})
          </FilterButton>
        </div>
      )}

      <ul>
        {shown.map((entry) => (
          <li key={entry.id} className="border-b border-rule">
            <EntryRow entry={entry} />
          </li>
        ))}
      </ul>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-sm px-2 underline-offset-4",
        active ? "text-ink underline decoration-1" : "text-ink-muted",
      )}
    >
      {children}
    </button>
  );
}

// Leads with the thought: re-reading is a search for recurring thoughts, and
// the situation differs every time.
function EntryRow({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entries/${entry.id}`}
      className="-mx-4 block px-4 py-5 hover:bg-surface focus-visible:-outline-offset-2 sm:-mx-6 sm:px-6"
    >
      <span className="block text-sm text-ink-muted">{formatDay(entry.occurred_at)}</span>
      <span className="mt-1 line-clamp-3 font-serif text-[19px] leading-snug text-ink">
        {entry.thoughts}
      </span>
      <span className="mt-3 flex items-center justify-between gap-4">
        <span className="min-w-0 truncate font-serif text-base text-ink">{entry.feelings}</span>
        <IntensityBar value={entry.intensity} />
      </span>
      {entry.status === "draft" && (
        <span className="mt-2 block text-sm text-ink-muted">{DRAFT_LABEL}</span>
      )}
    </Link>
  );
}
