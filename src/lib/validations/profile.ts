import { z } from 'zod'

// Enhanced URL validation with media type checking
const urlSchema = z.string().url().refine((url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}, 'Invalid URL format')

const imageUrlSchema = urlSchema.refine((url) => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  const urlPath = new URL(url).pathname.toLowerCase()
  return validExtensions.some(ext => urlPath.endsWith(ext)) ||
         url.includes('supabase') || // Supabase Storage URLs
         url.includes('cloudinary') || // Common CDN
         url.includes('imgur') // Common image host
}, 'Must be a valid image URL')

const videoUrlSchema = z.union([
  urlSchema.refine((url) => {
    const validExtensions = ['.mp4', '.webm']
    const urlPath = new URL(url).pathname.toLowerCase()
    return validExtensions.some(ext => urlPath.endsWith(ext)) ||
           url.includes('supabase') // Supabase Storage URLs
  }, 'Must be a valid video file URL'),
  urlSchema.refine((url) => {
    // YouTube, Vimeo, etc. embed URLs
    return url.includes('youtube.com/embed/') ||
           url.includes('youtu.be/') ||
           url.includes('vimeo.com/') ||
           url.includes('player.vimeo.com/')
  }, 'Must be a valid video URL or embed')
])

// Timestamp schema for array objects
const timestampSchema = z.object({
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})

// Single superset JSONB schema with ALL fields optional
export const profileContentSchema = z.object({
  // Base fields (all tiers)
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  tagline: z.string().max(200).optional(),
  bio: z.object({
    original: z.string().min(50, 'Bio must be at least 50 characters').max(2000),
    ai_polished: z.string().max(3000).optional()
  }),

  // Media fields with enhanced validation
  heroImage: imageUrlSchema.optional(),
  heroVideo: videoUrlSchema.optional(),
  gallery: z.array(z.object({
    url: z.union([imageUrlSchema, videoUrlSchema]),
    caption: z.string().max(200).optional(),
    type: z.enum(['image', 'video']).default('image'),
    year: z.string().max(4).optional(),
    ...timestampSchema.shape
  })).optional(),

  // Section visibility controls with smart defaults
  sections: z.object({
    achievements: z.object({
      visible: z.boolean().default(true),
      auto_hide_if_empty: z.boolean().default(true)
    }).optional(),
    timeline: z.object({
      visible: z.boolean().default(true),
      auto_hide_if_empty: z.boolean().default(true)
    }).optional(),
    gallery: z.object({
      visible: z.boolean().default(true),
      auto_hide_if_empty: z.boolean().default(true)
    }).optional(),
    milestones: z.object({
      visible: z.boolean().default(true),
      auto_hide_if_empty: z.boolean().default(true)
    }).optional(),
    leadershipHighlights: z.object({
      visible: z.boolean().default(true),
      auto_hide_if_empty: z.boolean().default(true)
    }).optional(),
    tributes: z.object({
      visible: z.boolean().default(true),
      auto_hide_if_empty: z.boolean().default(true)
    }).optional()
  }).optional(),

  // Rising-specific sections (optional for other tiers)
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required').max(100),
    description: z.string().min(10, 'Description is required').max(500),
    date: z.string().min(1, 'Date is required'),
    category: z.string().max(50).optional(),
    ...timestampSchema.shape
  })).optional(),

  inspirations: z.array(z.object({
    quote: z.string().min(10, 'Quote is required').max(500),
    author: z.string().min(1, 'Author is required').max(100),
    context: z.string().max(200).optional(),
    ...timestampSchema.shape
  })).optional(),

  futureVision: z.object({
    original: z.string().max(1000).optional(),
    ai_polished: z.string().max(1500).optional()
  }).optional(),

  // Elite-specific sections (optional for other tiers)
  leadershipHighlights: z.array(z.object({
    title: z.string().min(1, 'Leadership title is required').max(100),
    organization: z.string().min(1, 'Organization is required').max(100),
    duration: z.string().min(1, 'Duration is required').max(50),
    description: z.string().min(10, 'Description is required').max(500),
    impact: z.string().max(500).optional(),
    ...timestampSchema.shape
  })).optional(),

  impactMetrics: z.array(z.object({
    metric: z.string().min(1, 'Metric name is required').max(100),
    value: z.string().min(1, 'Value is required').max(50),
    description: z.string().max(200).optional(),
    ...timestampSchema.shape
  })).optional(),

  featuredPress: z.array(z.object({
    title: z.string().min(1, 'Article title is required').max(200),
    publication: z.string().min(1, 'Publication is required').max(100),
    url: urlSchema,
    date: z.string().min(1, 'Date is required'),
    excerpt: z.string().max(300).optional(),
    ...timestampSchema.shape
  })).optional(),

  // Legacy-specific sections (optional for other tiers)
  timeline: z.array(z.object({
    year: z.number().min(1800).max(new Date().getFullYear()),
    event: z.string().min(1, 'Event description is required').max(200),
    significance: z.string().min(10, 'Significance is required').max(500),
    ...timestampSchema.shape
  })).optional(),

  enduringContributions: z.object({
    original: z.string().max(2000).optional(),
    ai_polished: z.string().max(3000).optional()
  }).optional(),

  tributes: z.array(z.object({
    text: z.string().min(10, 'Tribute text is required').max(1000),
    author: z.string().min(1, 'Author is required').max(100),
    relationship: z.string().max(100).optional(),
    date: z.string().optional(),
    ...timestampSchema.shape
  })).optional(),

  archivalNotes: z.object({
    original: z.string().max(1000).optional(),
    ai_polished: z.string().max(1500).optional()
  }).optional(),

  // Common optional fields (available across all tiers)
  achievements: z.array(z.object({
    title: z.string().min(1, 'Achievement title is required').max(200),
    description: z.string().min(10, 'Description is required').max(1000),
    year: z.string().max(4).optional(),
    category: z.string().max(50).optional(),
    ...timestampSchema.shape
  })).optional(),

  quote: z.object({
    text: z.string().min(10, 'Quote text is required').max(1000),
    attribution: z.string().max(200).optional()
  }).optional(),

  links: z.array(z.object({
    title: z.string().min(1, 'Link title is required').max(100),
    url: urlSchema,
    type: z.enum(['website', 'linkedin', 'twitter', 'other']).default('other'),
    ...timestampSchema.shape
  })).optional()
}).strict()

// Auto-hide empty sections refinement
export const profileContentSchemaWithAutoHide = profileContentSchema.transform((data) => {
  const sections = data.sections || {}

  // Auto-set visibility to false if data is empty and auto_hide_if_empty is true
  if (sections.achievements?.auto_hide_if_empty && (!data.achievements || data.achievements.length === 0)) {
    sections.achievements.visible = false
  }
  if (sections.timeline?.auto_hide_if_empty && (!data.timeline || data.timeline.length === 0)) {
    sections.timeline.visible = false
  }
  if (sections.gallery?.auto_hide_if_empty && (!data.gallery || data.gallery.length === 0)) {
    sections.gallery.visible = false
  }
  if (sections.milestones?.auto_hide_if_empty && (!data.milestones || data.milestones.length === 0)) {
    sections.milestones.visible = false
  }
  if (sections.leadershipHighlights?.auto_hide_if_empty && (!data.leadershipHighlights || data.leadershipHighlights.length === 0)) {
    sections.leadershipHighlights.visible = false
  }
  if (sections.tributes?.auto_hide_if_empty && (!data.tributes || data.tributes.length === 0)) {
    sections.tributes.visible = false
  }

  return { ...data, sections }
})

// Theme settings schema
export const themeSettingsSchema = z.object({
  colorScheme: z.enum(['blue', 'green', 'purple', 'orange', 'red']),
  layout: z.enum(['modern', 'classic', 'minimal']),
  typography: z.enum(['serif', 'sans', 'mixed']),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  backgroundPattern: z.enum(['none', 'subtle', 'geometric']),
})

// Export types
export type ProfileContentData = z.infer<typeof profileContentSchema>
export type ProfileContentDataWithAutoHide = z.infer<typeof profileContentSchemaWithAutoHide>
export type ThemeSettingsFormData = z.infer<typeof themeSettingsSchema>

// Utility functions for timestamp management
export const addTimestamps = (data: any) => {
  const now = new Date().toISOString()
  return {
    ...data,
    created_at: data.created_at || now,
    updated_at: now
  }
}

export const updateTimestamps = (data: any) => {
  return {
    ...data,
    updated_at: new Date().toISOString()
  }
}

// Helper function to check if section should be visible
export const shouldShowSection = (
  sectionName: string,
  data: any[],
  sections: any = {}
): boolean => {
  const sectionConfig = sections[sectionName]
  if (sectionConfig?.visible === false) return false
  if (sectionConfig?.auto_hide_if_empty && (!data || data.length === 0)) return false
  return data && data.length > 0
}

// Legacy compatibility - keep existing exports but mark as deprecated
/** @deprecated Use profileContentSchema instead */
export const profileDataSchema = profileContentSchema
/** @deprecated Use ProfileContentData instead */
export type ProfileFormData = ProfileContentData

// Export validation functions
export const validateProfileContent = (data: unknown) => {
  return profileContentSchemaWithAutoHide.safeParse(data)
}

export const validateMediaUrl = (url: string, type: 'image' | 'video') => {
  const schema = type === 'image' ? imageUrlSchema : videoUrlSchema
  return schema.safeParse(url)
}
