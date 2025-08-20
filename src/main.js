import { createApp } from 'vue'
import App from './App.vue'

// Import plugins
import clipboard from '@/plugins/clipboard'
import base64 from '@/plugins/base64'
import particles from '@/plugins/particles'
import axios from '@/plugins/axios'
import device from '@/plugins/device'
import toast from '@/plugins/toast'

// Import SVG icons and register them
import 'virtual:svg-icons-register'
import { SvgIcon } from '@/icons' // icon
import '@/assets/css/tailwind.css' // tailwind styles

// Import PWA service worker registration
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

app.use(clipboard)
app.use(base64)
app.use(particles)
app.use(axios)
app.use(device)
app.use(toast)

// Register SvgIcon globally
app.component('svg-icon', SvgIcon)

app.mount('#app')

// Register service worker with update prompt
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available; please refresh.')
    
    // Create a more user-friendly update notification
    const updateDiv = document.createElement('div')
    updateDiv.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: #1f2937; 
        color: white; 
        padding: 16px 20px; 
        border-radius: 8px; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 300px;
        border: 1px solid #374151;
      ">
        <div style="margin-bottom: 12px; font-weight: 500;">
          📱 应用更新可用
        </div>
        <div style="margin-bottom: 16px; font-size: 14px; color: #d1d5db;">
          发现新版本，点击更新以获得最新功能
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="sw-update-btn" style="
            background: #3b82f6; 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px;
          ">
            立即更新
          </button>
          <button id="sw-dismiss-btn" style="
            background: transparent; 
            color: #9ca3af; 
            border: 1px solid #4b5563; 
            padding: 8px 16px; 
            border-radius: 6px; 
            cursor: pointer; 
            font-size: 14px;
          ">
            稍后
          </button>
        </div>
      </div>
    `
    
    document.body.appendChild(updateDiv)
    
    document.getElementById('sw-update-btn').onclick = () => {
      updateSW(true)
      document.body.removeChild(updateDiv)
    }
    
    document.getElementById('sw-dismiss-btn').onclick = () => {
      document.body.removeChild(updateDiv)
    }
    
    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (document.body.contains(updateDiv)) {
        document.body.removeChild(updateDiv)
      }
    }, 30000)
  },
  onOfflineReady() {
    console.log('App ready for offline use.')
    
    // Show offline ready notification
    const offlineDiv = document.createElement('div')
    offlineDiv.innerHTML = `
      <div style="
        position: fixed; 
        bottom: 20px; 
        left: 20px; 
        background: #059669; 
        color: white; 
        padding: 12px 16px; 
        border-radius: 6px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
      ">
        🌐 应用已准备好离线使用
      </div>
    `
    
    document.body.appendChild(offlineDiv)
    
    setTimeout(() => {
      if (document.body.contains(offlineDiv)) {
        document.body.removeChild(offlineDiv)
      }
    }, 5000)
  },
  onRegistered() {
    console.log('Service worker has been registered.')
  },
  onRegisterError(error) {
    console.error('Error during service worker registration:', error)
  }
})
