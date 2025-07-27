'use client'

import { useState } from 'react'
import {
  Button,
  IconButton,
  Tooltip,
  useToast,
  Spinner,
  HStack,
  Text,
  Badge,
} from '@chakra-ui/react'
import { Sparkles, Wand2, RefreshCw } from 'lucide-react'

interface AIPolishButtonProps {
  originalText: string
  onPolished: (polishedText: string) => void
  fieldType?: 'bio' | 'achievement' | 'description' | 'tagline' | 'summary'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'button' | 'icon'
  disabled?: boolean
  className?: string
}

export function AIPolishButton({
  originalText,
  onPolished,
  fieldType = 'bio',
  size = 'sm',
  variant = 'button',
  disabled = false,
  className = ''
}: AIPolishButtonProps) {
  const [isPolishing, setIsPolishing] = useState(false)
  const [hasPolished, setHasPolished] = useState(false)
  const toast = useToast()

  const handlePolish = async () => {
    if (!originalText.trim()) {
      toast({
        title: 'No content to polish',
        description: 'Please enter some text before using AI polishing.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    if (originalText.length < 10) {
      toast({
        title: 'Text too short',
        description: 'Please enter at least 10 characters for AI polishing.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsPolishing(true)

    try {
      const response = await fetch('/api/ai/polish-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: originalText,
          fieldType,
          tone: getFieldTone(fieldType),
          length: getFieldLength(fieldType)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to polish text')
      }

      const data = await response.json()
      
      if (data.polishedText) {
        onPolished(data.polishedText)
        setHasPolished(true)
        
        toast({
          title: 'Text polished successfully!',
          description: 'AI has enhanced your content for better impact.',
          status: 'success',
          duration: 3000,
        })
      } else {
        throw new Error('No polished text received')
      }
    } catch (error) {
      console.error('AI polishing error:', error)
      
      // Fallback to mock polishing for development
      const mockPolished = generateMockPolishedText(originalText, fieldType)
      onPolished(mockPolished)
      setHasPolished(true)
      
      toast({
        title: 'Text enhanced (Demo)',
        description: 'Using demo AI polishing. Connect to real AI service for production.',
        status: 'info',
        duration: 4000,
      })
    } finally {
      setIsPolishing(false)
    }
  }

  const getFieldTone = (type: string) => {
    switch (type) {
      case 'bio':
        return 'professional'
      case 'achievement':
        return 'confident'
      case 'tagline':
        return 'compelling'
      case 'description':
        return 'clear'
      default:
        return 'professional'
    }
  }

  const getFieldLength = (type: string) => {
    switch (type) {
      case 'tagline':
        return 'concise'
      case 'bio':
        return 'detailed'
      case 'achievement':
        return 'comprehensive'
      default:
        return 'balanced'
    }
  }

  const generateMockPolishedText = (text: string, type: string): string => {
    // Mock AI polishing for development/demo
    const enhancements = {
      bio: (text: string) => {
        if (text.length < 100) {
          return `${text} With a proven track record of excellence and innovation, this professional brings unique value and expertise to every endeavor, consistently delivering results that exceed expectations.`
        }
        return text.replace(/\b(I am|I have|I work)\b/g, (match) => {
          switch (match) {
            case 'I am': return 'As a'
            case 'I have': return 'With'
            case 'I work': return 'Working'
            default: return match
          }
        })
      },
      achievement: (text: string) => {
        return text.replace(/\b(did|made|created|built)\b/g, (match) => {
          switch (match) {
            case 'did': return 'successfully executed'
            case 'made': return 'developed'
            case 'created': return 'architected'
            case 'built': return 'engineered'
            default: return match
          }
        })
      },
      tagline: (text: string) => {
        if (!text.includes('&') && !text.includes('|')) {
          const words = text.split(' ')
          if (words.length > 3) {
            const mid = Math.floor(words.length / 2)
            return `${words.slice(0, mid).join(' ')} & ${words.slice(mid).join(' ')}`
          }
        }
        return text
      },
      description: (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1).replace(/\.$/, '') + ', demonstrating exceptional skill and dedication.'
      }
    }

    const enhancer = enhancements[type as keyof typeof enhancements] || enhancements.description
    return enhancer(text)
  }

  if (variant === 'icon') {
    return (
      <Tooltip 
        label={hasPolished ? 'Polish again with AI' : 'Enhance with AI'} 
        placement="top"
      >
        <IconButton
          aria-label="Polish with AI"
          icon={isPolishing ? <Spinner size="sm" /> : hasPolished ? <RefreshCw size={16} /> : <Wand2 size={16} />}
          size={size}
          variant="ghost"
          colorScheme={hasPolished ? 'green' : 'purple'}
          onClick={handlePolish}
          disabled={disabled || isPolishing}
          className={className}
          _hover={{
            bg: hasPolished ? 'green.50' : 'purple.50',
            transform: 'scale(1.05)'
          }}
          transition="all 0.2s"
        />
      </Tooltip>
    )
  }

  return (
    <Button
      leftIcon={isPolishing ? <Spinner size="sm" /> : <Sparkles size={16} />}
      size={size}
      variant="outline"
      colorScheme={hasPolished ? 'green' : 'purple'}
      onClick={handlePolish}
      disabled={disabled || isPolishing}
      className={className}
      _hover={{
        bg: hasPolished ? 'green.50' : 'purple.50',
        borderColor: hasPolished ? 'green.300' : 'purple.300'
      }}
      transition="all 0.2s"
    >
      <HStack spacing={2}>
        <Text>{isPolishing ? 'Polishing...' : hasPolished ? 'Polish Again' : 'Polish with AI'}</Text>
        {hasPolished && (
          <Badge colorScheme="green" size="sm">
            Enhanced
          </Badge>
        )}
      </HStack>
    </Button>
  )
}
