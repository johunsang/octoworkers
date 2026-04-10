import type { PropsWithChildren } from 'react'

type SectionProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
}>

export function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <section className="content-section">
      <div className="section-copy">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}
