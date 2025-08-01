import { z } from 'zod'

// Enhanced validation schemas for profile builder
export const profileBuilderSchema = z.object({
  // Basic Information (Step 2)
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
  
  tagline: z.string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(150, 'Tagline must be less than 150 characters')
    .optional(),
  
  heroImage: z.string()
    .url('Please provide a valid image URL')
    .optional()
    .or(z.literal('')),

  // Biography (Step 3)
  bio: z.object({
    original: z.string()
      .min(100, 'Biography must be at least 100 characters')
      .max(5000, 'Biography must be less than 5000 characters'),
    ai_polished: z.string().optional(),
  }),

  // Achievements (Step 4)
  achievements: z.array(z.object({
    title: z.string()
      .min(3, 'Achievement title must be at least 3 characters')
      .max(200, 'Achievement title must be less than 200 characters'),
    description: z.string()
      .min(10, 'Achievement description must be at least 10 characters')
      .max(1000, 'Achievement description must be less than 1000 characters'),
    year: z.string()
      .regex(/^\d{4}$/, 'Year must be a 4-digit number')
      .optional()
      .or(z.literal('')),
    category: z.enum([
      'professional', 'academic', 'creative', 'leadership', 
      'community', 'awards', 'publications', 'other'
    ]).optional(),
    order: z.number().optional(),
  })).min(1, 'At least one achievement is required'),

  // Links & Media (Step 5)
  links: z.array(z.object({
    title: z.string()
      .min(2, 'Link title must be at least 2 characters')
      .max(100, 'Link title must be less than 100 characters'),
    url: z.string()
      .url('Please provide a valid URL')
      .refine((url) => {
        // Additional URL validation for common social platforms
        const validDomains = [
          'linkedin.com', 'twitter.com', 'github.com', 'instagram.com',
          'facebook.com', 'youtube.com', 'medium.com', 'behance.net',
          'dribbble.com', 'portfolio.com'
        ]
        try {
          const domain = new URL(url).hostname.replace('www.', '')
          return validDomains.some(validDomain => domain.includes(validDomain)) || 
                 url.startsWith('https://') // Allow any HTTPS URL
        } catch {
          return false
        }
      }, 'Please provide a valid social media or professional website URL'),
    type: z.enum(['website', 'linkedin', 'twitter', 'github', 'portfolio', 'other']),
  })).optional(),

  gallery: z.array(z.object({
    url: z.string().url('Please provide a valid image URL'),
    caption: z.string()
      .max(200, 'Caption must be less than 200 characters')
      .optional(),
    type: z.enum(['image', 'video']),
    order: z.number().optional(),
  })).optional(),

  // Meta fields
  tier: z.enum(['rising', 'elite', 'legacy']),
  isPublic: z.boolean().default(true),
  analyticsEnabled: z.boolean().default(true),
})

// Step-specific validation schemas
export const stepValidationSchemas = {
  tierSelection: z.object({
    tier: z.enum(['rising', 'elite', 'legacy']),
  }),
  
  basicInfo: z.object({
    name: profileBuilderSchema.shape.name,
    tagline: profileBuilderSchema.shape.tagline,
    heroImage: profileBuilderSchema.shape.heroImage,
  }),
  
  biography: z.object({
    bio: profileBuilderSchema.shape.bio,
  }),
  
  achievements: z.object({
    achievements: profileBuilderSchema.shape.achievements,
  }),
  
  linksMedia: z.object({
    links: profileBuilderSchema.shape.links,
    gallery: profileBuilderSchema.shape.gallery,
  }),
  
  preview: profileBuilderSchema,
}

// Validation helper functions
export const validateStep = (step: keyof typeof stepValidationSchemas, data: any) => {
  try {
    stepValidationSchemas[step].parse(data)
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join('.')
        fieldErrors[path] = err.message
      })
      return { success: false, errors: fieldErrors }
    }
    return { success: false, errors: { general: 'Validation failed' } }
  }
}

// Real-time field validation
export const validateField = (fieldName: string, value: any, schema: z.ZodSchema) => {
  try {
    schema.parse(value)
    return { isValid: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid value' }
    }
    return { isValid: false, error: 'Validation failed' }
  }
}

// Achievement category configurations
export const achievementCategories = {
  professional: {
    label: 'Professional',
    color: 'blue',
    icon: '💼',
    description: 'Career milestones, promotions, and work achievements'
  },
  academic: {
    label: 'Academic',
    color: 'green',
    icon: '🎓',
    description: 'Educational achievements, degrees, and certifications'
  },
  creative: {
    label: 'Creative',
    color: 'purple',
    icon: '🎨',
    description: 'Artistic works, creative projects, and innovations'
  },
  leadership: {
    label: 'Leadership',
    color: 'orange',
    icon: '👑',
    description: 'Leadership roles, team management, and organizational impact'
  },
  community: {
    label: 'Community',
    color: 'teal',
    icon: '🤝',
    description: 'Volunteer work, community service, and social impact'
  },
  awards: {
    label: 'Awards',
    color: 'yellow',
    icon: '🏆',
    description: 'Recognition, honors, and competitive achievements'
  },
  publications: {
    label: 'Publications',
    color: 'cyan',
    icon: '📚',
    description: 'Books, articles, research papers, and media features'
  },
  other: {
    label: 'Other',
    color: 'gray',
    icon: '⭐',
    description: 'Other significant accomplishments and milestones'
  }
} as const

export type AchievementCategory = keyof typeof achievementCategories
export type ProfileBuilderData = z.infer<typeof profileBuilderSchema>
export type StepData = {
  [K in keyof typeof stepValidationSchemas]: z.infer<typeof stepValidationSchemas[K]>
}
