<template>
  <div class="bg-white shadow rounded-lg p-6 mt-8">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication (2FA)</h3>

    <div v-if="status === 'enabled'" class="mb-4">
      <p class="text-green-700 font-semibold mb-2">2FA is currently <span class="text-green-800">ENABLED</span> on your account.</p>
      <button @click="showDisable = true" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">Disable 2FA</button>
    </div>
    <div v-else class="mb-4">
      <p class="text-yellow-700 font-semibold mb-2">2FA is currently <span class="text-yellow-800">DISABLED</span> on your account.</p>
      <button
        @click="setup2FA"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
      >
        Set up 2FA
      </button>
    </div>

    <!-- Setup 2FA: Show QR and secret -->
    <div v-if="showSetup" class="mt-4">
      <div v-if="qrCode && secret">
        <p class="mb-2">Scan this QR code with your authenticator app, or enter the secret manually:</p>
        <img :src="qrCode" alt="2FA QR Code" class="mb-2 w-40 h-40 border" />
        <p class="mb-2"><span class="font-semibold">Secret:</span> <span class="font-mono text-sm bg-gray-100 p-1 rounded">{{ secret }}</span></p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Enter the 6-digit code from your authenticator app:</label>
          <input v-model="setupCode" type="text" placeholder="123456" class="form-input w-32 text-center text-lg tracking-widest" maxlength="6" />
        </div>
        <button @click="enable2FA" :disabled="loading || !setupCode" class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium">Enable 2FA</button>
        <button @click="cancelSetup" class="ml-2 text-gray-500 hover:text-gray-700">Cancel</button>
      </div>
      <div v-else class="text-gray-500">Loading QR code...</div>
    </div>

    <!-- Disable 2FA: Input code -->
    <div v-if="showDisable" class="mt-4">
      <input v-model="disableCode" type="text" placeholder="Enter 2FA code to disable" class="form-input mb-2" />
      <button @click="disable2FA" :disabled="loading" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">Disable 2FA</button>
      <button @click="cancelDisable" class="ml-2 text-gray-500 hover:text-gray-700">Cancel</button>
    </div>

    <!-- 2FA Messages -->
    <div v-if="message" class="mt-2 p-2 rounded text-sm" :class="error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const status = ref('disabled') // 'enabled' or 'disabled'
const showSetup = ref(false)
const showDisable = ref(false)
const qrCode = ref('')
const secret = ref('')
const setupCode = ref('')
const disableCode = ref('')
const loading = ref(false)
const message = ref('')
const error = ref(false)

// Fetch user data to get real 2FA status
const fetchUserStatus = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      console.warn('No token found for fetching user status')
      return
    }

    const response = await fetch('http://localhost:8000/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    })

    if (response.ok) {
      const userData = await response.json()
      status.value = userData.is_2fa_enabled ? 'enabled' : 'disabled'
    }
  } catch (e) {
    console.error('Failed to fetch user status:', e)
  }
}

// Fetch status on component mount
onMounted(() => {
  fetchUserStatus()
})

const setup2FA = async () => {
  loading.value = true
  message.value = ''
  error.value = false
  try {
    // Get JWT token from localStorage
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch('http://localhost:8000/users/2fa/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to get 2FA setup info')
    const data = await response.json()
    qrCode.value = data.qr_code
    secret.value = data.secret
    showSetup.value = true
  } catch {
    message.value = 'Could not start 2FA setup.'
    error.value = true
  } finally {
    loading.value = false
  }
}

const enable2FA = async () => {
  loading.value = true
  message.value = ''
  error.value = false
  try {
    // Get JWT token from localStorage
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch('http://localhost:8000/users/2fa/enable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ code: setupCode.value })
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail ? (Array.isArray(data.detail) ? data.detail.map((e)=>e.msg).join(', ') : data.detail) : 'Failed to enable 2FA')
    }
    message.value = '2FA enabled successfully!'
    error.value = false
    status.value = 'enabled'
    showSetup.value = false
    setupCode.value = ''
  } catch (e) {
    message.value = e.message || 'Failed to enable 2FA.'
    error.value = true
  } finally {
    loading.value = false
  }
}

const disable2FA = async () => {
  loading.value = true
  message.value = ''
  error.value = false
  try {
    // Get JWT token from localStorage
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch('http://localhost:8000/users/2fa/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ code: disableCode.value })
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail ? (Array.isArray(data.detail) ? data.detail.map((e)=>e.msg).join(', ') : data.detail) : 'Failed to disable 2FA')
    }
    message.value = '2FA disabled successfully!'
    error.value = false
    status.value = 'disabled'
    showDisable.value = false
    disableCode.value = ''
  } catch (e) {
    message.value = e.message || 'Failed to disable 2FA.'
    error.value = true
  } finally {
    loading.value = false
  }
}

const cancelSetup = () => {
  showSetup.value = false
  qrCode.value = ''
  secret.value = ''
  setupCode.value = ''
}
const cancelDisable = () => {
  showDisable.value = false
  disableCode.value = ''
}
</script>
