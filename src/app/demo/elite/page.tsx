import { EliteTemplate } from '@/components/templates/EliteTemplate'
import { EnhancedProfileData } from '@/types/profile'

// Sample Elite Profile Data for $50,000 Premium Showcase
const sampleEliteProfile: EnhancedProfileData = {
  id: 'demo-elite-001',
  name: 'Alexandra Sterling',
  tagline: 'Visionary CEO & Global Innovation Leader',
  heroImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=2400&h=1600&fit=crop&crop=face',
  biography: 'Alexandra Sterling stands as one of the most influential leaders in global technology and sustainable innovation. With over two decades of transformative leadership, she has redefined what it means to build companies that not only achieve unprecedented success but also create lasting positive impact on society and the environment.',
  aiPolishedBio: 'Alexandra Sterling stands as one of the most <strong>influential leaders</strong> in global technology and sustainable innovation. With over two decades of <strong>transformative leadership</strong>, she has redefined what it means to build companies that not only achieve <strong>unprecedented success</strong> but also create lasting positive impact on society and the environment. Her visionary approach to <strong>conscious capitalism</strong> has inspired a new generation of entrepreneurs to prioritize purpose alongside profit.',
  tier: 'Elite',
  achievements: [
    {
      title: 'Forbes Global CEO of the Year',
      description: 'Recognized for revolutionary leadership in sustainable technology and achieving 300% growth while maintaining carbon neutrality.',
      year: '2024',
      category: 'Leadership Excellence'
    },
    {
      title: 'UN Global Compact Pioneer Award',
      description: 'Honored for groundbreaking initiatives that transformed industry standards for environmental responsibility.',
      year: '2023',
      category: 'Sustainability Impact'
    },
    {
      title: 'Harvard Business Review Innovator',
      description: 'Featured for developing the "Conscious Growth Framework" adopted by Fortune 500 companies worldwide.',
      year: '2022',
      category: 'Innovation Leadership'
    },
    {
      title: 'Time Magazine 100 Most Influential',
      description: 'Listed among global changemakers for pioneering ethical AI development and implementation.',
      year: '2021',
      category: 'Global Influence'
    }
  ],
  quote: {
    text: 'True leadership is not about commanding from the top, but about empowering others to reach heights they never thought possible. When we lead with purpose, profit follows naturally.',
    attribution: 'Alexandra Sterling, Harvard Business Review Interview 2024'
  },
  gallery: [
    {
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      caption: 'Speaking at the Global Innovation Summit 2024'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop',
      caption: 'Leading the sustainable technology initiative'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Team collaboration at Sterling Innovations HQ'
    },
    {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      caption: 'Mentoring next-generation leaders'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&h=600&fit=crop',
      caption: 'Strategic planning session'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=800&h=600&fit=crop',
      caption: 'Innovation lab tour with investors'
    },
    {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      caption: 'Keynote at Tech for Good Conference'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop',
      caption: 'Celebrating team achievements'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Board meeting presentation'
    },
    {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      caption: 'Industry roundtable discussion'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&h=600&fit=crop',
      caption: 'Product launch event'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=800&h=600&fit=crop',
      caption: 'Awards ceremony recognition'
    },
    {
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      caption: 'Global leadership summit'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop',
      caption: 'Sustainable innovation showcase'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      caption: 'Executive team retreat'
    },
    {
      url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop',
      caption: 'Investor relations meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=800&h=600&fit=crop',
      caption: 'Technology demonstration'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=800&h=600&fit=crop',
      caption: 'Partnership announcement'
    },
    {
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      caption: 'Thought leadership panel'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop',
      caption: 'Innovation workshop facilitation'
    }
  ],
  links: [
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/alexandra-sterling',
      type: 'linkedin'
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/alexsterling',
      type: 'twitter'
    },
    {
      title: 'Sterling Innovations',
      url: 'https://sterlinginnovations.com',
      type: 'website'
    },
    {
      title: 'TED Talks',
      url: 'https://ted.com/speakers/alexandra-sterling',
      type: 'other'
    }
  ],
  publishedAt: '2024-01-15T00:00:00Z',
  slug: 'alexandra-sterling'
}

export const metadata = {
  title: 'Alexandra Sterling - Elite Icon Profile | ICONS HERALD',
  description: 'Discover Alexandra Sterling\'s commanding legacy in our exclusive archive—crafted with AI precision for timeless impact.',
  robots: 'noindex', // Demo page
}

export default function EliteDemoPage() {
  return <EliteTemplate profile={sampleEliteProfile} />
}
