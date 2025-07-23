import { LegacyTemplate } from '@/components/templates/LegacyTemplate'
import { EnhancedProfileData } from '@/types/profile'

// Sample Legacy Profile Data for Eternal Showcase
const sampleLegacyProfile: EnhancedProfileData = {
  id: 'demo-legacy-001',
  name: 'Eleanor Whitmore',
  tagline: 'Visionary Philanthropist & Cultural Pioneer (1925-2023)',
  heroImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=2400&h=1600&fit=crop&crop=face',
  heroVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  biography: 'Eleanor Whitmore dedicated her life to advancing education and cultural preservation. Through her foundation, she established over 200 libraries worldwide and funded countless scholarships for underprivileged students. Her legacy continues to inspire generations of learners and cultural advocates.',
  aiPolishedBio: 'Eleanor Whitmore dedicated her life to <strong>advancing education</strong> and <strong>cultural preservation</strong>. Through her foundation, she established over <strong>200 libraries worldwide</strong> and funded countless scholarships for underprivileged students. Her <strong>transformative vision</strong> created lasting change in communities across six continents. Eleanor\'s legacy continues to inspire generations of learners and cultural advocates, embodying the belief that <strong>knowledge is humanity\'s greatest treasure</strong>.',
  tier: 'Legacy',
  quote: {
    text: 'The greatest gift we can give to future generations is not wealth, but wisdom. Every book opened, every mind enlightened, every dream nurtured becomes part of our eternal legacy.',
    attribution: 'Eleanor Whitmore, 1995 Nobel Peace Prize Acceptance Speech'
  },
  timeline: [
    {
      year: 1925,
      event: 'Born in Cambridge, Massachusetts to a family of educators and social reformers.',
      significance: 'Early exposure to education and social reform shaped her worldview.'
    },
    {
      year: 1947,
      event: 'Founded First Community Library in rural Alabama, serving over 5,000 residents.',
      significance: 'This marked the beginning of her lifelong mission to democratize access to knowledge.'
    },
    {
      year: 1962,
      event: 'Established Whitmore Foundation, creating one of the world\'s largest educational charities.',
      significance: 'The foundation has since awarded over $2 billion in educational grants.'
    },
    {
      year: 1978,
      event: 'Appointed as UNESCO\'s first Cultural Preservation Ambassador.',
      significance: 'Led initiatives that saved over 1,000 historical sites worldwide.'
    },
    {
      year: 1995,
      event: 'Awarded Nobel Peace Prize for contributions to global education and cultural understanding.',
      significance: 'First educator to receive the prize for literacy advancement.'
    },
    {
      year: 2010,
      event: 'Hosted the first Global Education Summit, bringing together world leaders.',
      significance: 'Led to the creation of the Universal Education Charter.'
    },
    {
      year: 2023,
      event: 'Passed peacefully, leaving behind a transformed world of learning.',
      significance: 'Her foundation continues her work, touching millions of lives annually.'
    }
  ],
  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      caption: 'Eleanor at the opening of her 100th library in Kenya, 1985',
      year: '1985'
    },
    {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      caption: 'Nobel Peace Prize ceremony, Oslo, 1995',
      year: '1995'
    },
    {
      url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop',
      caption: 'Teaching children in rural Cambodia, 1992',
      year: '1992'
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      caption: 'Global Education Summit keynote, 2010',
      year: '2010'
    },
    {
      url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      caption: 'With UNESCO delegation in Egypt, 1980',
      year: '1980'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Foundation board meeting, 1990',
      year: '1990'
    }
  ],
  legacyStatement: 'Eleanor Whitmore\'s vision of universal access to education and cultural preservation continues through the Whitmore Foundation. Her belief that "knowledge belongs to all humanity" has shaped educational policy worldwide and will guide future generations toward a more enlightened world.',
  links: [
    {
      title: 'Whitmore Foundation',
      url: 'https://whitmoreFoundation.org',
      type: 'website'
    },
    {
      title: 'UNESCO Memorial',
      url: 'https://unesco.org/memorial/eleanor-whitmore',
      type: 'other'
    },
    {
      title: 'Nobel Prize Biography',
      url: 'https://nobelprize.org/prizes/peace/1995/whitmore',
      type: 'other'
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
  return <LegacyTemplate profile={sampleLegacyProfile} />
}
