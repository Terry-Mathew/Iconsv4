import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Supabase mocks will be defined in individual test files

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.CLAUDE_API_KEY = 'test-claude-key'
process.env.RAZORPAY_KEY_SECRET = 'test-razorpay-secret'

// Mock fetch globally
global.fetch = jest.fn()

// Mock Web APIs for Next.js API routes
global.Request = class Request {
  constructor(input, init) {
    this.url = input
    this.method = init?.method || 'GET'
    this.headers = new Headers(init?.headers)
    this.body = init?.body
    this._json = null
  }

  async json() {
    if (this._json) return this._json
    if (typeof this.body === 'string') {
      return JSON.parse(this.body)
    }
    return this.body
  }

  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
  }
}

global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Headers(init?.headers)
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }

  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
  }
}

global.Headers = class Headers {
  constructor(init) {
    this._headers = new Map()
    if (init) {
      if (init instanceof Headers) {
        init._headers.forEach((value, key) => this._headers.set(key, value))
      } else if (Array.isArray(init)) {
        init.forEach(([key, value]) => this._headers.set(key, value))
      } else {
        Object.entries(init).forEach(([key, value]) => this._headers.set(key, value))
      }
    }
  }

  get(name) {
    return this._headers.get(name.toLowerCase())
  }

  set(name, value) {
    this._headers.set(name.toLowerCase(), value)
  }

  has(name) {
    return this._headers.has(name.toLowerCase())
  }

  delete(name) {
    this._headers.delete(name.toLowerCase())
  }

  forEach(callback) {
    this._headers.forEach(callback)
  }
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
})

// Suppress console errors in tests unless explicitly needed
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
