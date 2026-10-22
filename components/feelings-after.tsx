import { IntensityBar } from '@/components/intensity-bar'
import { PROMPTS } from '@/components/prompts'
import { Section } from '@/components/section'
import type { Feeling } from '@/lib/entries/schema'

/** Each feeling as it stands after the alternative thought, next to where it started. Renders nothing until one is re-rated. */
export function FeelingsAfter({ feelings }: { feelings: Feeling[] }) {
  const rated = feelings.filter(f => f.intensity_after != null)
  if (rated.length === 0) return null

  return (
    <Section question={PROMPTS.after} plain>
      <ul className="flex flex-col gap-4">
        {rated.map((f, i) => (
          <li key={i}>
            {f.name}
            <span className="label-hand ml-2 font-sans text-base">· tadinya {f.intensity}</span>
            <IntensityBar value={f.intensity_after!} hatched large className="mt-1" />
          </li>
        ))}
      </ul>
    </Section>
  )
}
