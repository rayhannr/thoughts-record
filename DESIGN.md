---
name: Thought Record
description: A CBT thought-record journal set as a handwritten Indonesian exercise book on a charcoal desk, strictly neutral grey with one orange signal, light and dark both fully designed.
colors:
  signal: "#c73e08"
  signal-night: "#ff6b2c"
  signal-ink: "#ffffff"
  signal-ink-night: "#141414"
  desk: "#262626"
  desk-night: "#080808"
  paper: "#f1f1ef"
  paper-night: "#1c1c1c"
  paper-back: "#dcdcda"
  paper-back-night: "#141414"
  surface: "#fafaf8"
  surface-night: "#262626"
  ink: "#151515"
  ink-night: "#ececec"
  ink-muted: "#595959"
  ink-muted-night: "#a4a4a4"
  rule: "#c9c9c6"
  rule-night: "#343434"
  edge: "#7a7a77"
  edge-night: "#787878"
  margin: "#a2a29f"
  margin-night: "#565656"
  chrome: "#ececea"
  chrome-night: "#e6e6e4"
  chrome-muted: "#b6b6b3"
  chrome-muted-night: "#a8a8a6"
  google-fill: "#ffffff"
  google-border: "#747775"
  google-text: "#1f1f1f"
typography:
  wordmark:
    fontFamily: "Nanum Pen Script, Segoe Script, cursive"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1
  writing:
    fontFamily: "Nanum Pen Script, Segoe Script, cursive"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: "36px"
  writing-list:
    fontFamily: "Nanum Pen Script, Segoe Script, cursive"
    fontSize: "28px to 30px"
    fontWeight: 400
    lineHeight: "32px"
  date-heading:
    fontFamily: "Nanum Pen Script, Segoe Script, cursive"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: "36px"
  numeral:
    fontFamily: "Nanum Pen Script, Segoe Script, cursive"
    fontSize: "32px (list), 40px (entry view, slider)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "tabular-nums"
  prompt:
    fontFamily: "Patrick Hand, Segoe Print, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: "36px"
  chrome:
    fontFamily: "Patrick Hand, Segoe Print, system-ui, sans-serif"
    fontSize: "1.0625rem (body), 1rem to 1.1875rem"
    fontWeight: 400
    lineHeight: 1.2
  button:
    fontFamily: "Patrick Hand, Segoe Print, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1
rounded:
  page: "2px 6px 6px 2px"
  button: "4px 10px 5px 9px"
  slider: "4px 12px 6px 10px"
  marker: "3px 10px 6px 12px / 8px 4px 10px 5px"
  field: "4px"
  avatar: "9999px"
  google-button: "4px"
spacing:
  column: "36rem"
  gutter-mobile: "12px"
  gutter-sm: "16px"
  page-padding-left: "58px (mobile), 86px (sm)"
  page-padding-bottom: "96px"
  rule-pitch: "36px"
  field-gap: "32px"
  touch-target: "44px"
components:
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.button}"
    typography: "{typography.button}"
    height: "44px"
    padding: "0 18px"
  button-signal-night:
    backgroundColor: "{colors.signal-night}"
    textColor: "{colors.signal-ink-night}"
  button-pen:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 18px"
  button-pen-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-desk:
    backgroundColor: "transparent"
    textColor: "{colors.chrome}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 18px"
  button-quiet:
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 8px"
  ruled-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.writing}"
    padding: "0"
    height: "72px minimum, whole 36px lines"
  intensity-slider:
    rounded: "{rounded.slider}"
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

**Creative North Star: "The Exercise Book"**

The record is a handwritten Indonesian exercise book lying on a desk. By day a pale grey leaf on a charcoal desk; by night a dark grey leaf on a near-black desk. Each entry is a leaf you turn, not a card you open. The palette is strictly neutral grey with no hue cast, and one orange signal. Light and dark are both fully designed (`prefers-color-scheme`), neither an inversion of the other.

Two hands share the page. Nanum Pen Script is the user's own hand: the entry text, the dates, the wordmark and every numeral, set large because the face is thin. Patrick Hand is the printed side: prompts, buttons, labels and chrome, a plainer marker hand that stays legible small. Prompts are Indonesian and lower case, spoken like the psychologist.

The book is built from physical cues, all in CSS: a double margin rule down each page, a gutter shadow where the leaf meets the spine, two more leaves showing under the right and bottom edges, ruled lines only inside writing areas, and pen-wobbled corners on every control. Nothing is a card.

**Key Characteristics:**
- One orange (#c73e08 day, #ff6b2c night) carries primary action, focus, selection, caret, errors and the intensity marker. No other hue exists in the app.
- Intensity is a marker swipe whose length is the value, with the number ringed in pen beside it. Colour only reinforces.
- The entry detail is a book reader: leaf-by-leaf page turn with a bent leaf, shade, cast shadow and a ghosted back.
- Writing sits on 36px rules; there are no boxes around inputs.
- A desk bar (always dark) holds navigation; the leaf holds the record.
- Single column, `max-w-xl` (36rem), mobile first.

## Colors

Both themes are specified in `app/globals.css`. Frontmatter gives the day value plainly and the night value with a `-night` suffix.

### Primary
- **Signal Orange** (`signal` #c73e08 day, #ff6b2c night): primary button fill, 2px focus outline (2px offset), text selection, input caret, invalid outline and inline error text, the intensity marker (mixed toward the paper at low values), plot dots. Text on it is `signal-ink` (white day, #141414 night).

### Neutral
- **Desk** (`desk` #262626 / #080808): page background behind the book, the sticky desk bar and the composer's sticky submit bar. Also the scrollbar track.
- **Paper** (`paper` #f1f1ef / #1c1c1c): the leaf. **Paper Back** (`paper-back` #dcdcda / #141414): the reverse of a turning leaf.
- **Surface** (`surface` #fafaf8 / #262626): shadcn card, popover and muted mappings; the account panel. Not a card surface for entries.
- **Ink** (`ink` #151515 / #ececec): writing, pressed pen button fill. **Muted Ink** (`ink-muted` #595959 / #a4a4a4): prompts, dates, placeholders, the empty slider.
- **Rule** (`rule` #c9c9c6 / #343434): the 36px writing rules and row hairlines. **Edge** (`edge` #7a7a77 / #787878): outlines a finger must find (empty slider, plot link rule).
- **Margin** (`margin` #a2a29f / #565656): the double margin line and scrollbar thumb.
- **Chrome** (`chrome` #ececea / #e6e6e4) and **Chrome Muted** (`chrome-muted` #b6b6b3 / #a8a8a6): text and outlines set directly on the desk; same chalk in both themes.
- Derived: `gutter` (black at 16% day, 40% night), `stack-1` and `stack-2` (paper mixed toward black by day, toward white by night) for the leaves under the page edge.

### Named Rules
**The One Orange Rule.** Orange is the only chroma. Everything else is neutral grey; no second accent, no status tint.

**The Chalk On The Desk Rule.** Orange does not hold against the charcoal desk by day, so controls on the desk (`.on-desk`) ring their focus in `chrome` instead.

**The Edge Versus Rule Rule.** `--rule` is for ruled lines and hairlines; anything a finger must find uses `--edge`.

**The Number Beside The Colour Rule.** Marker colour is `signal` mixed with `paper` from 45% to 100% by value. It only reinforces the length and the ringed number, which always carry the reading.

## Typography

**Hand Font (the user's):** Nanum Pen Script, self-hosted Latin subset (`app/fonts/NanumPenScript-latin.woff2`, SIL OFL); fallback Segoe Script, cursive.
**Print Font (the app's):** Patrick Hand (Google), fallback Segoe Print, system-ui.
**Third-party Font:** Roboto Medium, loaded only for the Google sign-in button.

**Character:** a pen and a marker. The pen is the person; the marker is the book's printed ruling and labels.

### Hierarchy
- **Writing** (Nanum 28px, 36px line height on rules): situation, thoughts, balanced thought, the field input. Entry view sets the same.
- **Writing, list** (Nanum 30px feelings line, 28px thought, 32px line height, clamped to 2 and 3 lines).
- **Date heading** (Nanum 32px): the occurred-at line on the entry leaf.
- **Wordmark** (Nanum 34px): "Thought Record" on the desk bar.
- **Numeral** (Nanum, tabular, ringed): 32px in list rows, 40px on the entry view and beside the slider.
- **Prompt** (Patrick 1.125rem, 36px line height, muted; `.prompt`): the four questions, set on the rule grid.
- **Label** (Patrick 1rem, `.label-hand`, muted): dates in plot axes, small annotations.
- **Chrome and buttons** (Patrick 1.0625rem body, 1.1875rem buttons, 1.125rem to 1.375rem for links and the submit label).

### Named Rules
**The Own Hand Rule.** Anything the user wrote, and every number, is Nanum Pen Script. Anything the app says is Patrick Hand.

**The Rule Grid Rule.** Writing and prompts share a 36px line pitch so text always sits on a ruled line.

**The Lining Numerals Rule.** Body uses lining numerals; changing numerals are tabular.

## Layout

One column, `max-w-xl`, centred, 12px side padding (16px from `sm`), 32px bottom. The leaf (`.page-sheet`) pads 24px top, 96px bottom, and on the left clears the double margin line: 58px mobile, 86px from 640px (the margin rule sits at 40px and 68px). Vertical rhythm between composer fields is 32px; between entry-view sections 28px. Controls meet 44px minimum touch height; the slider track is 56px; the composer submit 48px.

The list is: desk bar (wordmark left; account, `bagikan` and orange `tulis` right), then one leaf holding the feelings plot, an optional draft filter (only when drafts exist), and ruled rows five to a page with `baru` / `lama` paging. A row leads with the date, then the feelings in the user's hand, the marker swipe with ringed number, then the thought. Rows are hairline-separated; hover is a 5% ink tint. There is no empty-state screen and no card.

The entry detail fills the viewport (`h-dvh`): desk bar with `semua catatan` and `ubah`, one leaf stage that scrolls inside itself (with a `terus ↓` fade when it runs past the fold), and a pager (`lebih baru`, position, `lebih lama`) on the desk. Arrow keys and horizontal touch swipe also turn the leaf.

The composer's submit bar is sticky on the desk at the bottom.

## Elevation & Depth

Depth is physical and belongs to the book only. The leaf carries one soft drop shadow (`0 18px 28px -14px` at 55% black) and two stacked leaves peek out 4px and 8px under its right and bottom edges. A gutter gradient darkens the leaf at the spine. During a page turn, per-strip shade and a cast shadow on the page below carry the bend. Nothing else casts a shadow: controls, rows and the desk are flat.

### Named Rules
**The Book Casts, Nothing Else Rule.** Shadow belongs to the leaf and the turning leaf. Controls, fields and rows stay flat.

## Shapes

Everything hand-drawn has corners that never quite match. Leaf `2px 6px 6px 2px` (square at the spine, softer at the fore-edge); buttons `4px 10px 5px 9px`; slider `4px 12px 6px 10px`; marker `3px 10px 6px 12px / 8px 4px 10px 5px`, skewed -8deg. The circled number is an irregular ellipse (`55% 45% 52% 48% / 50% 56% 44% 50%`) with a 2px ink border. Borders on controls are 2px. Exceptions: Google's required 4px button, and the round account avatar (2px chrome-muted ring, on the desk). Plot dots are round for bad, a ring for good, a rotated diamond for unrated.

## Components

### Buttons
All four share 44px minimum height, Patrick 1.1875rem, and the hand-drawn corner.
- **Signal (`.btn-signal`):** orange fill, `signal-ink` text, 2px orange border; hover `brightness(1.08)`; disabled 55% opacity. `tulis`, `simpan`, `lanjutkan sekarang`.
- **Pen (`.btn-pen`):** 2px ink outline, ink text; hover and `aria-pressed` fill with ink and set text in paper. Filter, valence and pager buttons on the leaf.
- **Desk (`.btn-desk`):** 2px `chrome-muted` outline, `chrome` text, border to `chrome` on hover. For controls set on the desk (`ubah`, `bagikan`, pager).
- **Quiet (`.btn-quiet`):** no outline, muted ink, ink on hover. `hapus perasaan ini`, `ada perasaan lain`.
- Disabled pen and desk buttons drop to 40% opacity with a not-allowed cursor.

### Google sign-in button
Google's own light button in both themes: white fill, 1px #747775 border, #1f1f1f text in Roboto Medium 14px (tracking 0.25px), 4px radius, 44px tall, 260px wide from `sm`. Exempt from palette and shape rules on purpose.

### Ruled field
A prompt in Patrick above, the answer in Nanum directly on 36px rules (`.ruled`). No box, transparent background, no padding. It grows in whole lines (minimum 72px, never scrolls) so rules stay under the text. Focus is the global orange outline offset 4px; invalid keeps the orange outline and a small orange message beneath.

### Intensity marker and slider
The slider starts empty: a dashed `edge` outline reading `geser di sini →` and an en dash in a muted ringed circle. Touched, the outline goes solid ink and a marker swipe fills from the left to the value; the number is ringed in ink. Snaps by 5; arrows 5, PageUp/PageDown 20, Home and End. The same marker swipe (20px tall in lists, 28px on the entry view) with the ringed number reads the value back. Re-rated values draw the marker hatched (`.marker-after`: pencil hatching in a 2px outline) so they read apart from the first rating.

### Feelings plot (signature)
On the list leaf: one dot per feeling for the 30 most recent entries. Across is real `occurred_at` time, up is intensity (grid at 0, 50, 100). An entry's feelings stack in one column, joined by a hairline in `edge`; entries are never joined. Shape carries the optional valence: filled dot is nggak enak, ring is enak, diamond is unrated. Dot tone follows the marker tone. Once any feeling is re-rated, a `sebelum` / `sesudah` switch plots the after values. Each dot links to its entry, with an aria-label of name, mode, intensity, valence and date.

### Navigation and status
No tab bar. The desk bar holds actions; sub-pages carry a chalk back link and an outlined `ubah`. Loading and error are a single muted line. Toasts use Sonner.

### The page turn
The detail reader (`components/book-reader.tsx`) turns one leaf at a time. The leaf is a chain of 24 to 48 vertical strips (about one per 11px of stage width), each rotated a little relative to its parent so the sheet bends while it turns, with a total bend of 46 degrees. Each strip holds a clone of the page. Over 1000ms with cubic ease-in-out, the leaf lifts 28px toward the viewer, per-strip shade darkens with the angle, a 120px cast shadow follows the leaf edge, and the back shows `paper-back` with a mirrored ghost of the page at 7% opacity. Older entries turn forward, newer back; the position lives in the URL through `replaceState`. Under `prefers-reduced-motion: reduce` the leaf swaps without animation.

### Motion
Two moments. The page turn above, and a draft's balanced thought settling into place when filled later (600ms, translateY 8px to 0 with fade, `cubic-bezier(0.16, 1, 0.3, 1)`, only under `prefers-reduced-motion: no-preference`). Hover and border changes are instant.

## Do's and Don'ts

### Do:
- **Do** keep orange to action, focus, selection, caret, error, and the intensity marker, one orange per theme.
- **Do** set the user's words and every number in Nanum Pen Script, and the app's words in Patrick Hand.
- **Do** write on 36px rules with no box around the field.
- **Do** show the ringed number beside every marker swipe; length and number carry the reading.
- **Do** ring focus in `chrome` on the desk and in orange on the leaf.
- **Do** keep touch targets at 44px or more and field text at 16px or more.
- **Do** draw the plot only from real entry data, with shape equal to the valence the user gave.
- **Do** keep the Google sign-in button as Google specifies it in both themes.

### Don't:
- **Don't** use cards, pills or uniformly rounded boxes; corners are always a little uneven.
- **Don't** introduce a second hue or colour-code status; neutral greys carry the rest.
- **Don't** put a shadow on anything but the book and the turning leaf.
- **Don't** pre-fill the intensity slider.
- **Don't** invent plot data for empty states; with no entries the plot renders nothing.
- **Don't** set the user's writing in the print face.
- **Don't** theme or restyle the Google button.

## Not canonized

Drift carried by the build, not part of the system: `components/ui/button.tsx` still carries stock shadcn variants (ring, `rounded-lg`, tinted destructive) that the hand-drawn `.btn-*` classes replaced, and it imports `cn` from `'cn'` like the rest of the components; the `terus ↓` hint carries a text glyph arrow (and the slider hint a `→`) where the floor prefers drawn marks; the Google button's hex values and `transition-colors` live inline in `app/(auth)/login/page.tsx` rather than as tokens. The skill's `reference/document.md` was absent from the repo, so the format followed the previous DESIGN.md.
