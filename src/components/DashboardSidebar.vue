<template>
  <aside class="w-64 bg-white/90 border-r flex flex-col justify-between shadow-xl">
    <div>
      <div class="flex items-center h-20 px-6 border-b">
        <img src="https://ui-avatars.com/api/?name=Magic+App&background=2563eb&color=fff" class="w-10 h-10 rounded-full mr-3 shadow" alt="Logo" />
        <span class="text-2xl font-bold text-blue-700 tracking-tight">MagicApp</span>
      </div>
      <nav class="mt-8">
        <ul class="space-y-1">
          <li>
            <a href="/dashboard" class="flex items-center px-6 py-3 text-blue-700 font-semibold bg-blue-100 rounded-lg transition hover:bg-blue-200 group">
              <svg class="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-700 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0v6m0 0H7m6 0h6"/></svg>
              Dashboard
            </a>
          </li>
          <li>
            <a href="/profile" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition group">
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.607 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Profile
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition group">
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Activity
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition group">
              <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="p-6 border-t">
      <slot name="logout"></slot>
    </div>
  </aside>
</template>
