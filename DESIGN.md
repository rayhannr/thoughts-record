---
name: Thought Record
description: A CBT thought-record journal set as a Factory Records catalogue sleeve, matte black by night and matte white by day, with one factory orange.
colors:
  signal: "#c73e08"
  signal-night: "#ff6b2c"
  signal-ink: "#ffffff"
  signal-ink-night: "#0d0c0b"
  paper: "#f1efea"
  surface: "#faf9f6"
  ink: "#0f0e0d"
  ink-muted: "#5e5a52"
  rule: "#cfcac0"
  edge: "#857f73"
  cell-off: "#ddd8cd"
  cell-low: "#6d675c"
  paper-night: "#0d0c0b"
  surface-night: "#161513"
  ink-night: "#ece7dc"
  ink-muted-night: "#a39d90"
  rule-night: "#2c2a26"
  edge-night: "#6f695e"
  cell-off-night: "#262420"
  cell-low-night: "#8f8a7e"
  google-fill: "#ffffff"
  google-border: "#747775"
  google-text: "#1f1f1f"
typography:
  wordmark:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "4.25rem"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "0.02em"
  catalogue-number:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "3rem to 3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.06em"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "2.25rem (list), 3.75rem (entry view), 3rem (slider)"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tabular-nums"
  question:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.1em"
  writing:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  writing-thought:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem (entry view), 19px (list row)"
    fontWeight: 500
    lineHeight: 1.375
  chrome:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "2px"
  xl: "3px"
  google-button: "4px"
  avatar: "9999px"
spacing:
  column: "38rem"
  gutter-mobile: "16px"
  gutter-sm: "24px"
  section-gap: "40px"
  field-gap: "32px"
  touch-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.sm}"
    typography: "{typography.question}"
    height: "44px"
    padding: "0 16px"
  button-primary-night:
    backgroundColor: "{colors.signal-night}"
    textColor: "{colors.signal-ink-night}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 16px"
  filter-chip-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "0 14px"
  ruled-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    typography: "{typography.writing}"
    padding: "12px 14px"
  intensity-slider:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    height: "56px"
    padding: "0 12px"
  google-button:
    backgroundColor: "{colors.google-fill}"
    textColor: "{colors.google-text}"
    rounded: "{rounded.google-button}"
    height: "44px"
    padding: "0 12px"
---

# Design System: Thought Record

## Overview

**Creative North Star: "Sleeve Zero"**

The app is a catalogue sleeve for one person's thinking. Matte black at night, matte white by day, a single factory orange, hairlines at one pixel, 2px corners, no shadows, no cards. Every entry is a catalogue item numbered in the order it was written (`TR / 0007`). The record's shape is the cover: a pulse plot of recent entries owns the top of the list, and every entry carries a 20-cell code strip.

Two voices share the page. Condensed caps (Barlow Condensed) are the catalogue's printing: wordmark, question labels, catalogue numbers, numerals, short marks. Hanken Grotesk is the user's own writing and the app's quiet chrome. The writing is never set in the printing face when it runs long.

Orange is the only chroma. It marks primary action, focus, selection, error, and the hot end of intensity. Everything else is bone, black, and warm grey. The dark theme is the primary sleeve (the app is opened late at night); the light theme is the same sleeve inverted, with a deeper orange to hold contrast.

**Key Characteristics:**
- One orange (#c73e08 day, #ff6b2c night) carries action, focus, selection, error and the hot cells of the strip.
- Condensed caps for short marks and numerals; humanist sans for anything the user wrote.
- The pulse plot is the signature: one hairline waveform per recent entry, tallest spike equals the intensity.
- Intensity is a length (20 cells, one per 5 points) plus a numeral, never colour alone.
- Hairlines and 2px corners; depth comes from overlap and tone, never shadow.
- Single 38rem column, mobile first, with the plot allowed to break out edge to edge.

## Colors

A warm, near-monochrome sleeve with one hot ink. Both themes are fully specified in `app/globals.css` and switch with `prefers-color-scheme`. Frontmatter names the day value plainly and the night value with a `-night` suffix.

### Primary
- **Factory Orange** (`signal` #c73e08 day, `signal-night` #ff6b2c night): primary button fill, focus ring (2px, 2px offset), text selection, caret, invalid borders and inline error text, destructive confirm outline, and the hot cells and peak tips of intensity. Text on it is `signal-ink` (white day, matte black night).

### Neutral
- **Matte Paper** (`paper` #f1efea / `paper-night` #0d0c0b): page ground, and the fill that lets plot lines hide the lines behind them.
- **Sleeve Surface** (`surface` #faf9f6 / `surface-night` #161513): text fields, slider track, row hover, account panel.
- **Sleeve Ink** (`ink` #0f0e0d / `ink-night` #ece7dc): primary text, filled values, active filter chip fill.
- **Muted Ink** (`ink-muted` #5e5a52 / `ink-muted-night` #a39d90): chrome text, dates, captions, placeholders, empty slider numeral.
- **Hairline** (`rule` #cfcac0 / `rule-night` #2c2a26): one-pixel dividers between rows and in the entry footer, the account panel border, scrollbar thumb. Hairlines only.
- **Control Edge** (`edge` #857f73 / `edge-night` #6f695e): outlines of controls (empty fields, empty slider, inactive filter chips, secondary link buttons). About 3:1 against the ground.
- **Cell Off** (`cell-off`) and **Cell Low** (`cell-low`): the unlit strip cell, and the cool end of the lit-cell ramp.

### Named Rules
**The One Ink Rule.** Orange is the only chroma in the app. Neutrals stay warm grey; no second accent, no tint for status.

**The Edge Versus Rule Rule.** `--rule` is for hairlines (dividers). Anything a finger must find, such as a field, slider, or chip outline, uses `--edge`.

**The Number Beside the Colour Rule.** Colour in the strip and plot peaks only reinforces. The numeral and the length always carry the reading.

**The Bone Ramp Rule.** Lit cells mix from `cell-low` toward `signal` at 8% per cell index, reaching full orange at cell 13. The ramp is the same in the list strip, entry view, slider track, and plot peak tips (peak tip: intensity x 1.1 percent).

## Typography

**Printing Font:** Barlow Condensed (weights 500, 600, 700; fallback Arial Narrow)
**Writing and Chrome Font:** Hanken Grotesk (variable; fallback system-ui)
**Third-party Font:** Roboto Medium, loaded only for the Google sign-in button.

**Character:** A railway-timetable condensed against a plain humanist sans. The condensed face is the label on the sleeve; the sans is the person writing on it.

### Hierarchy
- **Wordmark** (Barlow 700, 4.25rem, 0.9, tracking 0.02em, caps): login title only. In the list header the wordmark is Barlow 600, 1.125rem, tracking 0.12em, caps.
- **Catalogue number** (Barlow 600, 3rem composer, 3.75rem entry view, tracking 0.06em, tabular): `TR / 0007`, four-digit zero padded, numbered by write order.
- **Headline** (Barlow 600, 2.25rem, 1.1, tracking 0.01em): the thought on the entry view, only when it is 90 characters or fewer. Longer thoughts fall back to Hanken 500 at 1.5rem.
- **Numeral** (Barlow 600, tabular): intensity value at 2.25rem in list rows, 3.75rem on the entry view, 3rem beside the slider (muted en dash until touched).
- **Question** (Barlow 600, 1.25rem, tracking 0.025em): the four prompts above each field and section, and the submit button label.
- **Label** (Barlow 500, 0.8125rem, tracking 0.1em, caps; the `label-caps` class): dates, plot captions, composer time toggle. Never running prose.
- **Writing** (Hanken 400, 1.125rem, 1.625, max 65ch): situation, feelings, evidence text and field input.
- **Thought, list** (Hanken 400, 19px, snug, clamped to 3 lines): leads every list row.
- **Chrome** (Hanken 400, 0.875rem): navigation links, helper text, errors.

### Named Rules
**The Short Marks Rule.** The condensed face is for short marks only: labels, numbers, numerals, questions, buttons, and a thought of 90 characters or fewer as headline. Anything longer or running is Hanken, so it reads as the user's own voice.

**The Lining Numerals Rule.** Body uses lining numerals; every numeral that changes (intensity, catalogue number) is tabular.

## Layout

One column, `max-w-[38rem]`, centred, with 16px side padding and 24px from the `sm` breakpoint, 12px top padding (32px at `sm`) and 96px bottom. Vertical rhythm between composer fields is 32px; between entry-view sections 40px. Controls meet a 44px minimum touch height (the slider track is 56px, the composer submit 48px).

The list is: header (wordmark left, account and orange `tulis` button right), pulse plot edge to edge, an optional filter row (only when drafts exist), then hairline-separated rows. A row is the thought at 19px, then feeling text with date label on the left and the strip plus numeral on the right. Row hover is a `surface` tint that bleeds past the column padding. There is no empty-state screen and no card.

The pulse plot breaks out of the column (`w-screen`, capped at `max-w-5xl`), 220px tall on mobile and 280px from `sm`, with `preserveAspectRatio="none"` and non-scaling strokes.

## Elevation & Depth

Flat. No box-shadow exists in the build. Depth is overlap and tone: pulse-plot waveforms are drawn oldest at the top with a `paper`-filled area beneath each, so lower lines occlude the ones behind them. The account menu panel is the only floating element and is a `surface` fill with a one-pixel hairline, no shadow.

### Named Rules
**The No Shadow Rule.** Nothing casts a shadow. Separation is a hairline, a tone step to `surface`, or occlusion.

## Shapes

Square-set. All corners are 2px (`--radius-sm/md/lg`), 3px for the largest shadcn tier. Controls are outlined 1px rectangles. The only exceptions are Google's required 4px button radius and the circular account avatar (the user's own profile image, or an initial in a hairline circle). Strip cells are hard rectangles 5px wide, 14px tall, 2px apart (8px by 20px in the large entry-view strip).

## Components

### Buttons
- **Primary (tulis, lanjutkan sekarang, simpan):** orange fill, `signal-ink` text, 2px corners, Barlow 600 at 1.125 to 1.25rem. 44px tall in the header and entry view, 48px full-width submit in the composer. Hover is `brightness-110`. Focus is the global 2px orange outline with 2px offset.
- **Outline link button (ubah, ke semua catatan):** 1px `edge` (or `rule` on the not-found link) border, `ink` text, border turns `ink` on hover.
- **Text link (semua catatan, batal, masuk, hapus catatan):** muted ink, 44px minimum height, hover to `ink` (hapus hover turns orange).
- **Destructive confirm (ya, hapus):** 1px orange outline and orange text, fills orange on hover. Delete is isolated at the page foot and quiet until chosen.
- **Filter chip:** `edge` outline, muted text; active is `ink` fill with `paper` text, `aria-pressed`.

### Google sign-in button
Google's own light button in both themes: white fill, 1px #747775 border, #1f1f1f text in Roboto Medium 14px (tracking 0.25px), 4px radius, 44px tall, 260px wide from `sm`, full width on mobile, four-colour mark unmodified. Hover #f0f0f0, focus #e8e8e8. It is exempt from the palette and shape rules on purpose.

### Inputs / Fields (Ruled field)
A question in condensed caps above, the answer in a visible `surface` block beneath. 1px border: `edge` when empty, `ink` when filled, orange when invalid; focus adds a 1px orange ring. 2px corners, Hanken 1.125rem (never below 16px), grows with the writing instead of scrolling, minimum height 72px. Errors are small orange text below the field. Time input uses the same border treatment at 16px.

### Intensity slider and code strip
A 56px track in a 1px outlined `surface` box containing 20 cells, with the large numeral to the right. It starts empty with an en dash and an `edge` border; touched, the border goes `ink`. Snaps by 5 (arrows, PageUp and PageDown by 20, Home and End). The same 20-cell strip is read back in lists (5x14px cells) and the entry view (8x20px). Cells light by `round(value / 5)`.

### Pulse plot (signature)
One hairline waveform per entry, oldest at top, up to 14 most recent. A waveform's single tallest spike has height equal to the entry's intensity (scale bar at the left edge is 100); everything else stays below 55% of that as seeded-stable texture. Strokes are `ink` at 1px, 80% opacity; the newest is 2.2px at full opacity. A round dot at each peak takes the strip's ramp colour. The caption is two label-caps lines: first and last dates, and the key `tinggi puncak = intensitas`. The plot is drawn only from entry data; it is never decorative, placeholder, or sample.

### Navigation and status
No tab bar. The list header carries wordmark and actions; sub-pages carry a plain muted back link and an outlined `ubah`. Loading and error are a single muted line (`StatusLine`), never a spinner or alert box. Toasts (Sonner) use an orange action button.

### Motion
One moment: when a draft's evidence is filled later, that section settles in (600ms, translateY 8px to 0 with fade, `cubic-bezier(0.16, 1, 0.3, 1)`), only under `prefers-reduced-motion: no-preference`. Colour and border changes on hover are instant. Nothing else moves.

## Do's and Don'ts

### Do:
- **Do** keep orange to action, focus, selection, error, and the hot end of intensity, one orange per theme.
- **Do** set the thought as the condensed headline only at 90 characters or fewer; use Hanken for anything longer.
- **Do** show the intensity numeral next to every strip or plot; the length and number carry the reading.
- **Do** draw the pulse plot only from real entry data, with the tallest spike equal to the intensity.
- **Do** use `--edge` for control outlines and `--rule` for hairlines only.
- **Do** give every clickable element a pointer cursor (a global base rule restores it after Tailwind's reset) and a not-allowed cursor when disabled.
- **Do** keep touch targets at 44px or more and field text at 16px or more.
- **Do** keep the Google sign-in button as Google specifies it in both themes.

### Don't:
- **Don't** use shadows, rounded cards, or pill chips; separate entries with hairlines.
- **Don't** introduce a second chroma or colour-code status.
- **Don't** set running prose, or thoughts over 90 characters, in the condensed face.
- **Don't** pre-fill the intensity slider.
- **Don't** invent plot data for empty or demo states; with no entries the plot renders nothing.
- **Don't** theme or restyle the Google button to match the palette.

## Not canonized

Drift carried by the build and not part of the system: `components/ui/button.tsx` still carries stock shadcn variants (ring-3 focus, `rounded-lg`, opacity states) of which only the default variant is used (composer submit); a few secondary controls (account sign-out, not-found link, account panel) outline with `--rule` where the edge rule says `--edge`; `components/ui/button.tsx` imports `cn` from `'cn'`, unlike the rest of the app's `@/lib/utils`.
