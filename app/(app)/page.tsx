"use client";

import { Composer } from "@/components/composer";
import { EntryList } from "@/components/entry-list";
import { StatusLine, StorageError } from "@/components/status-line";
import { useEntries } from "@/lib/entries/client";

export default function HomePage() {
  const entries = useEntries();

  if (entries.isPending) return <StatusLine>memuat catatan…</StatusLine>;
  if (entries.isError) return <StorageError />;

  // No empty-state screen: with nothing written yet, the page is the composer.
  if (entries.data.length === 0) return <Composer />;

  return <EntryList entries={entries.data} />;
}
