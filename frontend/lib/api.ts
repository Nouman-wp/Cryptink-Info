const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  token?: string
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  private async request(endpoint: string, options: ApiOptions = {}) {
    const { method = 'GET', body, token } = options

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const config: RequestInit = {
      method,
      headers,
    }

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || error.message || 'Request failed')
    }

    return response.json()
  }

  // Auth endpoints
  async verifyWallet(walletAddress: string, signature: string, message: string) {
    return this.request('/api/auth/verify', {
      method: 'POST',
      body: { walletAddress, signature, message }
    })
  }

  async getCurrentUser(token: string) {
    return this.request('/api/auth/me', { token })
  }

  // Projects endpoints
  async getProjects(visibility?: string) {
    const query = visibility ? `?visibility=${visibility}` : ''
    return this.request(`/api/projects${query}`)
  }

  async getProject(id: string) {
    return this.request(`/api/projects/${id}`)
  }

  async createProject(data: any, token: string) {
    return this.request('/api/projects', {
      method: 'POST',
      body: data,
      token
    })
  }

  async updateProject(id: string, data: any, token: string) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: data,
      token
    })
  }

  async deleteProject(id: string, token: string) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
      token
    })
  }

  async getMyProjects(token: string) {
    return this.request('/api/projects/user/my-projects', { token })
  }

  // Chapters endpoints
  async getChapters(projectId: string) {
    return this.request(`/api/chapters/project/${projectId}`)
  }

  async getChapter(id: string) {
    return this.request(`/api/chapters/${id}`)
  }

  async createChapter(data: any, token: string) {
    return this.request('/api/chapters', {
      method: 'POST',
      body: data,
      token
    })
  }

  async updateChapter(id: string, data: any, token: string) {
    return this.request(`/api/chapters/${id}`, {
      method: 'PUT',
      body: data,
      token
    })
  }

  // AI endpoints
  async getAISuggestions(context: string, userInput: string, token: string) {
    return this.request('/api/ai/suggestions', {
      method: 'POST',
      body: { context, userInput },
      token
    })
  }

  async checkGrammar(text: string, token: string) {
    return this.request('/api/ai/grammar-check', {
      method: 'POST',
      body: { text },
      token
    })
  }

  // Users endpoints
  async getUser(walletAddress: string) {
    return this.request(`/api/users/${walletAddress}`)
  }

  async updateProfile(data: any, token: string) {
    return this.request('/api/users/me', {
      method: 'PUT',
      body: data,
      token
    })
  }

  async getUserStats(walletAddress: string) {
    return this.request(`/api/users/${walletAddress}/stats`)
  }
}

export const api = new ApiClient()
