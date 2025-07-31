import Anthropic from '@anthropic-ai/sdk'

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
})

interface PolishBioParams {
  originalBio: string
  fieldType?: 'bio' | 'achievement' | 'description' | 'tagline' | 'summary'
  tone: 'professional' | 'casual' | 'formal' | 'confident' | 'compelling' | 'clear'
  tier: 'emerging' | 'accomplished' | 'distinguished' | 'legacy'
  length?: 'concise' | 'balanced' | 'detailed' | 'comprehensive'
  userTier?: string
}

interface PolishBioResponse {
  polishedBio: string
  suggestions?: string[]
  improvements?: string[]
}

export async function polishBioWithClaude({
  originalBio,
  fieldType = 'bio',
  tone,
  tier,
  length = 'balanced',
  userTier
}: PolishBioParams): Promise<string> {
  try {
    const systemPrompt = createSystemPrompt(tier, tone, fieldType, length)
    const userPrompt = createUserPrompt(originalBio, tier, tone, fieldType, length)

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const polishedBio = extractBioFromResponse(response.content)
    
    if (!polishedBio) {
      throw new Error('Failed to extract polished bio from AI response')
    }

    return polishedBio

  } catch (error: any) {
    console.error('Claude API error:', error)
    
    // Handle specific Anthropic errors
    if (error.status === 429) {
      throw new Error('rate_limit: AI service rate limit exceeded')
    }
    
    if (error.status === 400 && error.message?.includes('content')) {
      throw new Error('content_policy: Content violates AI usage policies')
    }
    
    throw new Error(`AI processing failed: ${error.message}`)
  }
}

function createSystemPrompt(
  tier: string,
  tone: string,
  fieldType: string = 'bio',
  length: string = 'balanced'
): string {
  const basePrompt = `You are an expert biography writer for Icons Herald, a premium digital archive platform. Your task is to polish and enhance biographical content while maintaining authenticity and factual accuracy.

Guidelines:
- Maintain all factual information from the original bio
- Enhance clarity, flow, and professional presentation
- Use active voice and compelling language
- Ensure the bio reflects the person's achievements appropriately
- Keep the enhanced bio between 150-500 words
- Do not add fictional achievements or exaggerate claims
- Focus on impact and significance of accomplishments`

  const tierSpecificGuidelines = {
    emerging: `
For Emerging tier profiles:
- Emphasize potential, growth trajectory, and emerging impact
- Highlight innovative approaches and fresh perspectives
- Focus on recent achievements and future promise
- Use dynamic, forward-looking language`,

    accomplished: `
For Accomplished tier profiles:
- Emphasize established expertise and professional achievements
- Highlight significant accomplishments and measurable impact
- Focus on career milestones and industry recognition
- Use confident, accomplished language`,

    distinguished: `
For Distinguished tier profiles:
- Emphasize industry leadership and exceptional expertise
- Highlight transformative achievements and thought leadership
- Focus on significant contributions and widespread recognition
- Use authoritative, prestigious language`,

    legacy: `
For Legacy tier profiles:
- Emphasize historical significance and lasting impact
- Highlight transformative contributions and enduring influence
- Focus on how their work shaped their field or society
- Use reverent, monumental language that honors their legacy`
  }

  const toneGuidelines = {
    professional: 'Use formal, business-appropriate language with industry terminology',
    casual: 'Use approachable, conversational language while maintaining respect',
    formal: 'Use elevated, academic language with sophisticated vocabulary',
    confident: 'Use strong, assertive language that emphasizes achievements and capabilities',
    compelling: 'Use engaging, persuasive language that captures attention and interest',
    clear: 'Use simple, direct language that is easy to understand and follow'
  }

  return `${basePrompt}

${tierSpecificGuidelines[tier as keyof typeof tierSpecificGuidelines]}

Tone: ${toneGuidelines[tone as keyof typeof toneGuidelines]}

Return only the polished biography text, without any additional commentary or formatting.`
}

function createUserPrompt(
  originalBio: string,
  tier: string,
  tone: string,
  fieldType: string = 'bio',
  length: string = 'balanced'
): string {
  const fieldLabels = {
    bio: 'biography',
    achievement: 'achievement description',
    description: 'description',
    tagline: 'tagline',
    summary: 'summary'
  }

  const fieldLabel = fieldLabels[fieldType as keyof typeof fieldLabels] || 'content'

  return `Please polish and enhance the following ${fieldLabel} for a ${tier} tier profile with a ${tone} tone and ${length} length:

Original ${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)}:
${originalBio}

Enhanced ${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)}:`
}

function extractBioFromResponse(content: any[]): string | null {
  try {
    // Extract text from Claude's response format
    const textContent = content.find(item => item.type === 'text')
    if (!textContent) return null
    
    let bio = textContent.text.trim()
    
    // Remove any markdown formatting or extra text
    bio = bio.replace(/^Enhanced Biography:\s*/i, '')
    bio = bio.replace(/^Biography:\s*/i, '')
    bio = bio.replace(/^\*\*.*?\*\*\s*/g, '') // Remove bold headers
    bio = bio.replace(/^#+\s*/gm, '') // Remove markdown headers
    
    return bio.trim()
    
  } catch (error) {
    console.error('Error extracting bio from response:', error)
    return null
  }
}

// Additional AI utilities for future features
export async function generateBioSuggestions(
  achievements: string[],
  industry: string,
  tier: string
): Promise<string[]> {
  try {
    const prompt = `Based on these achievements in ${industry}, suggest 3-5 compelling ways to present them in a ${tier} tier biography:

Achievements:
${achievements.map(a => `- ${a}`).join('\n')}

Provide suggestions as a numbered list.`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.5,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const suggestions = extractSuggestionsFromResponse(response.content)
    return suggestions

  } catch (error) {
    console.error('Error generating bio suggestions:', error)
    return []
  }
}

function extractSuggestionsFromResponse(content: any[]): string[] {
  try {
    const textContent = content.find(item => item.type === 'text')
    if (!textContent) return []
    
    const text = textContent.text
    const lines = text.split('\n').filter((line: string) => line.trim())
    
    // Extract numbered list items
    const suggestions = lines
      .filter((line: string) => /^\d+\./.test(line.trim()))
      .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
      .filter((suggestion: string) => suggestion.length > 0)
    
    return suggestions.slice(0, 5) // Limit to 5 suggestions
    
  } catch (error) {
    console.error('Error extracting suggestions:', error)
    return []
  }
}

// Validate environment setup
export function validateClaudeSetup(): boolean {
  return !!process.env.CLAUDE_API_KEY
}

// Get AI feature status
export function getAIFeatureStatus() {
  return {
    claudeAvailable: validateClaudeSetup(),
    features: {
      bioPolishing: validateClaudeSetup(),
      bioSuggestions: validateClaudeSetup(),
    }
  }
}
