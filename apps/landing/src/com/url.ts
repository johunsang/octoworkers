const hostname = window.location.hostname

const isCustomDomain = hostname === 'octoworkers.com' || hostname === 'app.octoworkers.com'
const isSaas = hostname.startsWith('app.')

export function landingUrl(path = '/') {
  if (isCustomDomain) return path
  return `/landing${path}`
}

export function adminUrl(path = '/') {
  if (hostname === 'admin.octoworkers.com') return path
  if (isCustomDomain) return `https://admin.octoworkers.com${path}`
  return `/admin${path}`
}

export function pageUrl(slug: string) {
  if (isSaas) return `/${slug}`
  return landingUrl(`/pages/${slug}`)
}

export function homeUrl() {
  if (isSaas) return '/'
  return landingUrl('/')
}

export { isSaas, isCustomDomain }
