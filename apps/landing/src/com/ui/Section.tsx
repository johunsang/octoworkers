import type { PropsWithChildren } from 'react'

type SectionProps = PropsWithChildren<{
  eyebrow: string
  title: string
  description: string
  id?: string
}>

export function Section({ eyebrow, title, description, children, id }: SectionProps) {
  return (
    <section className="content-section" id={id}>
      <div className="section-copy">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}
