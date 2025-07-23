import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/nominations/route'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn(() => ({ error: null }))
    }))
  }))
}))

// Mock rate limiting
jest.mock('@/lib/utils/rate-limit', () => ({
  rateLimit: {
    limit: jest.fn(() => Promise.resolve({ success: true, remaining: 9 }))
  }
}))

describe('/api/nominations', () => {
  const validNominationData = {
    nominatorEmail: 'nominator@example.com',
    nominatorName: 'John Nominator',
    nomineeName: 'Jane Nominee',
    nomineeEmail: 'nominee@example.com',
    pitch: 'This person is exceptional because they have revolutionized their field through innovative approaches and dedication to excellence.',
    suggestedTier: 'elite',
    links: ['https://example.com/profile'],
    consent: true,
    website: '', // Honeypot field
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/nominations', () => {
    it('should create a nomination successfully', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: validNominationData,
        headers: {
          'content-type': 'application/json',
        },
      })

      // Mock request.json()
      req.json = jest.fn().mockResolvedValue(validNominationData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.message).toBe('Nomination submitted successfully')
    })

    it('should reject nomination with invalid data', async () => {
      const invalidData = {
        ...validNominationData,
        nominatorEmail: 'invalid-email', // Invalid email format
      }

      const { req } = createMocks({
        method: 'POST',
        body: invalidData,
      })

      req.json = jest.fn().mockResolvedValue(invalidData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Invalid input data')
      expect(responseData.details).toBeDefined()
    })

    it('should reject nomination without required fields', async () => {
      const incompleteData = {
        nominatorEmail: 'nominator@example.com',
        // Missing required fields
      }

      const { req } = createMocks({
        method: 'POST',
        body: incompleteData,
      })

      req.json = jest.fn().mockResolvedValue(incompleteData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Invalid input data')
    })

    it('should detect honeypot spam', async () => {
      const spamData = {
        ...validNominationData,
        website: 'spam-content', // Honeypot field filled
      }

      const { req } = createMocks({
        method: 'POST',
        body: spamData,
      })

      req.json = jest.fn().mockResolvedValue(spamData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Spam detected')
    })

    it('should handle rate limiting', async () => {
      // Mock rate limit exceeded
      const { rateLimit } = require('@/lib/utils/rate-limit')
      rateLimit.limit.mockResolvedValueOnce({ success: false, remaining: 0 })

      const { req } = createMocks({
        method: 'POST',
        body: validNominationData,
      })

      req.json = jest.fn().mockResolvedValue(validNominationData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(429)
      expect(responseData.error).toBe('Too many requests. Please try again later.')
    })

    it('should handle database errors', async () => {
      // Mock database error
      const { createServerClient } = require('@/lib/supabase/server')
      createServerClient.mockReturnValueOnce({
        from: jest.fn(() => ({
          insert: jest.fn(() => ({ error: { message: 'Database error' } }))
        }))
      })

      const { req } = createMocks({
        method: 'POST',
        body: validNominationData,
      })

      req.json = jest.fn().mockResolvedValue(validNominationData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Failed to submit nomination')
    })

    it('should handle malformed JSON', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: 'invalid-json',
      })

      req.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Internal server error')
    })

    it('should validate links format', async () => {
      const invalidLinksData = {
        ...validNominationData,
        links: ['not-a-url', 'also-invalid'],
      }

      const { req } = createMocks({
        method: 'POST',
        body: invalidLinksData,
      })

      req.json = jest.fn().mockResolvedValue(invalidLinksData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.error).toBe('Invalid input data')
    })

    it('should handle empty links array', async () => {
      const noLinksData = {
        ...validNominationData,
        links: [],
      }

      const { req } = createMocks({
        method: 'POST',
        body: noLinksData,
      })

      req.json = jest.fn().mockResolvedValue(noLinksData)
      req.ip = '127.0.0.1'

      const response = await POST(req as any)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
    })
  })
})
