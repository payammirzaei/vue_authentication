<template>
  <header class="bg-white/80 shadow flex items-center justify-between px-10 h-20 border-b">
    <h1 class="text-2xl font-extrabold text-blue-800 tracking-tight">Dashboard</h1>
    <div class="flex items-center space-x-6">
      <button class="relative p-2 rounded-full hover:bg-blue-100 transition">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        <span class="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
      </button>
      <div class="relative flex items-center space-x-3">
        <button @click="dropdownOpen = !dropdownOpen" @blur="dropdownOpen = false" class="flex items-center space-x-3 focus:outline-none">
          <img :src="avatarUrl" class="w-10 h-10 rounded-full border-2 border-blue-200 shadow" alt="User" />
          <span class="text-gray-700 font-semibold">{{ userName }}</span>
          <svg class="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <transition name="fade">
          <div v-if="dropdownOpen" class="absolute right-0 mt-14 w-48 bg-white rounded-lg shadow-lg border z-50">
            <a href="/profile" class="block px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-t-lg">Edit Profile</a>
            <button @mousedown.prevent="$emit('logout')" class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg">Logout</button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ userName: string, avatarUrl: string }>()
const dropdownOpen = ref(false)
</script>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
