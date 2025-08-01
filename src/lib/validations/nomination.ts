import { z } from 'zod'

// Updated schema to match the actual database schema
export const nominationSchema = z.object({
  nominatorEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  nominatorName: z
    .string()
    .min(2, 'Your name must be at least 2 characters')
    .max(100, 'Your name must be less than 100 characters'),

  nomineeName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  nomineeEmail: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Nominee email is required'),

  pitch: z
    .string()
    .min(100, 'Pitch must be at least 100 characters')
    .max(2000, 'Pitch must be less than 2000 characters'),

  links: z
    .array(z.string().url('Please enter a valid URL'))
    .optional()
    .default([]),

  suggestedTier: z
    .enum(['emerging', 'accomplished', 'distinguished', 'legacy'])
    .optional(),

  // Honeypot field - should remain empty
  website: z
    .string()
    .max(0, 'This field should be empty')
    .optional()
    .default(''),

  consent: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
})

export type NominationFormData = z.infer<typeof nominationSchema>

export const categories = [
  'Technology & Innovation',
  'Business & Entrepreneurship',
  'Arts & Culture',
  'Science & Research',
  'Social Impact & Activism',
  'Sports & Athletics',
  'Education & Academia',
  'Healthcare & Medicine',
  'Politics & Public Service',
  'Media & Journalism',
  'Entertainment',
  'Other',
] as const

export const tierDescriptions = {
  emerging: 'For emerging talents making their mark in their field',
  accomplished: 'For accomplished professionals with proven track records',
  distinguished: 'For distinguished leaders at the peak of their career',
  legacy: 'For legendary figures who have shaped history',
} as const
