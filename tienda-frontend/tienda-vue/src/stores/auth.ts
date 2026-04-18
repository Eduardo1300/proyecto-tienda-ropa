import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../api'
import type { User, LoginCredentials, RegisterData } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    const hasUser = !!user.value
    const hasToken = !!localStorage.getItem('access_token') || !!localStorage.getItem('token')
    return hasUser && hasToken
  })
  
  const isAdmin = computed(() => user.value?.role === 'admin')

  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('access_token') || localStorage.getItem('token')
    
    console.log('initAuth - savedUser:', savedUser ? 'exists' : 'none')
    console.log('initAuth - savedToken:', savedToken ? 'exists' : 'none')
    
    if (savedUser && savedToken) {
      try {
        user.value = JSON.parse(savedUser)
        console.log('initAuth - user loaded:', user.value)
      } catch (e) {
        console.error('Error parsing saved user:', e)
        logout()
      }
    }
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authAPI.login(credentials)
      console.log('Full API response:', response)
      console.log('response.data:', response.data)
      
      const data = response.data as any
      
      // Handle different response formats
      let token = null
      let userData = null
      
      if (data.access_token) {
        token = data.access_token
        userData = data.user
      } else if (data.data?.access_token) {
        token = data.data.access_token
        userData = data.data.user
      } else if (data.token) {
        token = data.token
        userData = data.user
      }
      
      console.log('Extracted token:', token ? 'yes' : 'no')
      console.log('userData from login:', userData)

      if (token) {
        localStorage.setItem('access_token', token)
        localStorage.setItem('token', token)
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }

        // Get user profile
        try {
          const profileResponse = await authAPI.getProfile()
          console.log('Profile response:', profileResponse.data)
          
          if (profileResponse.data) {
            user.value = profileResponse.data as User
            localStorage.setItem('user', JSON.stringify(user.value))
          } else if (userData) {
            user.value = userData as User
            localStorage.setItem('user', JSON.stringify(user.value))
          }
        } catch (profileErr) {
          console.error('Error fetching profile:', profileErr)
          // Use userData from login response if profile fails
          if (userData) {
            user.value = userData as User
            localStorage.setItem('user', JSON.stringify(user.value))
          }
        }
        
        console.log('User set to:', user.value)
        
        return true
      }
      
      error.value = 'No se recibió token de autenticación'
      return false
    } catch (err: any) {
      console.error('Login error:', err)
      console.error('Error response:', err.response?.data)
      error.value = err.response?.data?.message || err.response?.data?.error || 'Credenciales inválidas'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authAPI.register(userData)
      return response.data?.message?.includes('success') || false
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error en el registro'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    console.log('User logged out')
  }

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch {
      logout()
    }
  }

  initAuth()

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile
  }
})