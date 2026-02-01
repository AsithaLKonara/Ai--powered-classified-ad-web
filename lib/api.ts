const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth APIs
  async register(userData: {
    name: string
    email: string
    password: string
    phone?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Ad APIs
  async getAds(params?: {
    page?: number
    limit?: number
    category?: string
    location?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    condition?: string
    type?: string
    userId?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    return this.request(`/ads?${searchParams.toString()}`)
  }

  async getAd(id: string) {
    return this.request(`/ads/${id}`)
  }

  async createAd(adData: {
    title: string
    description: string
    price: number
    categoryId: string
    locationId: string
    condition: string
    type: string
    images?: string[]
    attributes?: Array<{ key: string; value: string }>
  }) {
    return this.request('/ads', {
      method: 'POST',
      body: JSON.stringify(adData),
    })
  }

  async updateAd(id: string, adData: any) {
    return this.request(`/ads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adData),
    })
  }

  async deleteAd(id: string) {
    return this.request(`/ads/${id}`, {
      method: 'DELETE',
    })
  }

  // Category APIs
  async getCategories(parentId?: string) {
    const params = parentId ? `?parentId=${parentId}` : ''
    return this.request(`/categories${params}`)
  }

  // Location APIs
  async getLocations(params?: {
    parentId?: string
    type?: string
    search?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    return this.request(`/locations?${searchParams.toString()}`)
  }

  // Upload API
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${this.baseUrl}/upload`

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  // Chat APIs
  async getConversations() {
    return this.request('/chat')
  }

  async sendMessage(messageData: {
    receiverId: string
    content: string
    adId?: string
    type?: string
  }) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiClient = new ApiClient()
export default apiClient 