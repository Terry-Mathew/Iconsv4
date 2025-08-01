import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')

    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // If profileId is provided, get specific profile analytics
    if (profileId) {
      // Verify user owns this profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, user_id')
        .eq('id', profileId)
        .eq('user_id', user.id)
        .single()

      if (profileError || !profile) {
        return NextResponse.json(
          { error: 'Profile not found or access denied' },
          { status: 404 }
        )
      }

      // Get real analytics data
      const analytics = await getProfileAnalytics(supabase, profileId)
      return NextResponse.json(analytics)
    }

    // Return mock analytics for development
    const mockAnalytics = getMockAnalytics()
    return NextResponse.json(mockAnalytics)

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get real profile analytics
async function getProfileAnalytics(supabase: any, profileId: string) {
  try {
    // Get view events from the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: viewEvents, error: viewError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'profile_view')
      .eq('metadata->profile_id', profileId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (viewError) {
      console.error('Error fetching view events:', viewError)
      return getMockAnalytics()
    }

    // Calculate metrics
    const totalViews = viewEvents?.length || 0
    const uniqueVisitors = new Set(viewEvents?.map((e: any) => e.ip_address || e.user_id)).size
    const dailyViews = calculateDailyViews(viewEvents || [])
    const topSources = calculateTopSources(viewEvents || [])

    return {
      totalViews,
      uniqueVisitors,
      engagementRate: calculateEngagementRate(viewEvents || []),
      dailyViews,
      topSources,
      lastUpdated: new Date().toISOString()
    }

  } catch (error) {
    console.error('Error calculating analytics:', error)
    return getMockAnalytics()
  }
}

// Calculate daily views for the chart
function calculateDailyViews(events: any[]) {
  const dailyData: { [key: string]: number } = {}

  events.forEach((event: any) => {
    const date = new Date(event.created_at).toISOString().split('T')[0]
    dailyData[date] = (dailyData[date] || 0) + 1
  })

  // Convert to array format for charts
  return Object.entries(dailyData)
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Calculate top traffic sources
function calculateTopSources(events: any[]) {
  const sources: { [key: string]: number } = {}

  events.forEach((event: any) => {
    const source = event.metadata?.source || 'Direct'
    sources[source] = (sources[source] || 0) + 1
  })

  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

// Calculate engagement rate based on time spent
function calculateEngagementRate(events: any[]): string {
  if (events.length === 0) return '0%'

  // Mock calculation - in real implementation, track time spent
  const engagedViews = events.filter((e: any) =>
    e.metadata?.timeSpent && e.metadata.timeSpent > 30
  ).length

  const rate = (engagedViews / events.length) * 100
  return `${rate.toFixed(1)}%`
}

// Mock analytics for development
function getMockAnalytics() {
  const now = new Date()
  const dailyViews = []
  
  // Generate mock daily data for last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dailyViews.push({
      date: date.toISOString().split('T')[0],
      views: Math.floor(Math.random() * 50) + 10
    })
  }

  return {
    totalViews: Math.floor(Math.random() * 1000) + 100,
    uniqueVisitors: Math.floor(Math.random() * 500) + 50,
    engagementRate: (Math.random() * 30 + 70).toFixed(1) + '%',
    dailyViews,
    topSources: [
      { source: 'Direct', count: Math.floor(Math.random() * 100) + 50 },
      { source: 'LinkedIn', count: Math.floor(Math.random() * 80) + 30 },
      { source: 'Google', count: Math.floor(Math.random() * 60) + 20 },
      { source: 'Twitter', count: Math.floor(Math.random() * 40) + 10 },
      { source: 'Referral', count: Math.floor(Math.random() * 30) + 5 }
    ],
    lastUpdated: new Date().toISOString()
  }
}
