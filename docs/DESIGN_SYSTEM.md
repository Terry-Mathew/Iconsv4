# ICONS HERALD Design System Documentation

## Overview
ICONS HERALD employs a sophisticated, museum-quality design system that emphasizes luxury, exclusivity, and premium positioning. The system is built on dark gradients with floating white cards, champagne gold accents, and glassmorphism effects.

## Identified Active Pages

### Core Pages (Implemented)
1. **Homepage** (`/`) - Landing page with hero, pricing, about sections
2. **Profiles Listing** (`/profiles`) - Browse all published profiles
3. **Individual Profile** (`/profile/[slug]`) - Dynamic profile pages
4. **Profile Builder** (`/builder`) - Multi-step profile creation wizard
5. **Dashboard** (`/dashboard`) - User dashboard and management
6. **Admin Panel** (`/admin`) - Administrative interface

### Demo Pages (Template Previews)
7. **Rising Demo** (`/demo/rising`) - Rising tier template showcase
8. **Elite Demo** (`/demo/elite`) - Elite tier template showcase
9. **Legacy Demo** (`/demo/legacy`) - Legacy tier template showcase

### Authentication Pages
10. **Sign In** (`/auth/signin`) - Authentication page
11. **Auth Callback** (`/auth/callback`) - OAuth callback handler (route only)

## Color Palette

### Primary Colors
- **Champagne Gold**: `#D4AF37` (gold.500) - Primary accent, buttons, highlights
- **Gold Variants**:
  - Light: `#E5C547` (gold.400) - Hover states
  - Dark: `#B8941F` (gold.600) - Borders, emphasis

### Dark Foundation
- **Primary Dark**: `#1A1A1A` (dark.900) - Main background gradient start
- **Secondary Dark**: `#2A2A2A` (dark.800) - Background gradient end
- **Ultra Black**: `#000000` (ultraBlack.950) - Maximum sophistication

### White System
- **Museum White**: `#FFFFFF` (museumWhite.50) - Pure white for cards
- **Warm White**: `#FEFEFE` (museumWhite.100) - Text on dark backgrounds
- **Card White**: `#FDFDFD` (museumWhite.200) - Card backgrounds

### Supporting Colors
- **Premium Blue**: `#3B82F6` (brand.500) - Strategic accent only
- **Warm Grays**: `#F4F6F8` to `#0F172A` - Neutral foundation
- **Semantic Colors**: Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`

## Typography

### Font Families
- **Headings**: `'Playfair Display', serif` - Elegant, editorial quality
- **Body Text**: `'Lato', sans-serif` - Clean, readable

### Font Sizes (8pt Grid System)
- **Display**: `100px` (6.25rem) - Massive hero headlines
- **Hero**: `80px` (5rem) - Hero headlines
- **Section**: `48px` (3rem) - Section headlines
- **Large**: `24px` (1.5rem) - Subsection headers
- **Body**: `18px` (1.125rem) - Premium body text
- **Small**: `14px` (0.875rem) - Supporting text

### Font Weights
- **Light**: 300 - Elegant headlines
- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasis
- **Semibold**: 600 - Strong emphasis
- **Bold**: 700 - Heavy emphasis

### Line Heights
- **Display**: 0.9 - Ultra-tight for massive headlines
- **Hero**: 1.0 - Tight for hero headlines
- **Heading**: 1.1 - Section headlines
- **Body**: 1.7 - Premium body text
- **Relaxed**: 1.8 - Comfortable reading

### Dark Background Typography (WCAG AA Compliant)
- **Headlines**: `white.50` (#F8F8F8) - 15.3:1 contrast ratio
- **Body Text**: `white.700` (#F8F8F8) - High contrast
- **Captions**: `white.200` (#E8E8E8) - 9.7:1 contrast ratio
- **Muted Text**: `white.300` (#D0D0D0) - 7.4:1 contrast ratio

## Spacing System (8pt Grid)

### Base Units
- **Base Unit**: 4px
- **Grid System**: All spacing in multiples of 4px (8pt grid)

### Named Spacing
- **Section**: `160px` (40 units) - Between major sections
- **Card**: `48px` (12 units) - Card internal padding
- **Element**: `32px` (8 units) - Element spacing
- **Tight**: `24px` (6 units) - Tight spacing
- **Base**: `32px` (8 units) - Base spacing
- **Generous**: `64px` (16 units) - Generous spacing

### Container System
- **Max Width**: `1600px` (2xl) - Premium breathing room
- **Breakpoints**:
  - Base: 0em
  - SM: 30em (480px)
  - MD: 48em (768px)
  - LG: 62em (992px)
  - XL: 80em (1280px)
  - 2XL: 100em (1600px)