import { ref } from 'vue'

const user = ref(null)
const loading = ref(false)
const error = ref<string | null>(null)

const login = async (email: string, password: string, two_fa_code?: string) => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/auth/login-json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username: email,
        password,
        two_fa_code: two_fa_code || null
      })
    })
    const data = await response.json()
    if (!response.ok) {
      error.value = Array.isArray(data.detail)
        ? data.detail.map((e: unknown) => typeof e === 'object' && e && 'msg' in e ? (e as { msg: string }).msg : String(e)).join(', ')
        : (data.detail || 'Login failed')
      return false
    }
    // Optionally fetch user after login
    await fetchUser()
    return true
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message || 'Network error'
    } else {
      error.value = 'Network error'
    }
    return false
  } finally {
    loading.value = false
  }
}

const register = async (form: { email: string, password: string, fname: string, lname: string, phone: string }) => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })
    const data = await response.json()
    if (!response.ok) {
      error.value = Array.isArray(data.detail)
        ? data.detail.map((e: unknown) => typeof e === 'object' && e && 'msg' in e ? (e as { msg: string }).msg : String(e)).join(', ')
        : (data.detail || 'Registration failed')
      return false
    }
    // Optionally fetch user after register
    await fetchUser()
    return true
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message || 'Network error'
    } else {
      error.value = 'Network error'
    }
    return false
  } finally {
    loading.value = false
  }
}

const fetchUser = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/user/me`, {
      method: 'GET',
      credentials: 'include',
    })
    if (response.status === 401 || response.status === 403) {
      user.value = null
      return null
    }
    if (!response.ok) throw new Error('Failed to fetch user data')
    user.value = await response.json()
    return user.value
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message || 'Network error'
    } else {
      error.value = 'Network error'
    }
    user.value = null
    return null
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  loading.value = true
  error.value = null
  try {
    await fetch(`${import.meta.env.VITE_BACKEND}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    user.value = null
  } catch {
    // Ignore errors
  } finally {
    loading.value = false
  }
}

export function useAuth() {
  return {
    user,
    loading,
    error,
    login,
    register,
    fetchUser,
    logout
  }
}
