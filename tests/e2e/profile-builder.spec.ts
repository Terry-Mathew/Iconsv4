import { test, expect } from '@playwright/test'

// Test data for profile creation
const testProfileData = {
  rising: {
    name: 'Alex Johnson',
    tagline: 'Innovative Software Engineer & Tech Entrepreneur',
    bio: 'Passionate software engineer with 5 years of experience building scalable web applications. Currently leading a team of developers at TechCorp, focusing on AI-driven solutions for e-commerce platforms. Strong advocate for clean code, agile methodologies, and continuous learning.',
    currentRole: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
    aspirations: 'To become a CTO of a tech startup and mentor the next generation of developers',
    achievements: [
      {
        title: 'Led Migration to Microservices',
        description: 'Successfully led the migration of a monolithic application to microservices architecture, reducing deployment time by 70%',
        year: '2023',
        category: 'technical'
      },
      {
        title: 'Open Source Contributor',
        description: 'Active contributor to React ecosystem with 500+ GitHub stars across projects',
        year: '2022',
        category: 'community'
      }
    ],
    links: [
      {
        title: 'LinkedIn Profile',
        url: 'https://linkedin.com/in/alexjohnson',
        type: 'linkedin'
      },
      {
        title: 'GitHub',
        url: 'https://github.com/alexjohnson',
        type: 'github'
      }
    ]
  },
  elite: {
    name: 'Dr. Sarah Chen',
    tagline: 'Healthcare Innovation Leader & Digital Transformation Expert',
    bio: 'Visionary healthcare executive with 15+ years of experience transforming healthcare delivery through technology. Currently serving as Chief Digital Officer at MedTech Innovations, where I lead digital transformation initiatives across 50+ hospitals. Recognized thought leader in healthcare AI and telemedicine.',
    currentRole: 'Chief Digital Officer',
    company: 'MedTech Innovations',
    industry: 'Healthcare Technology',
    yearsOfExperience: 15,
    expertise: ['Digital Health', 'AI in Healthcare', 'Telemedicine', 'Healthcare Operations'],
    achievements: [
      {
        title: 'Implemented AI Diagnostic System',
        description: 'Led implementation of AI-powered diagnostic system that improved accuracy by 25% and reduced diagnosis time by 40%',
        year: '2023',
        category: 'innovation'
      },
      {
        title: 'Healthcare Innovation Award',
        description: 'Received the National Healthcare Innovation Award for pioneering telemedicine solutions during COVID-19',
        year: '2021',
        category: 'recognition'
      }
    ],
    links: [
      {
        title: 'Professional Website',
        url: 'https://drsarahchen.com',
        type: 'website'
      },
      {
        title: 'LinkedIn',
        url: 'https://linkedin.com/in/drsarahchen',
        type: 'linkedin'
      }
    ]
  }
}

test.describe('Profile Builder E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle')
  })

  test('Complete Rising Profile Creation Workflow', async ({ page }) => {
    // Step 1: Navigate to profile builder
    await page.click('text=Request Invitation')
    await page.waitForURL('**/builder')
    
    // Step 2: Select Rising tier
    await page.click('[data-testid="tier-rising"]')
    await page.click('text=Continue')
    
    // Step 3: Fill basic information
    await page.fill('[data-testid="name-input"]', testProfileData.rising.name)
    await page.fill('[data-testid="tagline-input"]', testProfileData.rising.tagline)
    
    // Step 4: Fill biography
    await page.fill('[data-testid="bio-textarea"]', testProfileData.rising.bio)
    
    // Test AI polishing (mock)
    await page.click('[data-testid="ai-polish-button"]')
    await page.waitForSelector('[data-testid="ai-polished-bio"]', { timeout: 5000 })
    
    // Step 5: Add achievements
    for (const achievement of testProfileData.rising.achievements) {
      await page.click('[data-testid="add-achievement"]')
      await page.fill('[data-testid="achievement-title"]', achievement.title)
      await page.fill('[data-testid="achievement-description"]', achievement.description)
      await page.fill('[data-testid="achievement-year"]', achievement.year)
      await page.selectOption('[data-testid="achievement-category"]', achievement.category)
      await page.click('[data-testid="save-achievement"]')
    }
    
    // Step 6: Add social links
    for (const link of testProfileData.rising.links) {
      await page.click('[data-testid="add-social-link"]')
      await page.fill('[data-testid="link-title"]', link.title)
      await page.fill('[data-testid="link-url"]', link.url)
      await page.selectOption('[data-testid="link-type"]', link.type)
      await page.click('[data-testid="save-link"]')
    }
    
    // Step 7: Test preview functionality
    await page.click('[data-testid="preview-toggle"]')
    
    // Verify preview content
    await expect(page.locator('[data-testid="preview-name"]')).toHaveText(testProfileData.rising.name)
    await expect(page.locator('[data-testid="preview-tagline"]')).toHaveText(testProfileData.rising.tagline)
    
    // Test device mode switching
    await page.click('[data-testid="mobile-preview"]')
    await page.click('[data-testid="tablet-preview"]')
    await page.click('[data-testid="desktop-preview"]')
    
    // Step 8: Save as draft
    await page.click('[data-testid="save-draft"]')
    await expect(page.locator('text=Profile saved as draft')).toBeVisible()
    
    // Step 9: Publish profile (mock payment)
    await page.click('[data-testid="publish-profile"]')
    await expect(page.locator('text=Profile published successfully')).toBeVisible()
    
    // Step 10: Verify published profile
    const profileUrl = await page.locator('[data-testid="profile-url"]').textContent()
    await page.goto(profileUrl!)
    
    // Verify profile content is displayed correctly
    await expect(page.locator('h1')).toHaveText(testProfileData.rising.name)
    await expect(page.locator('[data-testid="profile-tagline"]')).toHaveText(testProfileData.rising.tagline)
  })

  test('Complete Elite Profile Creation Workflow', async ({ page }) => {
    // Similar workflow for Elite tier
    await page.click('text=Request Invitation')
    await page.waitForURL('**/builder')
    
    await page.click('[data-testid="tier-elite"]')
    await page.click('text=Continue')
    
    // Fill Elite-specific fields
    await page.fill('[data-testid="name-input"]', testProfileData.elite.name)
    await page.fill('[data-testid="tagline-input"]', testProfileData.elite.tagline)
    await page.fill('[data-testid="bio-textarea"]', testProfileData.elite.bio)
    await page.fill('[data-testid="current-role"]', testProfileData.elite.currentRole)
    await page.fill('[data-testid="company"]', testProfileData.elite.company)
    await page.fill('[data-testid="industry"]', testProfileData.elite.industry)
    await page.fill('[data-testid="years-experience"]', testProfileData.elite.yearsOfExperience.toString())
    
    // Add achievements and links
    for (const achievement of testProfileData.elite.achievements) {
      await page.click('[data-testid="add-achievement"]')
      await page.fill('[data-testid="achievement-title"]', achievement.title)
      await page.fill('[data-testid="achievement-description"]', achievement.description)
      await page.fill('[data-testid="achievement-year"]', achievement.year)
      await page.selectOption('[data-testid="achievement-category"]', achievement.category)
      await page.click('[data-testid="save-achievement"]')
    }
    
    // Test drag-and-drop reordering
    const firstAchievement = page.locator('[data-testid="achievement-item"]').first()
    const secondAchievement = page.locator('[data-testid="achievement-item"]').nth(1)
    await firstAchievement.dragTo(secondAchievement)
    
    // Save and publish
    await page.click('[data-testid="save-draft"]')
    await page.click('[data-testid="publish-profile"]')
    
    // Verify success
    await expect(page.locator('text=Profile published successfully')).toBeVisible()
  })

  test('File Upload Functionality', async ({ page }) => {
    await page.goto('/builder')
    
    // Test hero image upload
    const fileInput = page.locator('[data-testid="hero-image-upload"]')
    await fileInput.setInputFiles('tests/fixtures/sample-image.jpg')
    
    // Verify upload progress
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible({ timeout: 10000 })
    
    // Test gallery upload
    const galleryInput = page.locator('[data-testid="gallery-upload"]')
    await galleryInput.setInputFiles([
      'tests/fixtures/gallery-1.jpg',
      'tests/fixtures/gallery-2.jpg'
    ])
    
    // Verify multiple files uploaded
    await expect(page.locator('[data-testid="gallery-item"]')).toHaveCount(2)
    
    // Test drag-and-drop reordering in gallery
    const firstImage = page.locator('[data-testid="gallery-item"]').first()
    const secondImage = page.locator('[data-testid="gallery-item"]').nth(1)
    await firstImage.dragTo(secondImage)
  })

  test('Form Validation and Error Handling', async ({ page }) => {
    await page.goto('/builder')
    
    // Test required field validation
    await page.click('[data-testid="tier-rising"]')
    await page.click('text=Continue')
    
    // Try to proceed without filling required fields
    await page.click('[data-testid="save-draft"]')
    
    // Verify validation errors
    await expect(page.locator('[data-testid="name-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="bio-error"]')).toBeVisible()
    
    // Test character limits
    const longText = 'a'.repeat(5001) // Exceeds bio limit
    await page.fill('[data-testid="bio-textarea"]', longText)
    await expect(page.locator('[data-testid="bio-error"]')).toContainText('must be less than 5000 characters')
    
    // Test URL validation for social links
    await page.click('[data-testid="add-social-link"]')
    await page.fill('[data-testid="link-url"]', 'invalid-url')
    await page.click('[data-testid="save-link"]')
    await expect(page.locator('[data-testid="url-error"]')).toBeVisible()
  })

  test('Auto-save Functionality', async ({ page }) => {
    await page.goto('/builder')
    
    // Fill some data
    await page.click('[data-testid="tier-rising"]')
    await page.fill('[data-testid="name-input"]', 'Test User')
    
    // Wait for auto-save (30 seconds interval)
    await page.waitForSelector('[data-testid="auto-save-indicator"]', { timeout: 35000 })
    await expect(page.locator('[data-testid="auto-save-indicator"]')).toContainText('Saved')
    
    // Refresh page and verify data persists
    await page.reload()
    await expect(page.locator('[data-testid="name-input"]')).toHaveValue('Test User')
  })

  test('Responsive Design Testing', async ({ page }) => {
    await page.goto('/builder')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('[data-testid="tablet-layout"]')).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('[data-testid="desktop-layout"]')).toBeVisible()
  })
})
