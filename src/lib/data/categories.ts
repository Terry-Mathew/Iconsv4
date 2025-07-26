import {
  Cpu,
  TrendingUp,
  Palette,
  Microscope,
  Heart,
  Trophy,
  GraduationCap,
  Stethoscope,
  Scale,
  Newspaper,
  Film,
  Sparkles
} from 'lucide-react'

export interface CategoryData {
  id: string
  name: string
  description: string
  icon: any
  color: string
  gradient: string
}

export const categories: CategoryData[] = [
  {
    id: 'technology-innovation',
    name: 'Technology & Innovation',
    description: 'Visionaries reshaping tomorrow through breakthrough technologies and digital transformation that redefine human possibility.',
    icon: Cpu,
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
  },
  {
    id: 'business-entrepreneurship',
    name: 'Business & Entrepreneurship',
    description: 'Empire builders and market disruptors who redefine industries with bold ventures and transformative business acumen.',
    icon: TrendingUp,
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)'
  },
  {
    id: 'arts-culture',
    name: 'Arts & Culture',
    description: 'Creative luminaries whose artistic expressions transcend boundaries, inspire generations, and shape cultural discourse.',
    icon: Palette,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
  },
  {
    id: 'science-research',
    name: 'Science & Research',
    description: 'Pioneering minds advancing human knowledge through groundbreaking discoveries that unlock the mysteries of our universe.',
    icon: Microscope,
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
  },
  {
    id: 'social-impact-activism',
    name: 'Social Impact & Activism',
    description: 'Change agents championing justice and creating lasting societal transformation through courage and unwavering dedication.',
    icon: Heart,
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  },
  {
    id: 'sports-athletics',
    name: 'Sports & Athletics',
    description: 'Elite performers who embody excellence, push human limits, and inspire through athletic mastery and competitive spirit.',
    icon: Trophy,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  },
  {
    id: 'education-academia',
    name: 'Education & Academia',
    description: 'Intellectual leaders shaping minds, advancing scholarly pursuit, and nurturing the next generation of thinkers.',
    icon: GraduationCap,
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
  },
  {
    id: 'healthcare-medicine',
    name: 'Healthcare & Medicine',
    description: 'Healing innovators dedicated to advancing human health, pioneering medical breakthroughs, and saving lives.',
    icon: Stethoscope,
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
  },
  {
    id: 'politics-public-service',
    name: 'Politics & Public Service',
    description: 'Statesmen and public servants committed to governance excellence, civic duty, and building better societies.',
    icon: Scale,
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
  },
  {
    id: 'media-journalism',
    name: 'Media & Journalism',
    description: 'Truth-seekers and storytellers who inform, investigate, and illuminate the world through fearless reporting.',
    icon: Newspaper,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Cultural icons who captivate audiences, define popular culture, and create lasting artistic legacies.',
    icon: Film,
    color: '#DC2626',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
  },
  {
    id: 'other',
    name: 'Exceptional Individuals',
    description: 'Remarkable figures whose unique contributions defy conventional categorization and redefine what it means to be iconic.',
    icon: Sparkles,
    color: '#D4AF37',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)'
  }
]

export const getCategoryById = (id: string): CategoryData | undefined => {
  return categories.find(category => category.id === id)
}

export const getCategoryByName = (name: string): CategoryData | undefined => {
  return categories.find(category => category.name === name)
}
