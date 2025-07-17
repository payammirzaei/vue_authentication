<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Floating Background Shapes -->
    <div class="floating-shapes">
      <div class="shape" v-for="n in 6" :key="n"></div>
    </div>
    
    <div class="w-full max-w-md relative overflow-hidden bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-3xl shadow-2xl p-8 card-entrance">
      <!-- Decorative Top Border -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"></div>
      
      <!-- Success Message -->
      <Transition name="slide-down">
        <div v-if="showSuccess" class="mb-6 p-4 rounded-xl bg-green-500 bg-opacity-20 border border-green-400 text-green-100 success-bounce">
          <div class="flex items-center">
            <CheckCircleIcon class="w-5 h-5 mr-2" />
            {{ successMessage }}
          </div>
        </div>
      </Transition>
      
      <!-- Error Messages -->
      <Transition name="slide-down">
        <div v-if="errors.length > 0" class="mb-6 p-4 rounded-xl bg-red-500 bg-opacity-20 border border-red-400 text-red-100 error-shake">
          <div class="flex items-center mb-2">
            <ExclamationTriangleIcon class="w-5 h-5 mr-2" />
            <span class="font-semibold">Error</span>
          </div>
          <ul class="list-disc list-inside text-sm">
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </Transition>
      
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-block p-4 rounded-2xl bg-white bg-opacity-10 mb-4 pulse-glow">
          <LockClosedIcon class="w-8 h-8 text-gray-800" />
        </div>
        <h1 class="text-3xl font-bold text-gray-500 mb-2 ">
          {{ getTitle() }}
        </h1>
        <p class="text-gray-800">{{ getSubtitle() }}</p>
      </div>
      
      <!-- Form Content -->
      <Transition name="slide-fade" mode="out-in">
        <!-- Login Form -->
        <form v-if="currentView === 'login'" @submit.prevent="handleLogin" key="login">
          <div class="space-y-6">
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Email</label>
              <input 
                v-model="loginForm.email" 
                type="email" 
                required 
                class="form-input"
                placeholder="Enter your email"
              />
            </div>
            
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="loginForm.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required 
                  class="form-input pr-12"
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <EyeIcon v-if="showPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">2FA Code (if enabled)</label>
              <input 
                v-model="loginForm.two_fa_code"
                type="text"
                class="form-input"
                placeholder="Enter your 2FA code"
              />
            </div>

<div class="flex items-center justify-between">
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="rememberMe" 
                  class="rounded border-gray-600 text-purple-600 focus:ring-purple-700 bg-gray-700"
                />
                <span class="ml-2 text-sm text-gray-500">Remember me</span>
              </label>
              <button 
                type="button" 
                @click="currentView = 'forgot'"
                class="text-sm text-purple-500 hover:text-purple-100 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              :disabled="loading"
              class="submit-button"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign In</span>
            </button>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-gray-500">
              Don't have an account? 
              <button 
                type="button" 
                @click="currentView = 'register'"
                class="text-purple-600 hover:text-purple-100 font-semibold transition-colors duration-200"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
        
        <!-- Register Form -->
        <form v-else-if="currentView === 'register'" @submit.prevent="handleRegister" key="register">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="input-group">
                <label class="block text-sm font-medium text-white mb-2">First Name</label>
                <input 
                  v-model="registerForm.fname" 
                  type="text" 
                  required 
                  class="form-input"
                  placeholder="John"
                />
              </div>
              <div class="input-group">
                <label class="block text-sm font-medium text-white mb-2">Last Name</label>
                <input 
                  v-model="registerForm.lname" 
                  type="text" 
                  required 
                  class="form-input"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Email</label>
              <input 
                v-model="registerForm.email" 
                type="email" 
                required 
                class="form-input"
                placeholder="john@example.com"
              />
            </div>
            
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Phone</label>
              <input 
                v-model="registerForm.phone" 
                type="tel" 
                required 
                class="form-input"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="registerForm.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required 
                  class="form-input pr-12"
                  placeholder="Create a strong password"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <EyeIcon v-if="showPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <div class="relative">
                <input 
                  v-model="confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  required 
                  class="form-input pr-12"
                  placeholder="Confirm your password"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <EyeIcon v-if="showConfirmPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div class="flex items-center">
              <input 
                id="terms" 
                type="checkbox" 
                v-model="acceptTerms" 
                required 
                class="rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-gray-700"
              />
              <label for="terms" class="ml-2 text-sm text-gray-300">
                I agree to the <a href="#" class="text-purple-300 hover:text-purple-100">Terms of Service</a> and <a href="#" class="text-purple-300 hover:text-purple-100">Privacy Policy</a>
              </label>
            </div>
            
            <button 
              type="submit" 
              :disabled="loading"
              class="submit-button"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
              <span v-else>Create Account</span>
            </button>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-gray-500">
              Already have an account? 
              <button 
                type="button" 
                @click="currentView = 'login'"
                class="text-purple-600 hover:text-purple-100 font-semibold transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
        
        <!-- Forgot Password Form -->
        <form v-else-if="currentView === 'forgot'" @submit.prevent="handleForgotPassword" key="forgot">
          <div class="space-y-6">
            <div class="input-group">
              <label class="block text-sm font-medium text-white mb-2">Email</label>
              <input 
                v-model="forgotForm.email" 
                type="email" 
                required 
                class="form-input"
                placeholder="Enter your email address"
              />
            </div>
            
            <button 
              type="submit" 
              :disabled="loading"
              class="submit-button"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
              <span v-else>Send Reset Link</span>
            </button>
          </div>
          
          <div class="mt-6 text-center">
            <p class="text-gray-500">
              Remember your password? 
              <button 
                type="button" 
                @click="currentView = 'login'"
                class="text-purple-600 hover:text-purple-100 font-semibold transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

// Types
interface LoginForm {
  email: string
  password: string
  two_fa_code?: string
}

interface RegisterForm {
  email: string
  password: string
  fname: string
  lname: string
  phone: string
}

interface ForgotForm {
  email: string
}

interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

interface ErrorResponse {
  detail: Array<{
    loc: string[]
    msg: string
    type: string
  }> | string
}

type ViewType = 'login' | 'register' | 'forgot'

// Reactive state
const currentView = ref<ViewType>('login')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)
const acceptTerms = ref(false)
const confirmPassword = ref('')
const errors = ref<string[]>([])
const showSuccess = ref(false)
const successMessage = ref('')

const loginForm = reactive<LoginForm>({
  email: '',
  password: '',
  two_fa_code: ''
})

const registerForm = reactive<RegisterForm>({
  email: '',
  password: '',
  fname: '',
  lname: '',
  phone: ''
})

const forgotForm = reactive<ForgotForm>({
  email: ''
})

// Computed properties
const getTitle = (): string => {
  switch (currentView.value) {
    case 'login': return 'Welcome Back'
    case 'register': return 'Create Account'
    case 'forgot': return 'Reset Password'
    default: return 'Authentication'
  }
}

const getSubtitle = (): string => {
  switch (currentView.value) {
    case 'login': return 'Sign in to your account'
    case 'register': return 'Join us today'
    case 'forgot': return 'We\'ll send you a reset link'
    default: return ''
  }
}

// Methods
const clearMessages = (): void => {
  errors.value = []
  showSuccess.value = false
}

const showError = (message: string): void => {
  errors.value = [message]
  setTimeout(() => {
    errors.value = []
  }, 5000)
}

const showSuccessMessage = (message: string): void => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 5000)
}

const validateForm = (): boolean => {
  clearMessages()
  
  if (currentView.value === 'register') {
    if (registerForm.password !== confirmPassword.value) {
      showError('Passwords do not match')
      return false
    }
    if (registerForm.password.length < 6) {
      showError('Password must be at least 6 characters long')
      return false
    }
    if (!acceptTerms.value) {
      showError('You must accept the terms and conditions')
      return false
    }
  }
  
  return true
}

const handleLogin = async (): Promise<void> => {
  if (!validateForm()) return
  
  loading.value = true
  clearMessages()
  
  try {
    const response = await fetch('http://localhost:8000/auth/login-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginForm.email,
        password: loginForm.password,
        two_fa_code: loginForm.two_fa_code || null
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      const authData = data as AuthResponse
      showSuccessMessage('Login successful! Redirecting...')
      
      // Store tokens
      localStorage.setItem('access_token', authData.access_token)
      localStorage.setItem('refresh_token', authData.refresh_token)
      
      // Redirect to dashboard
      setTimeout(() => {
        console.log('Redirecting to dashboard...')
         window.location.href = '/dashboard'
      }, 2000)
    } else {
      const errorData = data as ErrorResponse
      if (errorData.detail) {
        errors.value = Array.isArray(errorData.detail) 
          ? errorData.detail.map(err => err.msg) 
          : [errorData.detail as string]
      } else {
        showError('Login failed. Please check your credentials.')
      }
    }
  } catch (error) {
    showError('Network error. Please try again.')
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleRegister = async (): Promise<void> => {
  if (!validateForm()) return
  
  loading.value = true
  clearMessages()
  
  try {
    const response = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: registerForm.email,
        password: registerForm.password,
        fname: registerForm.fname,
        lname: registerForm.lname,
        phone: registerForm.phone
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      const authData = data as AuthResponse
      showSuccessMessage('Account created successfully! Please sign in.')
      
      // Store tokens
      localStorage.setItem('access_token', authData.access_token)
      localStorage.setItem('refresh_token', authData.refresh_token)
      
      // Reset form
      Object.assign(registerForm, {
        email: '',
        password: '',
        fname: '',
        lname: '',
        phone: ''
      })
      confirmPassword.value = ''
      acceptTerms.value = false
      
      // Switch to login after delay
      setTimeout(() => {
        currentView.value = 'login'
      }, 2000)
    } else {
      const errorData = data as ErrorResponse
      if (errorData.detail) {
        errors.value = Array.isArray(errorData.detail) 
          ? errorData.detail.map(err => err.msg) 
          : [errorData.detail as string]
      } else {
        showError('Registration failed. Please try again.')
      }
    }
  } catch (error) {
    showError('Network error. Please try again.')
    console.error('Registration error:', error)
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async (): Promise<void> => {
  if (!validateForm()) return
  
  loading.value = true
  clearMessages()
  
  try {
    const response = await fetch('http://localhost:8000/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: forgotForm.email
      })
    })
    
    if (response.ok) {
      showSuccessMessage('Password reset link sent to your email!')
      forgotForm.email = ''
      
      setTimeout(() => {
        currentView.value = 'login'
      }, 3000)
    } else {
      const data = await response.json()
      const errorData = data as ErrorResponse
      if (errorData.detail) {
        errors.value = Array.isArray(errorData.detail) 
          ? errorData.detail.map(err => err.msg) 
          : [errorData.detail as string]
      } else {
        showError('Failed to send reset link. Please try again.')
      }
    }
  } catch (error) {
    showError('Network error. Please try again.')
    console.error('Forgot password error:', error)
  } finally {
    loading.value = false
  }
}

// Watchers
watch(currentView, () => {
  clearMessages()
  showPassword.value = false
  showConfirmPassword.value = false
  document.title = getTitle() // Dynamically update the document title
})

// Lifecycle
onMounted(() => {
  // Smooth entrance animation without continuous blinking
  const card = document.querySelector('.card-entrance')
  if (card) {
    (card as HTMLElement).style.opacity = '0'
    ;(card as HTMLElement).style.transform = 'translateY(20px)'
    setTimeout(() => {
      (card as HTMLElement).style.transition = 'all 0.6s ease-out'
      ;(card as HTMLElement).style.opacity = '1'
      ;(card as HTMLElement).style.transform = 'translateY(0)'
    }, 100)
  }
  document.title = getTitle() // Set the title on mount
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Floating background shapes */
.floating-shapes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
  animation: float 25s infinite linear;
}

.shape:nth-child(1) {
  width: 80px; height: 80px; top: 20%; left: 10%; animation-delay: 0s;
}
.shape:nth-child(2) {
  width: 60px; height: 60px; top: 60%; right: 15%; animation-delay: 5s;
}
.shape:nth-child(3) {
  width: 100px; height: 100px; bottom: 20%; left: 20%; animation-delay: 10s;
}
.shape:nth-child(4) {
  width: 50px; height: 50px; top: 30%; right: 30%; animation-delay: 15s;
}
.shape:nth-child(5) {
  width: 70px; height: 70px; bottom: 40%; right: 10%; animation-delay: 20s;
}
.shape:nth-child(6) {
  width: 90px; height: 90px; top: 70%; left: 40%; animation-delay: 8s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
    opacity: 0.7;
  }
  66% {
    transform: translateY(-15px) rotate(240deg);
    opacity: 0.5;
  }
}

/* Form styling */

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.9); /* brighter background */
  color: #1f2937; /* dark gray text */
  border: 2px solid rgba(147, 51, 234, 0.6); /* purple border */
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}


.form-input::placeholder {
  color: #4b5563; /* slate-600 */
}

.form-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(147, 51, 234, 1);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.submit-button {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #9333ea, #3b82f6);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button:hover {
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  box-shadow: 0 8px 25px rgba(147, 51, 234, 0.4);
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.submit-button:disabled:hover {
  transform: none;
  box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
}

/* Input group animation */
.input-group {
  position: relative;
}

.input-group:focus-within label {
  color: rgba(147, 51, 234, 1);
  transform: scale(0.95);
}

/* Title gradient */
.title-gradient {
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Pulse glow animation - refined */
.pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
    transform: scale(1.05);
  }
}

/* Transitions */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.4s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.3s ease-in;
}

.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* Error and success animations */
.error-shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.success-bounce {
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Card entrance animation */
.card-entrance {
  position: relative;
  z-index: 10;
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .card-entrance {
    margin: 16px;
    padding: 24px;
  }
}
</style>