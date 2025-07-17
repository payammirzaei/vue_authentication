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
              <p class="mt-1 text-sm text-red-700">{{ error }}</p>
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
                    {{ userData.fname }} {{ userData.lname }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ userData.email }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">Phone</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ userData.phone || 'Not provided' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500">User ID</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {{ userData.id }}
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

        <!-- Token Status -->
        <div class="mt-6 bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Token Status</h3>
            <div class="space-y-2 text-sm">
              <p class="text-gray-600">
                Last token refresh: 
                <span class="font-medium text-gray-900">{{ lastRefresh || 'Never' }}</span>
              </p>
              <p class="text-gray-600">
                Token will be refreshed automatically when needed
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const userData = ref(null)
const loading = ref(true)
const error = ref(null)
const lastRefresh = ref(null)
const refreshInterval = ref(null)

const API_BASE_URL = 'http://localhost:8000'

// Check if user is authenticated
const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    window.location.href = '/login'
    return false
  }
  return true
}

// Refresh access token using refresh token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token found')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    
    // Update stored tokens
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    
    lastRefresh.value = new Date().toLocaleString()
    
    return data.access_token
  } catch (err) {
    console.error('Token refresh failed:', err)
    logout()
    throw err
  }
}

// Make authenticated API request with automatic token refresh
const authenticatedFetch = async (url, options = {}) => {
  let token = localStorage.getItem('access_token')
  
  const makeRequest = async (accessToken) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
  }

  let response = await makeRequest(token)
  
  // If token is expired, refresh and retry
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

// Fetch user data
const fetchUserData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await authenticatedFetch(`${API_BASE_URL}/users/me`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    const data = await response.json()
    userData.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error fetching user data:', err)
  } finally {
    loading.value = false
  }
}

// Logout function
const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}

// Setup automatic token refresh (every 25 minutes)
const setupTokenRefresh = () => {
  // Clear any existing interval
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
  
  // Set up new interval (25 minutes = 1500000ms)
  refreshInterval.value = setInterval(async () => {
    try {
      await refreshToken()
      console.log('Token refreshed automatically')
    } catch (err) {
      console.error('Automatic token refresh failed:', err)
    }
  }, 1500000) // 25 minutes
}

// Component lifecycle
onMounted(async () => {
  if (checkAuth()) {
    await fetchUserData()
    setupTokenRefresh()
  }
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>