"use client";

import { useParams } from "next/navigation";
import { EntryView } from "@/components/entry-view";
import { EntryNotFound, StatusLine, StorageError } from "@/components/status-line";
import { useEntry } from "@/lib/entries/client";

export default function EntryPage() {
  const { id } = useParams<{ id: string }>();
  const entry = useEntry(id);

  if (entry.isPending) return <StatusLine>memuat catatan…</StatusLine>;
  if (entry.isError) return <StorageError />;
  if (!entry.data) return <EntryNotFound />;

  return <EntryView entry={entry.data} />;
}
