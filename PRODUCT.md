# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One primary user: the author, who keeps a CBT thought record assigned by their psychologist. They open the app when they feel bad, often late at night, on a phone, and write in Indonesian. The job is to capture a situation, the thought it triggered, the feeling and how strong it was, and later to test the thought against evidence. Anyone may sign up on the public instance, but the product is built for one person's needs and carries no support promise. A psychologist is a secondary, read-only audience planned for v3.

## Product Purpose

A digital replacement for a therapy homework worksheet. Success is that an entry gets written, including when the user is distressed, and that it can be finished later when their head is calmer. It also lets the user scroll back and see the thread of recurring thoughts and the rise and fall of intensity over time.

## Positioning

An MCP server over the same entry actions lets the user write and review entries conversationally from their own Claude, including on mobile. The AI only asks Socratic questions and never judges whether a thought is true. No generic journaling app pairs a structured CBT record with that stance.

## Operating Context

- Entries are often written hours after the event, so `occurred_at` and `created_at` are separate.
- A draft (no column 4) is the normal path, not an error state.
- Anonymous mode stores entries in browser localStorage and is web-only by design; the primary user is always signed in.
- Therapy material: no analytics on entry content, no logging of entry bodies, every read scoped to one user.

## Capabilities and Constraints

- Stack: Next.js 16 App Router, Tailwind CSS 4, Shadcn UI, Sonner, TanStack Query, Supabase (Postgres, Auth, RLS), Zod 4, Vercel. Read `node_modules/next/dist/docs/` before writing Next code.
- Four columns shown: situation, automatic thoughts, feelings with intensity, evidence for. The database stores all seven columns from day one; columns 5-7 are surfaced later (v4).
- Feelings are free text. Intensity is a separate integer 0-100 that starts empty with no default and snaps in steps of 5.
- Status is `draft` or `done`; drafts are listed separately and can be finished later.
- Entry list is chronological, newest first, with edit and delete. With no entries, the app opens directly into the composer.
- Out of scope: Telegram bot, demo mode, per-tool rate limiting, AI persona, streaks or gamification.

## Brand Commitments

- UI copy is Indonesian, lower case, conversational, no exclamation marks. The four prompts sound like a psychologist speaking: `apa yang terjadi?`, `apa yang muncul di pikiran?`, `rasanya gimana?`, `apa buktinya?`. Drafts are marked `belum diuji`.
- Nothing congratulates the user for writing an entry, and nothing remarks on how long it has been since the last one.
- The visual identity in AGENTS.md section 9 is NOT binding. The owner finds it bland, cold and clinical, hard to use, and says intensity does not stand out. Both light and dark themes must be fully designed.

## Evidence on Hand

No real user entries may be used as sample content. There is no public demo data and none may be seeded or fabricated from real data.

## Product Principles

1. The tool must never be the reason an entry doesn't get written.
2. An entry doesn't have to be finished in one sitting; incomplete is normal.
3. The AI asks and never concludes; the skill being built belongs to the user.
4. Intensity is the central quantity of the record and must never be conveyed by colour alone.
5. No guilt mechanics: no streaks, no congratulations, no absence remarks.

## Accessibility & Inclusion

WCAG AA contrast in both themes. Visible keyboard focus on every interactive element. Entry text inputs at least 16px on mobile to prevent iOS zoom. `prefers-reduced-motion` respected.
