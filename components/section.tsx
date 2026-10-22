import { cn } from 'cn'

/** A question in the marker hand with the answer in the writer's own hand beneath, on rules. */
export function Section({ question, children, plain, className }: { question: string; children: React.ReactNode; plain?: boolean; className?: string }) {
  return (
    <section className={className}>
      <h2 className="prompt">{question}</h2>
      <div className={cn(plain ? 'font-write text-[28px] leading-9' : 'ruled whitespace-pre-wrap', 'text-ink')}>{children}</div>
    </section>
  )
}
