<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <button
            @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="mt-1 text-sm text-red-700">{{ sanitizedError }}</p>
            </div>
          </div>
        </div>

        <!-- User Data Display -->
        <div v-else-if="userData" class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="sm:flex sm:items-center">
              <div class="sm:flex-auto">
                <h2 class="text-lg font-medium text-gray-900">Welcome back!</h2>
                <p class="mt-1 text-sm text-gray-600">Here's your profile information</p>
              </div>
            </div>
            
            <div class="mt-6 border-t border-gray-200">
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ sanitizedUserData.fullName }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ sanitizedUserData.email }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ sanitizedUserData.phone }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">User ID</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ sanitizedUserData.id }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1 text-sm sm:col-span-2 sm:mt-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="userData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ userData.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Session Status -->
        <div class="mt-6 bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Session Status</h3>
            <div class="space-y-2 text-sm">
              <p class="text-gray-600">
                Session expires: 
                <span class="font-medium text-gray-900">{{ sessionExpiry }}</span>
              </p>
              <p class="text-gray-600">
                Auto-refresh: Enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const userData = ref(null)
const loading = ref(true)
const error = ref(null)
const sessionExpiry = ref('--')
const refreshInterval = ref(null)
const tokenExpiry = ref(null)

const API_BASE_URL = 'http://localhost:8000'

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

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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
    
    const response = await authenticatedFetch(`${API_BASE_URL}/users/me`)
    
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
</script>