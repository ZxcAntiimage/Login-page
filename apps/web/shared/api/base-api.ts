"use client"

import { useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const baseApi = {
  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    const config: RequestInit = {
      method,
      headers,
      ...options,
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: 'Unknown error occurred' }
        }

        throw new ApiError(
          errorData.message || 'Request failed',
          response.status,
          errorData
        )
      }

      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        throw new ApiError(error.message, 500)
      }

      throw new ApiError('Network error occurred', 500)
    }
  },

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options)
  },

  async post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>('POST', endpoint, data, options)
  },

  async put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options)
  },

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options)
  },

  async patch<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options)
  },
}

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<T> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await baseApi.request<T>(method, endpoint, data, options)
      return result
    } catch (err) {
      setError(err as ApiError)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    request,
    get: <T>(endpoint: string, options: RequestInit = {}) => baseApi.get<T>(endpoint, options),
    post: <T>(endpoint: string, data: any, options: RequestInit = {}) => baseApi.post<T>(endpoint, data, options),
    put: <T>(endpoint: string, data: any, options: RequestInit = {}) => baseApi.put<T>(endpoint, data, options),
    delete: <T>(endpoint: string, options: RequestInit = {}) => baseApi.delete<T>(endpoint, options),
    patch: <T>(endpoint: string, data: any, options: RequestInit = {}) => baseApi.patch<T>(endpoint, data, options),
    isLoading,
    error,
    clearError,
  }
}

