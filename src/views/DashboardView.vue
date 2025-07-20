<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
    <DashboardSidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <DashboardHeader :userName="userName" :avatarUrl="avatarUrl" @logout="logout" />
      <main class="flex-1 p-10 bg-gradient-to-br from-gray-50 to-blue-50">
        <!-- Dashboard cards and stats here -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <!-- Profile Card -->
          <div class="relative bg-white rounded-2xl shadow-xl p-8 col-span-1 overflow-hidden group hover:shadow-2xl transition">
            <div class="absolute left-0 top-0 h-full w-2 bg-blue-500 rounded-l-2xl group-hover:w-3 transition-all"></div>
            <h2 class="text-lg font-bold text-blue-700 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.607 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Profile
            </h2>
            <div v-if="loading" class="flex justify-center items-center h-32">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
              <p class="text-sm text-red-700">{{ sanitizedError }}</p>
            </div>
            <div v-else-if="userData">
              <dl class="divide-y divide-gray-200">
                <div class="py-2 flex justify-between">
                  <dt class="text-sm text-gray-500">Full Name</dt>
                  <dd class="text-sm text-gray-900 font-semibold">{{ sanitizedUserData.fullName }}</dd>
                </div>
                <div class="py-2 flex justify-between">
                  <dt class="text-sm text-gray-500">Email</dt>
                  <dd class="text-sm text-gray-900 font-semibold">{{ sanitizedUserData.email }}</dd>
                </div>
                <div class="py-2 flex justify-between">
                  <dt class="text-sm text-gray-500">Phone</dt>
                  <dd class="text-sm text-gray-900 font-semibold">{{ sanitizedUserData.phone }}</dd>
                </div>
                <div class="py-2 flex justify-between">
                  <dt class="text-sm text-gray-500">User ID</dt>
                  <dd class="text-sm text-gray-900 font-semibold">{{ sanitizedUserData.id }}</dd>
                </div>
                <div class="py-2 flex justify-between">
                  <dt class="text-sm text-gray-500">Status</dt>
                  <dd>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                          :class="userData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ userData.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Session Card -->
          <div class="relative bg-white rounded-2xl shadow-xl p-8 col-span-1 overflow-hidden group hover:shadow-2xl transition">
            <div class="absolute left-0 top-0 h-full w-2 bg-purple-500 rounded-l-2xl group-hover:w-3 transition-all"></div>
            <h2 class="text-lg font-bold text-purple-700 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Session
            </h2>
            <div class="space-y-2 text-sm">
              <p class="text-gray-600">
                Session expires:
                <span class="font-semibold text-gray-900">{{ sessionExpiry }}</span>
              </p>
              <p class="text-gray-600">
                Auto-refresh: <span class="text-green-700 font-semibold">Enabled</span>
              </p>
            </div>
          </div>

          <!-- 2FA Card -->
          <div class="relative bg-white rounded-2xl shadow-xl p-8 col-span-1 flex flex-col overflow-hidden group hover:shadow-2xl transition">
            <div class="absolute left-0 top-0 h-full w-2 bg-pink-500 rounded-l-2xl group-hover:w-3 transition-all"></div>
            <h2 class="text-lg font-bold text-pink-700 mb-4 flex items-center">
              <svg class="w-6 h-6 mr-2 text-pink-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6z"/></svg>
              2FA
            </h2>
            <TwoFAPanel class="flex-1" />
          </div>
        </div>

        <!-- Stats Section -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div class="bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg rounded-2xl p-6 flex items-center text-white relative overflow-hidden group">
            <div class="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-all">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m4 4v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6"/></svg>
            </div>
            <div class="flex-shrink-0 bg-white/20 rounded-full p-3 mr-4">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m4 4v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6"/></svg>
            </div>
            <div>
              <div class="text-3xl font-extrabold">12</div>
              <div class="text-sm font-medium">Logins this month</div>
            </div>
          </div>
          <div class="bg-gradient-to-r from-green-500 to-green-400 shadow-lg rounded-2xl p-6 flex items-center text-white relative overflow-hidden group">
            <div class="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-all">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="flex-shrink-0 bg-white/20 rounded-full p-3 mr-4">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <div class="text-3xl font-extrabold">98%</div>
              <div class="text-sm font-medium">2FA Success Rate</div>
            </div>
          </div>
          <div class="bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-lg rounded-2xl p-6 flex items-center text-yellow-900 relative overflow-hidden group">
            <div class="absolute right-4 top-4 opacity-20 group-hover:opacity-40 transition-all">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="flex-shrink-0 bg-white/20 rounded-full p-3 mr-4">
              <svg class="w-7 h-7 text-yellow-900" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div class="text-3xl font-extrabold">2 min ago</div>
              <div class="text-sm font-medium">Last activity</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TwoFAPanel from '@/components/TwoFAPanel.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'
import UserProfileView from '@/views/UserProfileView.vue'

const userData = ref(null)
const loading = ref(true)
const error = ref(null)
const sessionExpiry = ref('--')
const refreshInterval = ref(null)
const tokenExpiry = ref(null)

// 2FA Panel State
const twoFAStatus = ref('disabled')
const showSetup2FA = ref(false)
const showDisable2FA = ref(false)
const qrCode = ref('')
const secret = ref('')
const setupCode = ref('')
const disableCode = ref('')
const loading2FA = ref(false)
const twoFAMessage = ref('')
const twoFAError = ref(false)

// Sanitization function to prevent XSS
const sanitizeString = (str) => {
  if (!str) return 'Not provided'
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Validate and sanitize user data
const sanitizedUserData = computed(() => {
  if (!userData.value) return null

  return {
    fullName: sanitizeString(`${userData.value.fname || ''} ${userData.value.lname || ''}`),
    email: sanitizeString(userData.value.email),
    phone: sanitizeString(userData.value.phone),
    id: sanitizeString(String(userData.value.id))
  }
})

// Sanitize error messages
const sanitizedError = computed(() => {
  if (!error.value) return null
  return sanitizeString(error.value)
})

// Validate token format
const isValidToken = (token) => {
  if (!token || typeof token !== 'string') return false
  // Basic JWT format validation (header.payload.signature)
  const parts = token.split('.')
  return parts.length === 3 && parts.every(part => part.length > 0)
}

// Secure token storage using httpOnly cookies (simulation)
const getSecureToken = () => {
  // In production, tokens should be stored in httpOnly cookies
  // For this example, we'll simulate it with additional validation
  const token = localStorage.getItem('access_token')
  if (!isValidToken(token)) {
    console.warn('Invalid token format detected')
    return null
  }
  return token
}

// Check if user is authenticated
const checkAuth = () => {
  const token = getSecureToken()
  if (!token) {
    window.location.href = '/login'
    return false
  }
  return true
}

// Parse JWT token to get expiry (client-side only for UX, never trust client-side validation)
const parseTokenExpiry = (token) => {
  try {
    if (!isValidToken(token)) return null

    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp) {
      return new Date(payload.exp * 1000)
    }
  } catch (e) {
    console.warn('Could not parse token expiry')
  }
  return null
}

// Refresh access token using refresh token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!isValidToken(refreshToken)) {
      throw new Error('Invalid refresh token')
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for CSRF protection
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error('Failed to refresh session')
    }

    const data = await response.json()

    // Validate received tokens
    if (!isValidToken(data.access_token) || !isValidToken(data.refresh_token)) {
      throw new Error('Invalid tokens received')
    }

    // Update stored tokens
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    // Update token expiry
    tokenExpiry.value = parseTokenExpiry(data.access_token)
    updateSessionExpiry()

    return data.access_token
  } catch (err) {
    console.error('Token refresh failed:', err)
    logout()
    throw err
  }
}

// Update session expiry display
const updateSessionExpiry = () => {
  if (tokenExpiry.value) {
    sessionExpiry.value = tokenExpiry.value.toLocaleString()
  }
}

// Make authenticated API request with automatic token refresh
const authenticatedFetch = async (url, options = {}) => {
  let token = getSecureToken()
  if (!token) {
    throw new Error('No valid token available')
  }

  const makeRequest = async (accessToken) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies
    })
  }

  let response = await makeRequest(token)

  // If token is expired, refresh and retry once
  if (response.status === 401) {
    try {
      token = await refreshToken()
      response = await makeRequest(token)
    } catch (err) {
      throw new Error('Authentication failed')
    }
  }

  return response
}

// Validate API response
const validateUserData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user data received')
  }

  // Validate required fields
  if (!data.email || typeof data.email !== 'string') {
    throw new Error('Invalid email in user data')
  }

  if (data.id === undefined || data.id === null) {
    throw new Error('Invalid user ID in user data')
  }

  return true
}

// Fetch user data with validation
const fetchUserData = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await authenticatedFetch(`${import.meta.env.VITE_BACKEND}/users/me`)

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const data = await response.json()

    // Validate received data
    validateUserData(data)

    userData.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error fetching user data:', err)
  } finally {
    loading.value = false
  }
}

// Secure logout function
const logout = () => {
  // Clear all tokens
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')

  // Clear intervals
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }

  // Clear session data
  userData.value = null
  tokenExpiry.value = null

  // Redirect to login
  window.location.href = '/login'
}

// Setup automatic token refresh based on token expiry
const setupTokenRefresh = () => {
  const token = getSecureToken()
  if (!token) return

  tokenExpiry.value = parseTokenExpiry(token)
  updateSessionExpiry()

  // Clear any existing interval
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }

  // Set up refresh 5 minutes before expiry
  if (tokenExpiry.value) {
    const now = new Date()
    const timeUntilExpiry = tokenExpiry.value.getTime() - now.getTime()
    const refreshTime = Math.max(timeUntilExpiry - 300000, 60000) // 5 min before expiry, min 1 min

    refreshInterval.value = setTimeout(async () => {
      try {
        await refreshToken()
        setupTokenRefresh() // Reset the timer
      } catch (err) {
        console.error('Automatic token refresh failed:', err)
      }
    }, refreshTime)
  }
}

// 2FA Panel Methods
const setup2FA = async () => {
  loading2FA.value = true
  twoFAMessage.value = ''
  twoFAError.value = false
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/2fa/setup`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to get 2FA setup info')
    const data = await response.json()
    qrCode.value = data.qr_code
    secret.value = data.secret
    showSetup2FA.value = true
  } catch {
    twoFAMessage.value = 'Could not start 2FA setup.'
    twoFAError.value = true
  } finally {
    loading2FA.value = false
  }
}

const enable2FA = async () => {
  loading2FA.value = true
  twoFAMessage.value = ''
  twoFAError.value = false
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/2fa/enable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: setupCode.value })
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail ? (Array.isArray(data.detail) ? data.detail.map((e)=>e.msg).join(', ') : data.detail) : 'Failed to enable 2FA')
    }
    twoFAMessage.value = '2FA enabled successfully!'
    twoFAError.value = false
    twoFAStatus.value = 'enabled'
    showSetup2FA.value = false
    setupCode.value = ''
  } catch {
    twoFAMessage.value = 'Failed to enable 2FA.'
    twoFAError.value = true
  } finally {
    loading2FA.value = false
  }
}

const disable2FA = async () => {
  loading2FA.value = true
  twoFAMessage.value = ''
  twoFAError.value = false
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/2fa/disable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code: disableCode.value })
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail ? (Array.isArray(data.detail) ? data.detail.map((e)=>e.msg).join(', ') : data.detail) : 'Failed to disable 2FA')
    }
    twoFAMessage.value = '2FA disabled successfully!'
    twoFAError.value = false
    twoFAStatus.value = 'disabled'
    showDisable2FA.value = false
    disableCode.value = ''
  } catch {
    twoFAMessage.value = 'Failed to disable 2FA.'
    twoFAError.value = true
  } finally {
    loading2FA.value = false
  }
}

const cancelSetup2FA = () => {
  showSetup2FA.value = false
  qrCode.value = ''
  secret.value = ''
  setupCode.value = ''
}
const cancelDisable2FA = () => {
  showDisable2FA.value = false
  disableCode.value = ''
}

// Component lifecycle
onMounted(async () => {
  if (checkAuth()) {
    setupTokenRefresh()
    await fetchUserData()
  }
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})

const userName = computed(() => sanitizedUserData.value?.fullName || 'User')
const avatarUrl = computed(() => `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=2563eb&color=fff`)
</script>
