"use client"

import { baseApi, ApiError, useApi } from "@/shared/api/base-api"

export const authApi = {
  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
  }) {
    return baseApi.post<{ access_token: string }>('/auth/register', data)
  },
  async login(data: { email: string; password: string }) {
    return baseApi.post<{ access_token: string }>('/auth/login', data)
  },

  async getProfile() {
    return baseApi.get<{
      id: number
      email: string
      firstName: string | null
      lastName: string | null
      phone: string | null
      emailVerified: boolean
      createdAt: string
    }>('/auth/profile')
  },

  async logout() {
    return baseApi.post<{ message: string }>('/auth/logout', {})
  },

  async forgotPassword(email: string) {
    return baseApi.post<{ message: string; code?: string }>('/auth/forgot-password', { email })
  },


  async verifyCode(data: { email: string; code: string }) {
    return baseApi.post<{ message: string }>('/auth/verify-code', data)
  },

  async resetPassword(data: { email: string; code: string; newPassword: string }) {
    return baseApi.post<{ message: string }>('/auth/reset-password', data)
  },

  async verifyEmail(email: string) {
    return baseApi.post<{ message: string }>('/auth/verify-email', { email })
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return baseApi.post<{ message: string }>('/auth/change-password', data)
  },
}
export const useAuth = () => {
  const { request, isLoading, error, clearError } = useApi()

  return {
    register: (data: Parameters<typeof authApi.register>[0]) =>
      request('POST', '/auth/register', data),
    login: (data: Parameters<typeof authApi.login>[0]) =>
      request('POST', '/auth/login', data),
    getProfile: () => 
      request('GET', '/auth/profile', undefined),
    logout: () => 
      request('POST', '/auth/logout', undefined),
    forgotPassword: (email: string) =>
      request('POST', '/auth/forgot-password', { email }),
    verifyCode: (data: Parameters<typeof authApi.verifyCode>[0]) =>
      request('POST', '/auth/verify-code', data),
    resetPassword: (data: Parameters<typeof authApi.resetPassword>[0]) =>
      request('POST', '/auth/reset-password', data),
    verifyEmail: (email: string) =>
      request('POST', '/auth/verify-email', { email }),
    changePassword: (data: Parameters<typeof authApi.changePassword>[0]) =>
      request('POST', '/auth/change-password', data),
    isLoading,
    error,
    clearError,
  }
}

export const Auth = {
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('access_token')
  },

  setAuthenticated: (authenticated: boolean): void => {
    if (typeof window !== 'undefined') {
      if (authenticated) {
        localStorage.setItem('access_token', 'authenticated')
      } else {
        localStorage.removeItem('access_token')
      }
    }
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  },
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  },
  clearAuth: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  },

  handleLoginResponse: (response: { access_token: string }): void => {
    Auth.setToken(response.access_token)
  },

  handleLogout: (): void => {
    Auth.clearAuth()
    window.location.href = '/auth'
  },
}

export type { ApiError }