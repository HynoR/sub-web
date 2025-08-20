<template>
  <Teleport to="body">
    <div 
      v-if="visible"
      class="fixed top-4 right-4 z-50 max-w-sm mx-auto"
      :class="toastClasses"
    >
      <div class="flex items-center p-4 rounded-lg shadow-lg backdrop-blur-sm">
        <div class="flex-shrink-0">
          <component :is="iconComponent" class="w-5 h-5" />
        </div>
        <div class="ml-3 text-sm font-medium">
          {{ message }}
        </div>
        <button 
          @click="hide"
          class="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex rounded-lg focus:ring-2 hover:bg-white/10"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { h } from 'vue'

export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      visible: false,
      timer: null
    }
  },
  computed: {
    toastClasses() {
      const baseClasses = 'transform transition-all duration-300 ease-in-out'
      const typeClasses = {
        success: 'bg-green-500/90 text-white border border-green-400/50',
        error: 'bg-red-500/90 text-white border border-red-400/50',
        warning: 'bg-yellow-500/90 text-white border border-yellow-400/50',
        info: 'bg-blue-500/90 text-white border border-blue-400/50'
      }
      return `${baseClasses} ${typeClasses[this.type]}`
    },
    iconComponent() {
      const icons = {
        success: () => h('svg', {
          class: 'w-5 h-5',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        }, h('path', {
          'fill-rule': 'evenodd',
          d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
          'clip-rule': 'evenodd'
        })),
        error: () => h('svg', {
          class: 'w-5 h-5',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        }, h('path', {
          'fill-rule': 'evenodd',
          d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
          'clip-rule': 'evenodd'
        })),
        warning: () => h('svg', {
          class: 'w-5 h-5',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        }, h('path', {
          'fill-rule': 'evenodd',
          d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
          'clip-rule': 'evenodd'
        })),
        info: () => h('svg', {
          class: 'w-5 h-5',
          fill: 'currentColor',
          viewBox: '0 0 20 20'
        }, h('path', {
          'fill-rule': 'evenodd',
          d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
          'clip-rule': 'evenodd'
        }))
      }
      return icons[this.type]
    }
  },
  mounted() {
    this.show()
  },
  methods: {
    show() {
      this.visible = true
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.hide()
        }, this.duration)
      }
    },
    hide() {
      this.visible = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.$emit('close')
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>