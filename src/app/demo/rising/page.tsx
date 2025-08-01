import { RisingTemplate } from '@/components/templates/RisingTemplate'
import { ProfileContentData } from '@/lib/validations/profile'
import { PageLayout } from '@/components/layout/PageLayout'

// Sample Rising Profile Data for Aspirational Showcase
const sampleRisingProfile: ProfileContentData & {
  id: string
  slug: string
  tier: string
  publishedAt?: string
} = {
  id: 'demo-rising-001',
  slug: 'jordan-chen',
  tier: 'rising',
  publishedAt: '2024-01-15T00:00:00Z',
  name: 'Jordan Chen',
  tagline: 'Emerging Tech Innovator & Sustainable Design Advocate',
  heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2400&h=1600&fit=crop&crop=face',
  bio: {
    original: 'Jordan Chen represents the next generation of conscious innovators, combining cutting-edge technology with sustainable design principles. As a rising star in the tech industry, Jordan is passionate about creating solutions that not only push technological boundaries but also contribute to a more sustainable and equitable future.',
    ai_polished: 'Jordan Chen represents the <strong>next generation</strong> of conscious innovators, combining cutting-edge technology with <strong>sustainable design principles</strong>. As a rising star in the tech industry, Jordan is passionate about creating solutions that not only push <strong>technological boundaries</strong> but also contribute to a more sustainable and equitable future. Their work focuses on <strong>human-centered design</strong> and the intersection of technology with environmental responsibility.'
  },
  achievements: [
    {
      title: 'Young Innovator Award',
      description: 'Recognized by Tech for Good Foundation for developing an AI-powered waste reduction app that helped 10,000+ users reduce their carbon footprint.',
      year: '2024',
      category: 'Innovation'
    },
    {
      title: 'Sustainable Design Challenge Winner',
      description: 'First place in the Global Sustainable Design Challenge for creating a circular economy platform connecting local businesses.',
      year: '2023',
      category: 'Sustainability'
    },
    {
      title: 'Open Source Contributor',
      description: 'Active contributor to 15+ open source projects focused on accessibility and environmental impact measurement.',
      year: '2023',
      category: 'Community Impact'
    },
    {
      title: 'Mentorship Program Graduate',
      description: 'Completed prestigious Tech Leaders Mentorship Program, working directly with industry veterans on scalable solutions.',
      year: '2022',
      category: 'Professional Development'
    }
  ],
  gallery: [
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      caption: 'Presenting at Sustainable Tech Conference 2024'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      caption: 'Collaborating on open source projects'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
      caption: 'Working on sustainable design solutions'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Team brainstorming session'
    }
  ],
  links: [
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/jordan-chen',
      type: 'linkedin'
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/jordanchen_tech',
      type: 'twitter'
    },
    {
      title: 'Portfolio',
      url: 'https://jordanchen.dev',
      type: 'website'
    },
    {
      title: 'GitHub',
      url: 'https://github.com/jordanchen',
      type: 'other'
    }
  ]
}

export const metadata = {
  title: 'Jordan Chen - Rising Icon Profile | ICONS HERALD',
  description: 'Explore Jordan Chen\'s emerging brilliance in our exclusive archive—crafted with AI precision for inspirational impact.',
  robots: 'noindex', // Demo page
}

export default function RisingDemoPage() {
  return (
    <PageLayout>
      <RisingTemplate profile={sampleRisingProfile} />
    </PageLayout>
  )
}
