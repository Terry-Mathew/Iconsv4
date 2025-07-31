import { describe, it, expect } from '@jest/globals'
import { nominationSchema } from '@/lib/validations/nomination'

describe('Nomination Validation', () => {
  const validNomination = {
    nominatorEmail: 'nominator@example.com',
    nominatorName: 'John Nominator',
    nomineeName: 'Jane Nominee',
    nomineeEmail: 'nominee@example.com',
    pitch: 'This person is exceptional because they have revolutionized their field through innovative approaches and dedication to excellence.',
    suggestedTier: 'accomplished',
    links: ['https://example.com/profile', 'https://linkedin.com/in/nominee'],
    consent: true,
    website: '', // Honeypot field
  }

  describe('Valid nominations', () => {
    it('should validate a complete nomination', () => {
      const result = nominationSchema.safeParse(validNomination)
      expect(result.success).toBe(true)
    })

    it('should validate nomination without optional fields', () => {
      const minimalNomination = {
        nominatorEmail: 'nominator@example.com',
        nominatorName: 'John Nominator',
        nomineeName: 'Jane Nominee',
        nomineeEmail: 'nominee@example.com',
        pitch: 'This person is exceptional because they have revolutionized their field through innovative approaches and dedication to excellence.',
        consent: true,
        website: '',
      }
      const result = nominationSchema.safeParse(minimalNomination)
      expect(result.success).toBe(true)
    })

    it('should validate nomination with empty links array', () => {
      const nomination = { ...validNomination, links: [] }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(true)
    })
  })

  describe('Invalid nominations', () => {
    it('should reject nomination without nominator email', () => {
      const nomination = { ...validNomination, nominatorEmail: '' }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('nominatorEmail')
    })

    it('should reject nomination with invalid email format', () => {
      const nomination = { ...validNomination, nominatorEmail: 'invalid-email' }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
    })

    it('should reject nomination without consent', () => {
      const nomination = { ...validNomination, consent: false }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('consent')
    })

    it('should reject nomination with short pitch', () => {
      const nomination = { ...validNomination, pitch: 'Too short' }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('pitch')
    })

    it('should reject nomination with invalid tier', () => {
      const nomination = { ...validNomination, suggestedTier: 'invalid-tier' }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
    })

    it('should reject nomination with invalid links', () => {
      const nomination = { ...validNomination, links: ['not-a-url', 'also-invalid'] }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
    })

    it('should detect honeypot spam', () => {
      const nomination = { ...validNomination, website: 'spam-content' }
      const result = nominationSchema.safeParse(nomination)
      // The schema should reject honeypot spam (website field should be empty)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].path).toContain('website')
    })
  })

  describe('Edge cases', () => {
    it('should handle maximum length pitch', () => {
      const longPitch = 'A'.repeat(2000) // Maximum allowed length
      const nomination = { ...validNomination, pitch: longPitch }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(true)
    })

    it('should reject overly long pitch', () => {
      const tooLongPitch = 'A'.repeat(2001) // Over maximum
      const nomination = { ...validNomination, pitch: tooLongPitch }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(false)
    })

    it('should handle multiple valid links', () => {
      const nomination = {
        ...validNomination,
        links: [
          'https://example.com',
          'https://linkedin.com/in/user',
          'https://twitter.com/user',
          'https://github.com/user',
          'https://personal-website.com'
        ]
      }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(true)
    })

    it('should handle special characters in names', () => {
      const nomination = {
        ...validNomination,
        nominatorName: "Jean-Pierre O'Connor",
        nomineeName: "María José García-López"
      }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(true)
    })

    it('should handle international email domains', () => {
      const nomination = {
        ...validNomination,
        nominatorEmail: 'user@example.co.uk',
        nomineeEmail: 'nominee@example.de'
      }
      const result = nominationSchema.safeParse(nomination)
      expect(result.success).toBe(true)
    })
  })
})
