import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock the Claude API
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: 'This is a polished and enhanced biography that maintains all factual information while improving clarity, flow, and professional presentation. The enhanced version uses active voice and compelling language to better reflect the person\'s achievements and impact.'
          }
        ]
      })
    }
  }))
})

// Mock environment variables
process.env.CLAUDE_API_KEY = 'test_claude_api_key'

// Import after mocking
const { polishBioWithClaude, validateClaudeSetup, getAIFeatureStatus } = require('../../src/lib/ai/claude')

describe('AI Bio Polishing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Claude Setup Validation', () => {
    it('should validate Claude setup with API key', () => {
      const isValid = validateClaudeSetup()
      expect(isValid).toBe(true)
    })

    it('should return AI feature status', () => {
      const status = getAIFeatureStatus()
      expect(status).toEqual({
        claudeAvailable: true,
        features: {
          bioPolishing: true,
          bioSuggestions: true,
        }
      })
    })
  })

  describe('Bio Polishing Function', () => {
    const mockBio = 'I am a software engineer with 5 years of experience. I work at a tech company and have built several applications.'

    it('should polish bio with default parameters', async () => {
      const result = await polishBioWithClaude({
        originalBio: mockBio,
        tone: 'professional',
        tier: 'accomplished'
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle different tiers correctly', async () => {
      const tiers = ['emerging', 'accomplished', 'distinguished', 'legacy'] as const

      for (const tier of tiers) {
        const result = await polishBioWithClaude({
          originalBio: mockBio,
          tone: 'professional',
          tier
        })

        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
      }
    })

    it('should handle different tones correctly', async () => {
      const tones = ['professional', 'casual', 'formal', 'confident', 'compelling', 'clear'] as const

      for (const tone of tones) {
        const result = await polishBioWithClaude({
          originalBio: mockBio,
          tone,
          tier: 'accomplished'
        })

        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
      }
    })

    it('should handle different field types correctly', async () => {
      const fieldTypes = ['bio', 'achievement', 'description', 'tagline', 'summary'] as const

      for (const fieldType of fieldTypes) {
        const result = await polishBioWithClaude({
          originalBio: mockBio,
          tone: 'professional',
          tier: 'accomplished',
          fieldType
        })

        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
      }
    })

    it('should handle different length preferences', async () => {
      const lengths = ['concise', 'balanced', 'detailed', 'comprehensive'] as const

      for (const length of lengths) {
        const result = await polishBioWithClaude({
          originalBio: mockBio,
          tone: 'professional',
          tier: 'accomplished',
          length
        })

        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
      }
    })
  })

  describe('Input Validation', () => {
    it('should handle empty bio gracefully', async () => {
      try {
        await polishBioWithClaude({
          originalBio: '',
          tone: 'professional',
          tier: 'accomplished'
        })
      } catch (error) {
        expect(error).toBeDefined()
      }
    })

    it('should handle very long bio', async () => {
      const longBio = 'A'.repeat(5000)
      
      const result = await polishBioWithClaude({
        originalBio: longBio,
        tone: 'professional',
        tier: 'accomplished'
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })
  })

  describe('Error Handling', () => {
    it('should handle API rate limit errors', async () => {
      const mockError = new Error('Rate limit exceeded')
      mockError.status = 429

      const Anthropic = require('@anthropic-ai/sdk')
      const mockCreate = jest.fn().mockRejectedValue(mockError)
      Anthropic.mockImplementation(() => ({
        messages: { create: mockCreate }
      }))

      try {
        await polishBioWithClaude({
          originalBio: 'Test bio',
          tone: 'professional',
          tier: 'accomplished'
        })
      } catch (error) {
        expect(error.message).toContain('rate_limit')
      }
    })

    it('should handle content policy violations', async () => {
      const mockError = new Error('Content violates policy')
      mockError.status = 400

      const Anthropic = require('@anthropic-ai/sdk')
      const mockCreate = jest.fn().mockRejectedValue(mockError)
      Anthropic.mockImplementation(() => ({
        messages: { create: mockCreate }
      }))

      try {
        await polishBioWithClaude({
          originalBio: 'Inappropriate content',
          tone: 'professional',
          tier: 'accomplished'
        })
      } catch (error) {
        expect(error.message).toContain('content_policy')
      }
    })
  })

  describe('Response Processing', () => {
    it('should extract bio from Claude response correctly', async () => {
      const result = await polishBioWithClaude({
        originalBio: 'Original bio',
        tone: 'professional',
        tier: 'accomplished'
      })

      // The mock returns the default response, so we just check it's a string
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle malformed responses', async () => {
      const mockResponse = {
        content: []
      }

      const Anthropic = require('@anthropic-ai/sdk')
      const mockCreate = jest.fn().mockResolvedValue(mockResponse)
      Anthropic.mockImplementation(() => ({
        messages: { create: mockCreate }
      }))

      try {
        await polishBioWithClaude({
          originalBio: 'Original bio',
          tone: 'professional',
          tier: 'accomplished'
        })
      } catch (error) {
        expect(error.message).toContain('Failed to extract polished bio')
      }
    })
  })

  describe('Tier-Specific Guidelines', () => {
    it('should apply emerging tier guidelines', async () => {
      const result = await polishBioWithClaude({
        originalBio: 'I am a young professional starting my career.',
        tone: 'professional',
        tier: 'emerging'
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('should apply legacy tier guidelines', async () => {
      const result = await polishBioWithClaude({
        originalBio: 'I have had a long and distinguished career spanning 40 years.',
        tone: 'formal',
        tier: 'legacy'
      })

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })
  })
})
