import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { ProfileData, ThemeSettings, EnhancedProfileData } from '@/types/profile'
import { RisingTemplate } from '@/components/templates/RisingTemplate'
import { EliteTemplate } from '@/components/templates/EliteTemplate'
import { LegacyTemplate } from '@/components/templates/LegacyTemplate'

interface ProfilePageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const supabase = await createServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!profile) {
    return {
      title: 'Profile Not Found - Icons Herald',
      description: 'The requested profile could not be found.',
    }
  }

  const profileData = profile.data as ProfileData
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iconsherald.com'
  const profileUrl = `${baseUrl}/profile/${params.slug}`

  const tierLabel = profile.tier === 'elite' ? 'Elite' :
                   profile.tier === 'legacy' ? 'Legacy' : 'Rising'
  const description = profile.tier === 'elite' ?
    `Discover ${profileData.name}'s commanding legacy in our exclusive archive—crafted with AI precision for timeless impact.` :
    profileData.bio.substring(0, 160) + '...'

  return {
    title: `${profileData.name} - ${tierLabel} Icon Profile | ICONS HERALD`,
    description: description,
    keywords: [
      profileData.name,
      `${tierLabel} tier`,
      'ICONS HERALD',
      'elite profile',
      'digital archive',
      'legacy preservation',
      'AI-enhanced biography'
    ],
    authors: [{ name: 'ICONS HERALD' }],
    openGraph: {
      title: `${profileData.name} - ${tierLabel} Icon Profile | ICONS HERALD`,
      description: description,
      url: profileUrl,
      siteName: 'ICONS HERALD',
      images: [
        {
          url: profileData.profileImage || `${baseUrl}/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: `${profileData.name} - ${tierLabel} Profile`,
        },
      ],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profileData.name} - ${tierLabel} Icon Profile`,
      description: description,
      images: [profileData.profileImage || `${baseUrl}/og-default.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: profileUrl,
    },
    other: {
      'profile:first_name': profileData.name.split(' ')[0],
      'profile:last_name': profileData.name.split(' ').slice(1).join(' '),
      'profile:username': params.slug,
    },
  }
}

// Generate static params for ISR
export async function generateStaticParams() {
  const supabase = await createServerClient()
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('slug')
    .eq('status', 'published')
    .limit(100) // Limit for build time

  return profiles?.map((profile) => ({
    slug: profile.slug,
  })) || []
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createServerClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (error || !profile) {
    notFound()
  }

  const profileData = profile.data as ProfileData
  const themeSettings = profile.theme_settings as ThemeSettings

  // Transform data for Elite template
  const transformedProfile = {
    id: profile.id,
    name: profileData.name,
    tagline: profileData.tagline,
    heroImage: profileData.profileImage,
    biography: profileData.bio,
    aiPolishedBio: profileData.aiPolishedBio,
    tier: profile.tier,
    achievements: profileData.achievements || [],
    quote: profileData.quote || null,
    gallery: profileData.gallery || [],
    links: profileData.socialLinks ? Object.entries(profileData.socialLinks).map(([type, url]) => ({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      url: url as string,
      type: type as 'website' | 'linkedin' | 'twitter' | 'other'
    })) : [],
    publishedAt: profile.published_at,
    slug: profile.slug,
  }

  // Render the appropriate template based on tier
  const renderTemplate = () => {
    switch (profile.tier) {
      case 'elite':
        return <EliteTemplate profile={transformedProfile} />
      case 'legacy':
        return <LegacyTemplate data={profileData as any} theme={themeSettings} />
      case 'rising':
      default:
        return <RisingTemplate data={profileData as any} theme={themeSettings} />
    }
  }

  return (
    <>
      {/* JSON-LD structured data for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profileData.name,
            description: profileData.bio,
            image: profileData.profileImage,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/${params.slug}`,
            sameAs: Object.values(profileData.socialLinks || {}).filter(Boolean),
            jobTitle: 'currentRole' in profileData ? profileData.currentRole : undefined,
            worksFor: 'company' in profileData ? {
              '@type': 'Organization',
              name: profileData.company,
            } : undefined,
            address: profileData.location ? {
              '@type': 'PostalAddress',
              addressLocality: profileData.location,
            } : undefined,
          }),
        }}
      />
      {renderTemplate()}
    </>
  )
}

// Enable ISR with revalidation - 24 hours for Elite profiles
export const revalidate = 86400 // Revalidate every 24 hours
