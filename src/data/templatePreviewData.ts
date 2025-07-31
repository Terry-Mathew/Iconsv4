import { ProfileTier } from '@/types/profile'

export interface TemplatePreviewData {
  tier: ProfileTier
  templateCount: number
  mockProfile: {
    name: string
    tagline: string
    heroImage: string
    bio: {
      ai_polished: string
    }
    currentRole?: string
    company?: string
    industry?: string
    yearsOfExperience?: number
    skills?: string[]
    aspirations?: string
    achievements?: Array<{
      title: string
      description: string
      year: string
      category?: string
    }>
    projects?: Array<{
      title: string
      description: string
      link?: string
    }>
    gallery?: Array<{
      url: string
      caption: string
    }>
    links?: Array<{
      title: string
      url: string
      type: string
    }>
    leadership?: Array<{
      title: string
      organization: string
      duration: string
      description: string
    }>
    publications?: Array<{
      title: string
      publication: string
      year: number
      link?: string
    }>
    awards?: Array<{
      title: string
      organization: string
      year: number
      description?: string
    }>
    interactiveTimeline?: Array<{
      year: number
      event: string
      description: string
      category?: string
    }>
    qrCodeEnabled?: boolean
    impactMetrics?: Array<{
      metric: string
      value: string
      description?: string
    }>
    // Legacy specific
    legacyStatement?: string
    primaryContributions?: string[]
    historicalImpact?: string
    recognitions?: Array<{
      title: string
      organization: string
      year: number
      description: string
    }>
    influence?: string
    additionalQuotes?: Array<{
      text: string
      attribution: string
      year: number
    }>
  }
  features: string[]
  limitations: string[]
}

export const TEMPLATE_PREVIEW_DATA: Record<ProfileTier, TemplatePreviewData> = {
  emerging: {
    tier: 'emerging',
    templateCount: 2,
    mockProfile: {
      name: 'Jordan Taylor',
      tagline: 'Aspiring Data Scientist & Machine Learning Enthusiast',
      heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: {
        ai_polished: 'A passionate data science graduate with hands-on experience in machine learning and statistical analysis. Currently building innovative solutions at a growing tech startup while pursuing advanced certifications in AI and cloud computing.'
      },
      currentRole: 'Junior Data Scientist',
      company: 'DataFlow Solutions',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Tableau', 'AWS'],
      aspirations: 'To become a leading AI researcher and develop machine learning solutions that solve real-world problems while contributing to open-source projects and mentoring aspiring data scientists.',
      achievements: [
        {
          title: 'Best Capstone Project',
          description: 'Developed a predictive model for customer churn that achieved 92% accuracy',
          year: '2024',
          category: 'Academic'
        },
        {
          title: 'Kaggle Competition Winner',
          description: 'Placed 1st in regional data science competition with 500+ participants',
          year: '2023',
          category: 'Competition'
        }
      ],
      projects: [
        {
          title: 'Smart City Traffic Optimizer',
          description: 'ML model that optimizes traffic light timing to reduce congestion by 25%',
          link: 'https://github.com/jordantaylor/traffic-optimizer'
        },
        {
          title: 'Healthcare Analytics Dashboard',
          description: 'Interactive dashboard for hospital administrators to track patient outcomes',
          link: 'https://github.com/jordantaylor/healthcare-dashboard'
        }
      ],
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
          caption: 'Presenting at Data Science Conference 2024'
        },
        {
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
          caption: 'Team collaboration on ML project'
        },
        {
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
          caption: 'Data visualization workshop'
        },
        {
          url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
          caption: 'Working on algorithm optimization'
        }
      ],
      links: [
        {
          title: 'GitHub',
          url: 'https://github.com/jordantaylor',
          type: 'github'
        },
        {
          title: 'LinkedIn',
          url: 'https://linkedin.com/in/jordantaylor',
          type: 'linkedin'
        },
        {
          title: 'Kaggle',
          url: 'https://kaggle.com/jordantaylor',
          type: 'kaggle'
        }
      ]
    },
    features: [
      'Professional profile with AI bio polishing',
      'Up to 4 gallery photos with captions',
      '2 customizable template designs',
      'Skills and aspirations showcase',
      'Achievement highlights',
      'Project portfolio with links',
      'Social media integration',
      'Mobile-optimized responsive design'
    ],
    limitations: [
      'Limited to 4 gallery photos',
      'Basic template customization',
      'No QR code generation',
      'No interactive timeline',
      'Standard customer support'
    ]
  },

  accomplished: {
    tier: 'accomplished',
    templateCount: 5,
    mockProfile: {
      name: 'Dr. Sarah Mitchell',
      tagline: 'Senior Product Manager & Innovation Strategist',
      heroImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: {
        ai_polished: 'Accomplished product management leader with 8+ years of experience driving digital transformation at Fortune 500 companies. Expert in agile methodologies, user experience design, and cross-functional team leadership with a proven track record of launching products that generate $50M+ in annual revenue.'
      },
      currentRole: 'Senior Product Manager',
      company: 'TechGlobal Inc.',
      industry: 'Technology',
      yearsOfExperience: 8,
      skills: ['Product Strategy', 'Agile/Scrum', 'UX Design', 'Data Analytics', 'Team Leadership', 'Market Research'],
      achievements: [
        {
          title: 'Product Innovation Award',
          description: 'Led development of AI-powered recommendation engine that increased user engagement by 40%',
          year: '2024',
          category: 'Innovation'
        },
        {
          title: 'Team Leadership Excellence',
          description: 'Successfully managed cross-functional team of 25+ members across 3 time zones',
          year: '2023',
          category: 'Leadership'
        },
        {
          title: 'Revenue Growth Champion',
          description: 'Launched product line that generated $75M in first-year revenue',
          year: '2022',
          category: 'Business Impact'
        }
      ],
      leadership: [
        {
          title: 'VP of Product Strategy',
          organization: 'InnovateTech Solutions',
          duration: '2020-2023',
          description: 'Led product strategy for B2B SaaS platform serving 10,000+ enterprise clients'
        },
        {
          title: 'Senior Product Manager',
          organization: 'DigitalFirst Corp',
          duration: '2018-2020',
          description: 'Managed product roadmap for mobile application with 2M+ active users'
        }
      ],
      interactiveTimeline: [
        {
          year: 2016,
          event: 'Started as Associate Product Manager',
          description: 'Joined TechStart as first PM hire, helped scale from startup to Series B',
          category: 'Career'
        },
        {
          year: 2018,
          event: 'Promoted to Senior Product Manager',
          description: 'Led product team through successful acquisition by DigitalFirst Corp',
          category: 'Career'
        },
        {
          year: 2020,
          event: 'VP of Product Strategy',
          description: 'Joined InnovateTech to lead enterprise product strategy',
          category: 'Career'
        },
        {
          year: 2023,
          event: 'Senior Product Manager at TechGlobal',
          description: 'Leading AI/ML product initiatives at Fortune 500 company',
          category: 'Career'
        }
      ],
      qrCodeEnabled: true,
      gallery: [
        {
          url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop',
          caption: 'Keynote at ProductCon 2024'
        },
        {
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
          caption: 'Leading product strategy session'
        },
        {
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop',
          caption: 'Product launch celebration'
        },
        {
          url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop',
          caption: 'User research workshop'
        },
        {
          url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
          caption: 'Team building retreat'
        },
        {
          url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
          caption: 'Industry conference panel'
        },
        {
          url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop',
          caption: 'Product demo presentation'
        },
        {
          url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
          caption: 'Agile planning session'
        },
        {
          url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
          caption: 'Customer feedback review'
        },
        {
          url: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=400&fit=crop',
          caption: 'Product roadmap planning'
        }
      ],
      links: [
        {
          title: 'LinkedIn',
          url: 'https://linkedin.com/in/sarahmitchell',
          type: 'linkedin'
        },
        {
          title: 'Medium Blog',
          url: 'https://medium.com/@sarahmitchell',
          type: 'blog'
        },
        {
          title: 'Product Portfolio',
          url: 'https://sarahmitchell.com',
          type: 'website'
        }
      ]
    },
    features: [
      'Everything in Emerging tier',
      'Up to 10 gallery photos with captions',
      '5 customizable template designs',
      'QR code generation for easy sharing',
      'Interactive timeline feature',
      'Leadership experience showcase',
      'Professional networking tools',
      'Priority customer support'
    ],
    limitations: [
      'Limited to 10 gallery photos',
      'No publications section',
      'No impact metrics display',
      'Standard template customization'
    ]
  },

  distinguished: {
    tier: 'distinguished',
    templateCount: 6,
    mockProfile: {
      name: 'Prof. Michael Chen',
      tagline: 'Chief Technology Officer & AI Research Pioneer',
      heroImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: {
        ai_polished: 'Visionary technology leader and AI research pioneer with 15+ years of experience driving innovation at the intersection of artificial intelligence and enterprise software. Currently serving as CTO at a Fortune 100 company while maintaining active research collaborations with leading universities worldwide.'
      },
      currentRole: 'Chief Technology Officer',
      company: 'GlobalTech Enterprises',
      industry: 'Technology & AI Research',
      yearsOfExperience: 15,
      skills: ['Artificial Intelligence', 'Machine Learning', 'Cloud Architecture', 'Team Leadership', 'Research & Development', 'Strategic Planning'],
      achievements: [
        {
          title: 'AI Innovation Leadership Award',
          description: 'Recognized for pioneering breakthrough in natural language processing that revolutionized customer service automation',
          year: '2024',
          category: 'Innovation'
        },
        {
          title: 'Technology Excellence Award',
          description: 'Led development of AI platform that processes 1B+ transactions daily with 99.99% uptime',
          year: '2023',
          category: 'Technical Achievement'
        },
        {
          title: 'Industry Thought Leader',
          description: 'Keynote speaker at 50+ international conferences on AI and machine learning',
          year: '2022',
          category: 'Thought Leadership'
        }
      ],
      leadership: [
        {
          title: 'Chief Technology Officer',
          organization: 'GlobalTech Enterprises',
          duration: '2021-Present',
          description: 'Leading technology strategy for 50,000+ employee organization with $10B+ annual revenue'
        },
        {
          title: 'VP of AI Research',
          organization: 'InnovateAI Labs',
          duration: '2018-2021',
          description: 'Built and led AI research division from 5 to 150+ researchers and engineers'
        }
      ],
      publications: [
        {
          title: 'Transformer Networks for Enterprise-Scale Natural Language Processing',
          publication: 'Nature Machine Intelligence',
          year: 2024,
          link: 'https://nature.com/articles/transformer-nlp-2024'
        },
        {
          title: 'Scalable AI Architectures for Real-Time Decision Making',
          publication: 'IEEE Transactions on AI',
          year: 2023,
          link: 'https://ieee.org/articles/scalable-ai-2023'
        },
        {
          title: 'Ethical AI Implementation in Enterprise Environments',
          publication: 'ACM Computing Surveys',
          year: 2022,
          link: 'https://acm.org/articles/ethical-ai-2022'
        }
      ],
      awards: [
        {
          title: 'IEEE Fellow',
          organization: 'Institute of Electrical and Electronics Engineers',
          year: 2023,
          description: 'Recognized for contributions to artificial intelligence and machine learning systems'
        },
        {
          title: 'Technology Innovator of the Year',
          organization: 'TechCrunch',
          year: 2022,
          description: 'Honored for breakthrough achievements in enterprise AI applications'
        }
      ],
      impactMetrics: [
        {
          metric: 'Research Citations',
          value: '15,000+',
          description: 'Total citations across 50+ peer-reviewed publications'
        },
        {
          metric: 'Patents Filed',
          value: '25',
          description: 'AI and machine learning patents with commercial applications'
        },
        {
          metric: 'Team Members Led',
          value: '500+',
          description: 'Engineers and researchers across multiple organizations'
        },
        {
          metric: 'Revenue Impact',
          value: '$2.5B+',
          description: 'Direct revenue attribution from AI products and platforms'
        }
      ],
      gallery: Array.from({ length: 20 }, (_, i) => ({
        url: `https://images.unsplash.com/photo-${1551288049 + i}-bebda4e38f71?w=600&h=400&fit=crop`,
        caption: [
          'Delivering keynote at AI Summit 2024',
          'Leading research team meeting',
          'Patent filing celebration',
          'Industry awards ceremony',
          'University guest lecture',
          'Product launch presentation',
          'Research collaboration session',
          'Technology conference panel',
          'Team innovation workshop',
          'AI ethics symposium',
          'Startup mentoring session',
          'Board meeting presentation',
          'Research paper publication',
          'Technology demonstration',
          'Industry partnership signing',
          'Innovation lab tour',
          'Graduate student mentoring',
          'Technical architecture review',
          'Global team video conference',
          'Technology roadmap planning'
        ][i]
      })),
      links: [
        {
          title: 'LinkedIn',
          url: 'https://linkedin.com/in/michaelchen',
          type: 'linkedin'
        },
        {
          title: 'Research Profile',
          url: 'https://scholar.google.com/michaelchen',
          type: 'academic'
        },
        {
          title: 'Personal Website',
          url: 'https://michaelchen.ai',
          type: 'website'
        },
        {
          title: 'Twitter',
          url: 'https://twitter.com/michaelchen_ai',
          type: 'twitter'
        }
      ]
    },
    features: [
      'Everything in Accomplished tier',
      'Up to 20 gallery photos with captions',
      '6 premium customizable templates',
      'Publications & research showcase',
      'Advanced impact metrics display',
      'Patent and award highlights',
      'Industry recognition section',
      'White-glove customer service',
      'Premium gradient color schemes'
    ],
    limitations: [
      'Limited to 20 gallery photos',
      'Premium features require annual subscription'
    ]
  },

  legacy: {
    tier: 'legacy',
    templateCount: 1,
    mockProfile: {
      name: 'Dr. Eleanor Roosevelt Chen',
      tagline: 'Pioneering Neuroscientist & Medical Research Visionary (1945-2023)',
      heroImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      bio: {
        ai_polished: 'A groundbreaking neuroscientist whose revolutionary research on neuroplasticity and brain-computer interfaces transformed our understanding of the human mind. Her work laid the foundation for modern treatments of neurological disorders and inspired a generation of researchers to pursue the impossible.'
      },
      legacyStatement: 'Dr. Chen dedicated her life to unlocking the mysteries of the human brain, believing that understanding consciousness was the key to alleviating human suffering. Her pioneering research continues to save lives and restore hope to millions worldwide.',
      primaryContributions: [
        'Discovered the Chen-Nakamura pathway for neural regeneration',
        'Developed the first successful brain-computer interface for paralyzed patients',
        'Founded the Global Institute for Neurological Research',
        'Mentored 200+ PhD students who now lead research institutions worldwide',
        'Published 150+ peer-reviewed papers with 50,000+ citations'
      ],
      historicalImpact: 'Dr. Chen\'s work fundamentally changed how we understand brain plasticity and recovery. Her research enabled breakthrough treatments for stroke, spinal cord injuries, and neurodegenerative diseases, directly improving the lives of millions of patients worldwide.',
      recognitions: [
        {
          title: 'Nobel Prize in Physiology or Medicine',
          organization: 'Nobel Committee',
          year: 2018,
          description: 'For discoveries concerning neural plasticity and brain-computer interfaces'
        },
        {
          title: 'Lasker Award for Basic Medical Research',
          organization: 'Lasker Foundation',
          year: 2015,
          description: 'For fundamental discoveries in neuroplasticity mechanisms'
        },
        {
          title: 'National Medal of Science',
          organization: 'National Science Foundation',
          year: 2012,
          description: 'For pioneering contributions to neuroscience and medical technology'
        }
      ],
      influence: 'Beyond her scientific achievements, Dr. Chen was a passionate advocate for women in STEM, establishing scholarship programs that have supported over 1,000 female scientists. Her mentorship philosophy of "curiosity with compassion" continues to guide research institutions worldwide.',
      additionalQuotes: [
        {
          text: 'The brain is not just an organ; it is the universe\'s way of understanding itself.',
          attribution: 'Dr. Eleanor Roosevelt Chen',
          year: 2019
        },
        {
          text: 'Every neural connection we map brings us closer to healing the unhealable.',
          attribution: 'Dr. Eleanor Roosevelt Chen',
          year: 2016
        },
        {
          text: 'Science without compassion is merely data; compassion without science is merely hope.',
          attribution: 'Dr. Eleanor Roosevelt Chen',
          year: 2020
        }
      ],
      gallery: Array.from({ length: 12 }, (_, i) => ({
        url: `https://images.unsplash.com/photo-${1551288049 + i}-bebda4e38f71?w=600&h=400&fit=crop`,
        caption: [
          'Nobel Prize acceptance ceremony, 2018',
          'First successful brain-computer interface demonstration',
          'With research team at Global Institute founding',
          'Delivering commencement address at Harvard Medical School',
          'In the laboratory where breakthrough discoveries were made',
          'Mentoring young researchers in neural interface technology',
          'Speaking at World Health Organization summit',
          'Receiving National Medal of Science from President',
          'Final research presentation before retirement',
          'With family at 75th birthday celebration',
          'Legacy laboratory dedication ceremony',
          'Memorial service attended by global scientific community'
        ][i]
      })),
      links: [
        {
          title: 'Memorial Foundation',
          url: 'https://eleanorchenfoundation.org',
          type: 'foundation'
        },
        {
          title: 'Research Archive',
          url: 'https://archive.globalneuro.org/chen',
          type: 'archive'
        },
        {
          title: 'Documentary Film',
          url: 'https://brainpioneers.com/eleanor-chen',
          type: 'documentary'
        }
      ]
    },
    features: [
      'Dedicated memorial templates',
      'Unlimited gallery photos',
      'Historical timeline preservation',
      'Tribute collection system',
      'Legacy statement showcase',
      'Recognition and awards archive',
      'Influence and impact documentation',
      'Family access management',
      'Lifetime hosting guarantee',
      'Memorial service coordination'
    ],
    limitations: [
      'Memorial service only - not for living individuals',
      'One-time lifetime payment required'
    ]
  }
}
