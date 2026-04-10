import type { PropsWithChildren } from 'react'

type PanelProps = PropsWithChildren<{
  eyebrow: string
  title: string
}>

export function Panel({ eyebrow, title, children }: PanelProps) {
  return (
    <section className="panel">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
