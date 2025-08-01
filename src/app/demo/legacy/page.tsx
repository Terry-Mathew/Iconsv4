import { LegacyTemplate } from '@/components/templates/LegacyTemplate'
import { EnhancedProfileData } from '@/types/profile'
import { PageLayout } from '@/components/layout/PageLayout'

// Sample Legacy Profile Data for Eternal Showcase
const sampleLegacyProfile = {
  id: 'demo-legacy-001',
  name: 'Eleanor Whitmore',
  tagline: 'Visionary Philanthropist & Cultural Pioneer (1925-2023)',
  heroImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=2400&h=1600&fit=crop&crop=face',
  bio: {
    original: 'Eleanor Whitmore dedicated her life to advancing education and cultural preservation. Through her foundation, she established over 200 libraries worldwide and funded countless scholarships for underprivileged students. Her legacy continues to inspire generations of learners and cultural advocates.',
    ai_polished: 'Eleanor Whitmore dedicated her life to <strong>advancing education</strong> and <strong>cultural preservation</strong>. Through her foundation, she established over <strong>200 libraries worldwide</strong> and funded countless scholarships for underprivileged students. Her <strong>transformative vision</strong> created lasting change in communities across six continents. Eleanor\'s legacy continues to inspire generations of learners and cultural advocates, embodying the belief that <strong>knowledge is humanity\'s greatest treasure</strong>.'
  },
  tier: 'Legacy',
  quote: {
    text: 'The greatest gift we can give to future generations is not wealth, but wisdom. Every book opened, every mind enlightened, every dream nurtured becomes part of our eternal legacy.',
    attribution: 'Eleanor Whitmore, 1995 Nobel Peace Prize Acceptance Speech'
  },
  achievements: [
    {
      title: 'Founded First Community Library',
      description: 'Established library in rural Alabama, serving over 5,000 residents',
      year: '1947',
      category: 'Education'
    },
    {
      title: 'Established Whitmore Foundation',
      description: 'Created one of the world\'s largest educational charities, awarding over $2 billion in grants',
      year: '1962',
      category: 'Philanthropy'
    },
    {
      title: 'UNESCO Cultural Preservation Ambassador',
      description: 'Led initiatives that saved over 1,000 historical sites worldwide',
      year: '1978',
      category: 'Cultural Preservation'
    },
    {
      title: 'Nobel Peace Prize',
      description: 'First educator to receive the prize for literacy advancement and global education contributions',
      year: '1995',
      category: 'Recognition'
    },
    {
      title: 'Global Education Summit',
      description: 'Hosted summit bringing together world leaders, leading to Universal Education Charter',
      year: '2010',
      category: 'Leadership'
    }
  ],
  gallery: [
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      caption: 'Eleanor at the opening of her 100th library in Kenya, 1985'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      caption: 'Nobel Peace Prize ceremony, Oslo, 1995'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
      caption: 'Teaching children in rural Cambodia, 1992'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      caption: 'Global Education Summit keynote, 2010'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      caption: 'With UNESCO delegation in Egypt, 1980'
    },
    {
      type: 'image' as const,
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Foundation board meeting, 1990'
    }
  ],
  links: [
    {
      title: 'Whitmore Foundation',
      url: 'https://whitmoreFoundation.org',
      type: 'website' as const
    },
    {
      title: 'UNESCO Memorial',
      url: 'https://unesco.org/memorial/eleanor-whitmore',
      type: 'other' as const
    },
    {
      title: 'Nobel Prize Biography',
      url: 'https://nobelprize.org/prizes/peace/1995/whitmore',
      type: 'other' as const
    }
  ],
  publishedAt: '2023-12-15T00:00:00Z',
  slug: 'eleanor-whitmore'
}

export const metadata = {
  title: 'Eleanor Whitmore - Eternal Legacy Profile | ICONS HERALD',
  description: 'Preserve Eleanor Whitmore\'s timeless impact in our exclusive vault—enhanced with AI for profound narratives.',
  robots: 'noindex', // Demo page
}

export default function LegacyDemoPage() {
  return (
    <PageLayout>
      <LegacyTemplate profile={sampleLegacyProfile} />
    </PageLayout>
  )
}
