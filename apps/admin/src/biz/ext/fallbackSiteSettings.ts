import type { SiteSettings } from '@octoworkers/com'

export const fallbackSiteSettings: SiteSettings = {
  id: 1,
  brand: '옥토워커스',
  heroLabel: 'Cloudflare-native SaaS boilerplate',
  heroTitle: 'Run landing, admin, API, database, media, and AI behind one edge runtime.',
  heroSubtitle: 'A production-ready starter with Hono, Vite, D1, Cloudflare Images, AI Gateway, and deploy automation built in.',
  ctaPrimary: 'Open admin workspace',
  ctaSecondary: 'Collect first lead',
  updatedAt: new Date().toISOString(),
}
