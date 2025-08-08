import { useState, useCallback } from 'react'
import apiClient from '@/lib/api'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  return {
    ...state,
    execute,
  }
}

// Specific API hooks
export function useAds() {
  const { data, loading, error, execute } = useApi()

  const getAds = useCallback(async (params?: any) => {
    return execute(() => apiClient.getAds(params))
  }, [execute])

  const getAd = useCallback(async (id: string) => {
    return execute(() => apiClient.getAd(id))
  }, [execute])

  const createAd = useCallback(async (adData: any) => {
    return execute(() => apiClient.createAd(adData))
  }, [execute])

  const updateAd = useCallback(async (id: string, adData: any) => {
    return execute(() => apiClient.updateAd(id, adData))
  }, [execute])

  const deleteAd = useCallback(async (id: string) => {
    return execute(() => apiClient.deleteAd(id))
  }, [execute])

  return {
    ads: data,
    loading,
    error,
    getAds,
    getAd,
    createAd,
    updateAd,
    deleteAd,
  }
}

export function useCategories() {
  const { data, loading, error, execute } = useApi()

  const getCategories = useCallback(async (parentId?: string) => {
    return execute(() => apiClient.getCategories(parentId))
  }, [execute])

  return {
    categories: data,
    loading,
    error,
    getCategories,
  }
}

export function useLocations() {
  const { data, loading, error, execute } = useApi()

  const getLocations = useCallback(async (params?: any) => {
    return execute(() => apiClient.getLocations(params))
  }, [execute])

  return {
    locations: data,
    loading,
    error,
    getLocations,
  }
}

export function useUpload() {
  const { data, loading, error, execute } = useApi()

  const uploadFile = useCallback(async (file: File) => {
    return execute(() => apiClient.uploadFile(file))
  }, [execute])

  return {
    uploadResult: data,
    loading,
    error,
    uploadFile,
  }
}

export function useChat() {
  const { data, loading, error, execute } = useApi()

  const getConversations = useCallback(async () => {
    return execute(() => apiClient.getConversations())
  }, [execute])

  const sendMessage = useCallback(async (messageData: any) => {
    return execute(() => apiClient.sendMessage(messageData))
  }, [execute])

  return {
    conversations: data,
    loading,
    error,
    getConversations,
    sendMessage,
  }
} 