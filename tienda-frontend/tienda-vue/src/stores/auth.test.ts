import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should have empty initial state', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBe(null)
  })

  it('should set user on login', () => {
    const auth = useAuthStore()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@test.com',
      role: 'user'
    }
    
    auth.setUser(mockUser)
    
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user?.username).toBe('testuser')
  })

  it('should clear user on logout', () => {
    const auth = useAuthStore()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@test.com',
      role: 'user'
    }
    
    auth.setUser(mockUser)
    auth.logout()
    
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBe(null)
  })

  it('should get user role', () => {
    const auth = useAuthStore()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@test.com',
      role: 'admin'
    }
    
    auth.setUser(mockUser)
    
    expect(auth.userRole).toBe('admin')
  })
})