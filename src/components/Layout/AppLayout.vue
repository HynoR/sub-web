<template>
  <div class="min-h-screen bg-dark-900 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      <!-- Logo/Header -->
      <div class="p-6 border-b border-dark-700">
        <h1 class="text-xl font-bold text-white flex items-center">
         <img src="@/assets/vg3.jpg" alt="Logo" class="w-8 h-8 mr-2" />
          Sub Converter
        </h1>
        <p class="text-sm text-gray-400 mt-1">订阅链接转换工具</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link 
          to="/" 
          class="sidebar-nav-item"
          :class="{ 'active': $route.path === '/' }"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
          订阅转换
        </router-link>
        
        <div class="sidebar-nav-item cursor-pointer" @click="scrollToSection('help')">
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
          </svg>
          使用帮助
        </div>
        
        <div class="sidebar-nav-item cursor-pointer" @click="goToProject">
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
          项目仓库
        </div>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-dark-700">
        <div class="text-xs text-gray-500 text-center">
          <p>Powered by Vue.js & Tailwind</p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen">
      <!-- Top Header -->
      <header class="bg-dark-800 border-b border-dark-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-white">订阅转换器</h2>
            <p class="text-sm text-gray-400">将订阅链接转换为各客户端配置格式</p>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-400">{{ getCurrentTime() }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  data() {
    return {
      currentTime: new Date().toLocaleTimeString()
    }
  },
  mounted() {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    getCurrentTime() {
      return this.currentTime
    },
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString()
    },
    goToProject() {
      window.open('https://github.com/tindy2013/subconverter', '_blank')
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>