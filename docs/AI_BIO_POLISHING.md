# AI Bio Polishing Documentation

## Overview

ICONS HERALD features AI-powered biography enhancement using Claude 3.5 Sonnet. The system polishes biographical content while maintaining factual accuracy and authenticity, with tier-specific guidelines and tone customization.

## Features

### Core Capabilities

1. **Biography Enhancement**
   - Improves clarity, flow, and professional presentation
   - Maintains all factual information
   - Uses active voice and compelling language
   - Optimizes for tier-specific requirements

2. **Multi-Field Support**
   - Biography polishing
   - Achievement descriptions
   - Professional taglines
   - Summary content
   - General descriptions

3. **Customization Options**
   - **Tones**: Professional, Casual, Formal, Confident, Compelling, Clear
   - **Lengths**: Concise, Balanced, Detailed, Comprehensive
   - **Tiers**: Emerging, Accomplished, Distinguished, Legacy

## Architecture

### API Endpoints

#### POST `/api/ai/polish-bio`

Polishes biographical content using Claude AI.

**Request Body:**
```json
{
  "bio": "Original biography text",
  "fieldType": "bio|achievement|description|tagline|summary",
  "tone": "professional|casual|formal|confident|compelling|clear",
  "tier": "emerging|accomplished|distinguished|legacy",
  "length": "concise|balanced|detailed|comprehensive"
}
```

**Response:**
```json
{
  "success": true,
  "originalText": "Original content",
  "polishedText": "Enhanced content",
  "fieldType": "bio",
  "metadata": {
    "tone": "professional",
    "tier": "accomplished",
    "length": "balanced",
    "originalLength": 150,
    "polishedLength": 200
  }
}
```

#### GET `/api/ai/polish-bio`

Checks AI feature availability and usage limits.

**Response:**
```json
{
  "hasAccess": true,
  "userRole": "member",
  "userTier": "accomplished",
  "usage": {
    "daily": 3,
    "dailyLimit": 10,
    "remaining": 7
  },
  "features": {
    "bioPolish": true,
    "toneOptions": ["professional", "casual", "formal"],
    "supportedTiers": ["emerging", "accomplished", "distinguished", "legacy"]
  }
}
```

### Rate Limiting

- **Members**: 5 requests per hour
- **Admins**: 10 requests per hour
- **IP-based**: 5 requests per hour for anonymous users

### Access Control

- **Required Role**: Member or above
- **Authentication**: JWT token required
- **RLS**: User can only polish their own content

## Tier-Specific Guidelines

### Emerging Tier
- Emphasizes potential and growth trajectory
- Highlights innovative approaches
- Uses dynamic, forward-looking language
- Focuses on recent achievements and future promise

### Accomplished Tier
- Emphasizes established expertise
- Highlights significant accomplishments
- Uses confident, accomplished language
- Focuses on career milestones and recognition

### Distinguished Tier
- Emphasizes industry leadership
- Highlights transformative achievements
- Uses authoritative, prestigious language
- Focuses on thought leadership and contributions

### Legacy Tier
- Emphasizes historical significance
- Highlights lasting impact and influence
- Uses reverent, monumental language
- Focuses on how work shaped fields or society

## Tone Guidelines

### Professional
- Formal, business-appropriate language
- Industry terminology
- Structured presentation

### Casual
- Approachable, conversational language
- Maintains respect and professionalism
- Accessible vocabulary

### Formal
- Elevated, academic language
- Sophisticated vocabulary
- Traditional structure

### Confident
- Strong, assertive language
- Emphasizes achievements and capabilities
- Bold statements

### Compelling
- Engaging, persuasive language
- Captures attention and interest
- Storytelling elements

### Clear
- Simple, direct language
- Easy to understand
- Straightforward presentation

## Error Handling

### Common Error Scenarios

1. **Rate Limit Exceeded (429)**
   ```json
   {
     "error": "AI usage limit exceeded. Please try again later."
   }
   ```

2. **Content Policy Violation (400)**
   ```json
   {
     "error": "Content violates AI usage policies. Please revise your bio."
   }
   ```

3. **Service Unavailable (503)**
   ```json
   {
     "error": "AI service is currently busy. Please try again in a few minutes."
   }
   ```

4. **Authentication Required (401)**
   ```json
   {
     "error": "Authentication required"
   }
   ```

5. **Insufficient Access (403)**
   ```json
   {
     "error": "AI features require membership. Please upgrade your account."
   }
   ```

## Frontend Integration

### React Hook Usage

```typescript
import { useState } from 'react'

function useAIPolish() {
  const [isPolishing, setIsPolishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const polishBio = async (params: PolishParams) => {
    setIsPolishing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/polish-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const result = await response.json()
      return result.polishedText
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsPolishing(false)
    }
  }

  return { polishBio, isPolishing, error }
}
```

### Component Integration

```typescript
function BiographyStep() {
  const { polishBio, isPolishing } = useAIPolish()
  const [bio, setBio] = useState('')
  const [polishedBio, setPolishedBio] = useState('')

  const handlePolish = async () => {
    try {
      const result = await polishBio({
        bio,
        tone: 'professional',
        tier: 'accomplished',
        fieldType: 'bio'
      })
      setPolishedBio(result)
    } catch (error) {
      console.error('Polish failed:', error)
    }
  }

  return (
    <div>
      <textarea 
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Enter your biography..."
      />
      <button 
        onClick={handlePolish}
        disabled={isPolishing || !bio}
      >
        {isPolishing ? 'Polishing...' : 'Polish with AI'}
      </button>
      {polishedBio && (
        <div>
          <h3>Polished Version:</h3>
          <p>{polishedBio}</p>
        </div>
      )}
    </div>
  )
}
```

## Environment Configuration

```env
# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key_here
AI_FEATURES_ENABLED=true

# Rate Limiting
AI_RATE_LIMIT_REQUESTS=5
AI_RATE_LIMIT_WINDOW=1h
```

## Security Considerations

1. **API Key Protection**
   - Server-side only usage
   - Environment variable storage
   - No client-side exposure

2. **Content Filtering**
   - Input validation and sanitization
   - Length limits per field type
   - Content policy enforcement

3. **Rate Limiting**
   - Per-user and per-IP limits
   - Prevents abuse and cost control
   - Graceful degradation

4. **Access Control**
   - Role-based permissions
   - User authentication required
   - Audit logging

## Monitoring and Analytics

### Key Metrics

- AI usage by user and tier
- Success/failure rates
- Average processing time
- Content length statistics
- Popular tone/tier combinations

### Logging

```typescript
// Usage tracking
await supabase
  .from('analytics_events')
  .insert({
    user_id: user.id,
    event_type: 'ai_bio_polish',
    metadata: {
      field_type: 'bio',
      input_length: 150,
      output_length: 200,
      tier: 'accomplished',
      tone: 'professional'
    }
  })
```

## Testing

### Unit Tests
- Claude API integration
- Response processing
- Error handling
- Tier-specific guidelines

### Integration Tests
- End-to-end polishing flow
- Rate limiting enforcement
- Access control validation

### Performance Tests
- Response time benchmarks
- Concurrent request handling
- Rate limit accuracy

## Deployment Checklist

- [ ] Claude API key configured
- [ ] Rate limiting enabled
- [ ] Access control policies applied
- [ ] Error handling tested
- [ ] Monitoring configured
- [ ] Usage analytics enabled
- [ ] Content policy validation
- [ ] Performance benchmarks met

## Future Enhancements

1. **Advanced Features**
   - Multi-language support
   - Industry-specific templates
   - Collaborative editing
   - Version history

2. **Performance Optimizations**
   - Response caching
   - Batch processing
   - Streaming responses

3. **User Experience**
   - Real-time suggestions
   - Progressive enhancement
   - Offline fallbacks
