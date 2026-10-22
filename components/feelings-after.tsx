import { IntensityBar } from '@/components/intensity-bar'
import { PROMPTS } from '@/components/prompts'
import { Section } from '@/components/section'
import type { Feeling } from '@/lib/entries/schema'

/** Each feeling as it stands after the alternative thought, next to where it started. Renders nothing until one is re-rated. */
export function FeelingsAfter({ feelings }: { feelings: Feeling[] }) {
  const rated = feelings.filter(f => f.intensity_after != null)
  if (rated.length === 0) return null

  return (
    <Section question={PROMPTS.after}>
      <ul className="flex flex-col gap-6">
        {rated.map((f, i) => (
          <li key={i}>
            {f.name}
            <span className="ml-2 font-sans text-sm text-ink-muted">· tadinya {f.intensity}</span>
            <IntensityBar value={f.intensity_after!} large className="mt-3" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
