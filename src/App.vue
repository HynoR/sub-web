<template>
  <div id="app" class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <div class="flex items-center space-x-3">
          <img src="@/assets/vg6.webp" alt="Logo" class="w-8 h-8" />
          <div>
            <h1 class="app-title">Sub Converter</h1>
            <p class="app-subtitle">订阅链接转换工具</p>
          </div>
        </div>
        <div class="app-time">
          {{ getCurrentTime() }}
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8 max-w-7xl">
      <Subconverter/>
    </main>


  </div>
</template>

<script>
import Subconverter from '@/views/Subconverter.vue'

export default {
  name: 'App',
  components: {
    Subconverter
  },
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
