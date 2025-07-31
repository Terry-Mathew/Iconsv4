import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createPublicServerClient, createServerClient } from '@/lib/supabase/server'
import { ProfileData } from '@/types/profile'
import { EmergingTemplate } from '@/components/templates/EmergingTemplate'
import { AccomplishedTemplate } from '@/components/templates/AccomplishedTemplate'
import { DistinguishedTemplate } from '@/components/templates/DistinguishedTemplate'
import { LegacyTemplate } from '@/components/templates/LegacyTemplate'
import { PreviewWatermark } from '@/components/ui/PreviewWatermark'

interface ProfilePageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params, searchParams }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'

  // Use appropriate client based on preview mode
  const supabase = isPreview ? await createServerClient() : createPublicServerClient()

  let profile

  if (isPreview) {
    // For preview mode, fetch from drafts table
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return {
        title: 'Unauthorized - Icons Herald',
        description: 'Authentication required for preview mode.',
      }
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    profile = data
  } else {
    // For public mode, fetch from published profiles
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    profile = data
  }

  if (!profile) {
    return {
      title: 'Profile Not Found - Icons Herald',
      description: 'The requested profile could not be found.',
    }
  }

  const profileData = profile.content as unknown as ProfileData
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iconsherald.com'
  const profileUrl = `${baseUrl}/profile/${slug}`

  const tierLabel = profile.tier === 'elite' ? 'Elite' :
                   profile.tier === 'legacy' ? 'Legacy' : 'Rising'
  const description = profile.tier === 'elite' ?
    `Discover ${profileData.name}'s commanding legacy in our exclusive archive—crafted with AI precision for timeless impact.` :
    ((profileData as any).bio?.original || (profileData as any).bio || '').substring(0, 160) + '...'

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
      'profile:username': slug,
    },
  }
}

// Generate static params for ISR
export async function generateStaticParams() {
  const supabase = createPublicServerClient()
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('slug')
    .eq('status', 'published')
    .limit(100) // Limit for build time

  return profiles?.map((profile) => ({
    slug: profile.slug,
  })) || []
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'

  // Use appropriate client based on preview mode
  const supabase = isPreview ? await createServerClient() : createPublicServerClient()

  let profile
  let user = null

  if (isPreview) {
    // For preview mode, require authentication and fetch draft
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    if (authError || !authUser) {
      redirect('/auth/signin?redirect=' + encodeURIComponent(`/profile/${slug}?preview=true`))
    }

    user = authUser

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('user_id', authUser.id)
      .eq('status', 'draft')
      .single()

    profile = data

    if (error || !profile) {
      notFound()
    }
  } else {
    // For public mode, fetch published profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    profile = data

    if (error || !profile) {
      notFound()
    }
  }

  const profileData = profile.content as unknown as ProfileData

  // Transform data for template compatibility - pass through all fields from published content
  const transformedProfile = {
    id: profile.id,
    name: profileData.name || '',
    tagline: profileData.tagline || '',
    heroImage: profileData.profileImage || '',
    biography: (profileData as any).bio?.original || (profileData as any).biography || (profileData as any).bio || '',
    bio: {
      original: (profileData as any).bio?.original || (profileData as any).biography || (profileData as any).bio || '',
      ai_polished: (profileData as any).bio?.ai_polished || null
    },
    aiPolishedBio: (profileData as any).bio?.ai_polished,
    tier: profile.tier,

    // Common fields for all tiers
    achievements: (profileData as any).achievements || [],
    gallery: (profileData as any).gallery || [],
    links: (profileData as any).links || [],
    sections: (profileData as any).sections || {},
    quote: (profileData as any).quote || null,

    // Rising-specific fields
    currentRole: (profileData as any).currentRole || '',
    company: (profileData as any).company || '',
    skills: (profileData as any).skills || [],
    aspirations: (profileData as any).aspirations || '',
    projects: (profileData as any).projects || [],

    // Elite-specific fields
    industry: (profileData as any).industry || '',
    yearsOfExperience: (profileData as any).yearsOfExperience || 0,
    expertise: (profileData as any).expertise || [],
    leadership: (profileData as any).leadership || [],
    awards: (profileData as any).awards || [],

    // Legacy-specific fields
    legacy: (profileData as any).legacy || '',
    era: (profileData as any).era || '',
    primaryContributions: (profileData as any).primaryContributions || [],
    historicalImpact: (profileData as any).historicalImpact || '',
    timeline: (profileData as any).timeline || [],
    quotes: (profileData as any).quotes || [],
    recognitions: (profileData as any).recognitions || [],
    influence: (profileData as any).influence || [],
    tributes: (profileData as any).tributes || [],
    enduringContributions: (profileData as any).enduringContributions,

    // Metadata
    publishedAt: profile.published_at || undefined,
    slug: profile.slug,
  }

  // Render the appropriate template based on tier
  const renderTemplate = () => {
    switch (profile.tier) {
      case 'emerging':
        return <EmergingTemplate profile={transformedProfile} />
      case 'accomplished':
        return <AccomplishedTemplate profile={transformedProfile} />
      case 'distinguished':
        return <DistinguishedTemplate profile={transformedProfile} />
      case 'legacy':
        return <LegacyTemplate profile={transformedProfile} />
      // Backward compatibility for old tier names
      case 'rising':
        return <AccomplishedTemplate profile={transformedProfile} />
      case 'elite':
        return <DistinguishedTemplate profile={transformedProfile} />
      default:
        return <EmergingTemplate profile={transformedProfile} />
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
            url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/${(await params).slug}`,
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
      {isPreview && (
        <PreviewWatermark
          profileSlug={profile.slug}
          tier={profile.tier as 'rising' | 'elite' | 'legacy'}
        />
      )}
      {renderTemplate()}
    </>
  )
}

// Enable ISR with revalidation - 24 hours for Elite profiles
export const revalidate = 86400 // Revalidate every 24 hours
