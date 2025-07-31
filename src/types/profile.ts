export type ProfileTier = 'emerging' | 'accomplished' | 'distinguished' | 'legacy'

export interface BaseProfileData {
  name: string
  tagline: string
  bio: string
  profileImage?: string
  coverImage?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    instagram?: string
    github?: string
  }
}

export interface EmergingProfileData extends BaseProfileData {
  tier: 'emerging'
  currentRole: string
  company: string
  skills: string[]
  achievements: string[]
  aspirations: string
  projects: {
    title: string
    description: string
    link?: string
    image?: string
  }[]
  gallery: {
    url: string
    caption?: string
  }[] // Max 4 photos
  certifications?: {
    title: string
    organization: string
    year: number
    link?: string
  }[]
  resumeAttachment?: {
    url: string
    filename: string
  }
  videoLinks?: {
    title: string
    url: string
    platform: 'youtube' | 'vimeo' | 'other'
  }[]
}

export interface AccomplishedProfileData extends BaseProfileData {
  tier: 'accomplished'
  currentRole: string
  company: string
  industry: string
  yearsOfExperience: number
  expertise: string[]
  achievements: {
    title: string
    description: string
    year: number
    category?: string
  }[]
  leadership: {
    title: string
    organization: string
    duration: string
    description: string
  }[]
  awards: {
    title: string
    organization: string
    year: number
    description?: string
  }[]
  gallery: {
    url: string
    caption?: string
  }[] // Max 10 photos
  qrCodeEnabled: boolean
  interactiveTimeline: {
    year: number
    event: string
    description: string
    category?: string
  }[]
  certifications?: {
    title: string
    organization: string
    year: number
    link?: string
  }[]
  resumeAttachment?: {
    url: string
    filename: string
  }
  videoLinks?: {
    title: string
    url: string
    platform: 'youtube' | 'vimeo' | 'other'
  }[]
}

export interface DistinguishedProfileData extends BaseProfileData {
  tier: 'distinguished'
  currentRole: string
  company: string
  industry: string
  yearsOfExperience: number
  expertise: string[]
  achievements: {
    title: string
    description: string
    year: number
    impact?: string
    category?: string
  }[]
  leadership: {
    title: string
    organization: string
    duration: string
    description: string
  }[]
  publications?: {
    title: string
    publication: string
    year: number
    link?: string
  }[]
  awards: {
    title: string
    organization: string
    year: number
    description?: string
  }[]
  gallery: {
    url: string
    caption?: string
  }[] // Max 20 photos
  qrCodeEnabled: boolean
  interactiveTimeline: {
    year: number
    event: string
    description: string
    category?: string
  }[]
  certifications?: {
    title: string
    organization: string
    year: number
    link?: string
  }[]
  resumeAttachment?: {
    url: string
    filename: string
  }
  videoLinks?: {
    title: string
    url: string
    platform: 'youtube' | 'vimeo' | 'other'
  }[]
}

export interface LegacyProfileData extends BaseProfileData {
  tier: 'legacy'
  legacy: string
  era: string
  primaryContributions: string[]
  historicalImpact: string
  timeline: {
    year: number
    event: string
    significance: string
  }[]
  quotes: {
    text: string
    context?: string
    year?: number
  }[]
  recognitions: {
    title: string
    organization: string
    year: number
    significance: string
  }[]
  influence: {
    area: string
    description: string
    continuingImpact: string
  }[]
  archives?: {
    title: string
    description: string
    link?: string
    type: 'document' | 'image' | 'video' | 'audio'
  }[]
}

export type ProfileData = EmergingProfileData | AccomplishedProfileData | DistinguishedProfileData | LegacyProfileData

// Enhanced ProfileData interface for Elite Template
export interface EnhancedProfileData {
  id: string
  name: string
  tagline?: string
  heroImage?: string
  biography: string
  aiPolishedBio?: string
  tier: string
  achievements: Array<{
    title: string
    description: string
    year?: string
    category?: string
  }>
  quote?: {
    text: string
    attribution?: string
  }
  gallery: Array<{
    url: string
    caption?: string
  }>
  links: Array<{
    title: string
    url: string
    type: 'website' | 'linkedin' | 'twitter' | 'other'
  }>
  publishedAt?: string
  slug: string
}

export interface ThemeSettings {
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  layout: 'modern' | 'classic' | 'minimal'
  typography: 'serif' | 'sans' | 'mixed'
  accentColor?: string
  backgroundPattern?: 'none' | 'subtle' | 'geometric'
}

export interface Profile {
  id: string
  userId: string
  tier: ProfileTier
  status: 'draft' | 'published' | 'archived'
  slug: string
  data: ProfileData
  themeSettings: ThemeSettings
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentId?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
