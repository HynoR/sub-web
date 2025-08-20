import { createApp } from 'vue'
import Toast from '@/components/Toast.vue'

let toastContainer = null
let toastCount = 0

const createToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2'
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

const showToast = (message, type = 'info', duration = 3000) => {
  const container = createToastContainer()
  const toastId = `toast-${++toastCount}`
  
  // Create a wrapper div for this specific toast
  const toastWrapper = document.createElement('div')
  toastWrapper.id = toastId
  container.appendChild(toastWrapper)
  
  // Create the toast component
  const toastApp = createApp(Toast, {
    message,
    type,
    duration,
    onClose: () => {
      toastApp.unmount()
      if (toastWrapper && toastWrapper.parentNode) {
        toastWrapper.parentNode.removeChild(toastWrapper)
      }
      
      // Clean up container if no toasts left
      if (container.children.length === 0 && container.parentNode) {
        container.parentNode.removeChild(container)
        toastContainer = null
      }
    }
  })
  
  toastApp.mount(toastWrapper)
}

const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration)
}

export default {
  install(app) {
    app.config.globalProperties.$message = toast
  }
}

export { toast }