const items = [
  {
    title: 'Separated surfaces',
    description: 'Landing and admin are independent Vite apps, so brand work and internal tooling can evolve without stepping on each other.',
  },
  {
    title: 'Domain-first Cloudflare setup',
    description: 'Apex/root domain and admin subdomain both terminate on Cloudflare and are routed by the same Worker runtime.',
  },
  {
    title: 'Images workflow',
    description: 'Admin can request direct upload URLs, send large files straight to Cloudflare Images, and persist asset metadata in D1.',
  },
  {
    title: 'AI Gateway layer',
    description: 'Prompting flows through Cloudflare AI Gateway, so provider switching, logging, and rate shaping stay centralized.',
  },
]

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {items.map((item) => (
        <article key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  )
}
