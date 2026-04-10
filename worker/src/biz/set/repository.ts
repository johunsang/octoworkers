import type { SiteSettings } from '@octoworkers/com'
import type { D1DatabaseLike } from '../../com/bindings'
import { isoNow } from '../../com/db'

type SettingsRow = {
  id: number
  brand: string
  hero_label: string
  hero_title: string
  hero_subtitle: string
  cta_primary: string
  cta_secondary: string
  updated_at: string
}

function mapSettings(row: SettingsRow): SiteSettings {
  return {
    id: row.id,
    brand: row.brand,
    heroLabel: row.hero_label,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    ctaPrimary: row.cta_primary,
    ctaSecondary: row.cta_secondary,
    updatedAt: row.updated_at,
  }
}

export async function getSiteSettings(db: D1DatabaseLike) {
  const row = await db.prepare('SELECT * FROM site_settings WHERE id = 1').first<SettingsRow>()

  if (!row) {
    throw new Error('site_settings row is missing')
  }

  return mapSettings(row)
}

export async function updateSiteSettings(db: D1DatabaseLike, input: SiteSettings) {
  await db
    .prepare(
      `
        UPDATE site_settings
        SET brand = ?, hero_label = ?, hero_title = ?, hero_subtitle = ?, cta_primary = ?, cta_secondary = ?, updated_at = ?
        WHERE id = 1
      `,
    )
    .bind(input.brand, input.heroLabel, input.heroTitle, input.heroSubtitle, input.ctaPrimary, input.ctaSecondary, isoNow())
    .run()

  return getSiteSettings(db)
}
