export type SiteSettings = {
  id: number
  brand: string
  heroLabel: string
  heroTitle: string
  heroSubtitle: string
  ctaPrimary: string
  ctaSecondary: string
  updatedAt: string
}

export type LeadSubmissionInput = {
  name: string
  email: string
  company?: string
  message?: string
}

export type LeadRecord = {
  id: number
  name: string
  email: string
  company: string | null
  message: string | null
  status: string
  assignedTo: string | null
  source: string | null
  createdAt: string
}

export type PublicMetrics = {
  totalLeads: number
  totalMedia: number
  updatedAt: string
}

export type PublicBootstrap = {
  settings: SiteSettings
  metrics: PublicMetrics
}

export type MediaAsset = {
  id: number
  imageId: string
  title: string
  alt: string | null
  status: string
  deliveryUrl: string | null
  previewUrl: string | null
  uploadedAt: string
}

export type DashboardData = {
  stats: {
    totalLeads: number
    totalMedia: number
    latestLeadAt: string | null
    latestSettingUpdateAt: string | null
  }
  recentLeads: LeadRecord[]
  media: MediaAsset[]
  aiConfigured: boolean
}

export type AiCopySuggestionRequest = {
  objective: string
  audience: string
  tone: string
}

export type AiCopySuggestion = {
  heroTitle: string
  heroSubtitle: string
  ctaPrimary: string
  rationale: string
}

export type DirectUploadPayload = {
  imageId: string
  uploadURL: string
}

// --- Lead CRM Enhancement ---

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export type LeadTag = {
  id: number
  leadId: number
  tag: string
  createdAt: string
}

export type LeadNote = {
  id: number
  leadId: number
  content: string
  createdBy: string
  createdAt: string
}

export type LeadDetail = LeadRecord & {
  tags: LeadTag[]
  notes: LeadNote[]
}

// --- Email System ---

export type EmailTemplate = {
  id: number
  name: string
  subject: string
  bodyHtml: string
  bodyText: string
  createdAt: string
  updatedAt: string
}

export type EmailTemplateInput = {
  name: string
  subject: string
  bodyHtml: string
  bodyText: string
}

export type EmailLog = {
  id: number
  leadId: number
  templateId: number | null
  subject: string
  status: string
  sentAt: string
  leadName?: string
  leadEmail?: string
}

export type SendEmailRequest = {
  leadId: number
  templateId?: number
  subject?: string
  bodyHtml?: string
  bodyText?: string
}

// --- Content CMS ---

export type PageStatus = 'draft' | 'published' | 'archived'

export type Page = {
  id: number
  slug: string
  title: string
  contentMd: string
  contentHtml: string
  status: PageStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export type PageInput = {
  slug: string
  title: string
  contentMd: string
}

export type PageSummary = {
  id: number
  slug: string
  title: string
  status: PageStatus
  publishedAt: string | null
  updatedAt: string
}

// --- Admin System ---

export type AdminUserRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

export type AdminUser = {
  id: number
  email: string
  name: string
  role: AdminUserRole
  avatarUrl: string | null
  githubLogin: string | null
  lastLoginAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AdminUserInput = {
  email: string
  name: string
  role: AdminUserRole
}

export type AccessLog = {
  id: number
  userEmail: string
  action: string
  path: string
  method: string
  statusCode: number | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

export type ApiLog = {
  id: number
  method: string
  path: string
  statusCode: number
  durationMs: number | null
  requestBody: string | null
  responseSize: number | null
  ipAddress: string | null
  createdAt: string
}

export type SystemStats = {
  totalUsers: number
  activeUsers: number
  totalLeads: number
  totalMedia: number
  totalPages: number
  totalEmails: number
  totalApiRequests: number
  recentAccessLogs: AccessLog[]
  recentApiLogs: ApiLog[]
}
