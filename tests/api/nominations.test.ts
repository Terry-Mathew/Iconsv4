import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { nominationSchema } from '@/lib/validations/nomination'

// Mock the entire Supabase module to avoid ES module issues
const mockSupabaseClient = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({ error: null }))
  }))
}

const mockRateLimit = {
  limit: jest.fn(() => Promise.resolve({ success: true, remaining: 9 }))
}

// Mock POST function directly
const mockPOST = jest.fn()

describe('/api/nominations', () => {
  const validNominationData = {
    nominatorEmail: 'nominator@example.com',
    nominatorName: 'John Nominator',
    nomineeName: 'Jane Nominee',
    nomineeEmail: 'nominee@example.com',
    pitch: 'This person is exceptional because they have revolutionized their field through innovative approaches and dedication to excellence.',
    suggestedTier: 'accomplished',
    links: ['https://example.com/profile'],
    consent: true,
    website: '', // Honeypot field
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Nomination validation', () => {
    it('should validate correct nomination data', () => {
      const result = nominationSchema.safeParse(validNominationData)
      expect(result.success).toBe(true)
    })

    it('should reject nomination with invalid email', () => {
      const invalidData = {
        ...validNominationData,
        nominatorEmail: 'invalid-email'
      }
      const result = nominationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject nomination without consent', () => {
      const invalidData = {
        ...validNominationData,
        consent: false
      }
      const result = nominationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject nomination with short pitch', () => {
      const invalidData = {
        ...validNominationData,
        pitch: 'Too short'
      }
      const result = nominationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should detect honeypot spam', () => {
      const spamData = {
        ...validNominationData,
        website: 'spam-content'
      }
      const result = nominationSchema.safeParse(spamData)
      expect(result.success).toBe(false)
    })

    it('should validate links format', () => {
      const invalidLinksData = {
        ...validNominationData,
        links: ['not-a-url', 'also-invalid']
      }
      const result = nominationSchema.safeParse(invalidLinksData)
      expect(result.success).toBe(false)
    })

    it('should handle empty links array', () => {
      const noLinksData = {
        ...validNominationData,
        links: []
      }
      const result = nominationSchema.safeParse(noLinksData)
      expect(result.success).toBe(true)
    })
  })
})
