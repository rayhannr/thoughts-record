export function Section({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-catalog text-xl font-semibold tracking-wide text-ink-muted">{question}</h2>
      <div className="mt-2 max-w-[65ch] text-lg leading-relaxed whitespace-pre-wrap text-ink">{children}</div>
    </section>
  )
}
