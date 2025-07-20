<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
    <DashboardSidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <DashboardHeader :userName="userName" :avatarUrl="avatarUrl" @logout="logout" />
      <main class="flex-1 p-10 bg-gradient-to-br from-gray-50 to-blue-50">
        <div class="max-w-xl mx-auto bg-white shadow rounded-lg p-8 mt-12">
          <h2 class="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h2>

          <form @submit.prevent="updateProfile" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input v-model="user.fname" type="text" class="form-input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input v-model="user.lname" type="text" class="form-input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input v-model="user.phone" type="text" class="form-input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="user.email" type="email" class="form-input w-full" required />
            </div>
            <div class="flex space-x-3 pt-4">
              <button type="submit" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:bg-gray-400">
                <span v-if="loading">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
              <button type="button" @click="resetForm" :disabled="loading" class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium">Cancel</button>
            </div>
          </form>

          <div v-if="message" class="mt-4 p-2 rounded text-sm" :class="error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
            {{ message }}
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'

// --- Existing profile logic ---
import { reactive, onMounted } from 'vue'

interface UserProfile {
  fname: string
  lname: string
  phone: string
  email: string
  is_2fa_enabled: boolean
}

function isErrorWithMessage(e: unknown): e is { message: string } {
  return typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message: unknown }).message === 'string';
}

const user = reactive<UserProfile>({
  fname: '',
  lname: '',
  phone: '',
  email: '',
  is_2fa_enabled: false,
})
const originalUser = ref<UserProfile | null>(null)
const loading = ref(false)
const message = ref('')
const error = ref(false)

const fetchUser = async () => {
  loading.value = true
  message.value = ''
  error.value = false
  try {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('No authentication token found')
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch user data')
    const data = await response.json()
    user.fname = data.fname || ''
    user.lname = data.lname || ''
    user.phone = data.phone || ''
    user.email = data.email || ''
    user.is_2fa_enabled = !!data.is_2fa_enabled
    originalUser.value = { ...user }
  } catch (e: unknown) {
    if (isErrorWithMessage(e)) {
      message.value = e.message
    } else {
      message.value = 'Failed to fetch user data.'
    }
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUser()
})

const updateProfile = async () => {
  loading.value = true
  message.value = ''
  error.value = false
  try {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('No authentication token found')
    const response = await fetch(`${import.meta.env.VITE_BACKEND}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(user)
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.detail ? (Array.isArray(data.detail) ? data.detail.map((e: { msg: string })=>e.msg).join(', ') : data.detail) : 'Failed to update profile')
    }
    message.value = 'Profile updated successfully!'
    error.value = false
    originalUser.value = { ...user }
  } catch (e: unknown) {
    if (isErrorWithMessage(e)) {
      message.value = e.message
    } else {
      message.value = 'Failed to update profile.'
    }
    error.value = true
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (originalUser.value) {
    user.fname = originalUser.value.fname
    user.lname = originalUser.value.lname
    user.phone = originalUser.value.phone
    user.email = originalUser.value.email
    user.is_2fa_enabled = originalUser.value.is_2fa_enabled
    message.value = ''
    error.value = false
  }
}

const userName = computed(() => `${user.fname} ${user.lname}`.trim() || 'User')
const avatarUrl = computed(() => `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=2563eb&color=fff`)

function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.href = '/login'
}
</script>
