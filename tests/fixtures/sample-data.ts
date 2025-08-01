// Sample data for E2E testing
export const sampleProfiles = {
  rising: {
    name: 'Alex Johnson',
    tagline: 'Innovative Software Engineer & Tech Entrepreneur',
    bio: 'Passionate software engineer with 5 years of experience building scalable web applications. Currently leading a team of developers at TechCorp, focusing on AI-driven solutions for e-commerce platforms. Strong advocate for clean code, agile methodologies, and continuous learning. Experienced in full-stack development with expertise in modern JavaScript frameworks, cloud architecture, and DevOps practices.',
    currentRole: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
    aspirations: 'To become a CTO of a tech startup and mentor the next generation of developers while building innovative solutions that make a positive impact on society.',
    achievements: [
      {
        title: 'Led Migration to Microservices',
        description: 'Successfully led the migration of a monolithic application to microservices architecture, reducing deployment time by 70% and improving system reliability',
        year: '2023',
        category: 'technical'
      },
      {
        title: 'Open Source Contributor',
        description: 'Active contributor to React ecosystem with 500+ GitHub stars across projects and maintainer of popular npm packages',
        year: '2022',
        category: 'community'
      },
      {
        title: 'Tech Conference Speaker',
        description: 'Delivered keynote presentations at 3 major tech conferences on modern web development practices',
        year: '2023',
        category: 'speaking'
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
      },
      {
        title: 'Personal Website',
        url: 'https://alexjohnson.dev',
        type: 'website'
      }
    ]
  },

  elite: {
    name: 'Dr. Sarah Chen',
    tagline: 'Healthcare Innovation Leader & Digital Transformation Expert',
    bio: 'Visionary healthcare executive with 15+ years of experience transforming healthcare delivery through technology. Currently serving as Chief Digital Officer at MedTech Innovations, where I lead digital transformation initiatives across 50+ hospitals. Recognized thought leader in healthcare AI and telemedicine with multiple patents and publications. Board member of the Healthcare Technology Association and advisor to several health tech startups.',
    currentRole: 'Chief Digital Officer',
    company: 'MedTech Innovations',
    industry: 'Healthcare Technology',
    yearsOfExperience: 15,
    expertise: ['Digital Health', 'AI in Healthcare', 'Telemedicine', 'Healthcare Operations', 'Data Analytics', 'Regulatory Compliance'],
    achievements: [
      {
        title: 'Implemented AI Diagnostic System',
        description: 'Led implementation of AI-powered diagnostic system that improved accuracy by 25% and reduced diagnosis time by 40% across network hospitals',
        year: '2023',
        category: 'innovation'
      },
      {
        title: 'Healthcare Innovation Award',
        description: 'Received the National Healthcare Innovation Award for pioneering telemedicine solutions during COVID-19 pandemic',
        year: '2021',
        category: 'recognition'
      },
      {
        title: 'Digital Health Patent',
        description: 'Awarded patent for novel patient monitoring system that integrates IoT devices with electronic health records',
        year: '2022',
        category: 'intellectual_property'
      },
      {
        title: 'Published Research',
        description: 'Co-authored 12 peer-reviewed papers on healthcare technology adoption and digital transformation strategies',
        year: '2020-2023',
        category: 'research'
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
      },
      {
        title: 'Research Publications',
        url: 'https://scholar.google.com/citations?user=sarahchen',
        type: 'other'
      }
    ]
  },

  legacy: {
    name: 'Professor Margaret Williams',
    tagline: 'Pioneer in Computer Science Education & AI Research',
    bio: 'Legendary computer scientist and educator who shaped the field of artificial intelligence for over four decades. Professor Emeritus at Stanford University, where she established the first AI research lab in 1975. Mentor to three generations of computer scientists, including 15 Turing Award winners. Her groundbreaking work on machine learning algorithms laid the foundation for modern AI systems.',
    legacy: 'Pioneering AI researcher and educator who mentored generations of computer scientists',
    era: '1970s - 2010s',
    primaryContributions: [
      'Developed foundational machine learning algorithms',
      'Established first university AI research lab',
      'Mentored 15 future Turing Award winners',
      'Authored seminal textbook "Foundations of Artificial Intelligence"'
    ],
    historicalImpact: 'Her research and teaching fundamentally shaped the development of artificial intelligence as a field, with her students going on to lead major tech companies and research institutions worldwide.',
    timeline: [
      {
        year: 1975,
        event: 'Established AI Research Lab at Stanford',
        significance: 'First dedicated AI research facility at a major university'
      },
      {
        year: 1982,
        event: 'Published "Foundations of Artificial Intelligence"',
        significance: 'Became the standard textbook for AI education worldwide'
      },
      {
        year: 1995,
        event: 'Received Turing Award',
        significance: 'Recognized for contributions to machine learning and AI education'
      },
      {
        year: 2010,
        event: 'Retired from Stanford University',
        significance: 'End of 35-year career that shaped modern computer science'
      }
    ],
    quotes: [
      {
        text: 'The future of artificial intelligence lies not in replacing human intelligence, but in augmenting it.',
        context: 'Keynote speech at AI Conference 1985',
        year: 1985
      },
      {
        text: 'Teaching is the highest form of understanding. When you can explain complex concepts simply, you truly master them.',
        context: 'Interview with Computer Science Today',
        year: 1998
      }
    ],
    recognitions: [
      {
        title: 'Turing Award',
        organization: 'Association for Computing Machinery',
        year: 1995,
        significance: 'Highest honor in computer science for contributions to AI'
      },
      {
        title: 'National Medal of Science',
        organization: 'National Science Foundation',
        year: 2000,
        significance: 'Presidential recognition for scientific achievement'
      }
    ],
    influence: [
      {
        area: 'AI Research',
        description: 'Her algorithms are still used in modern machine learning systems',
        continuingImpact: 'Foundation for deep learning and neural networks'
      },
      {
        area: 'Computer Science Education',
        description: 'Curriculum design principles adopted by universities worldwide',
        continuingImpact: 'Standard approach to teaching AI and machine learning'
      }
    ]
  }
}

export const mockAIResponses = {
  bioPolishing: {
    original: 'I am a software engineer with experience in web development.',
    polished: 'Accomplished software engineer with extensive expertise in modern web development technologies and a proven track record of delivering scalable, high-performance applications that drive business growth and enhance user experiences.'
  },
  achievementPolishing: {
    original: 'Built a website for my company',
    polished: 'Architected and developed a comprehensive corporate website that increased online engagement by 150% and streamlined customer acquisition processes, resulting in a 25% boost in lead generation.'
  }
}

export const testCredentials = {
  testUser: {
    email: 'test@iconsherald.com',
    password: 'TestPassword123!'
  },
  adminUser: {
    email: 'admin@iconsherald.com',
    password: 'AdminPassword123!'
  }
}
