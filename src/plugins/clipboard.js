// Vue 3 clipboard functionality using native Clipboard API
export const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.error('Failed to copy: ', err)
      return false
    }
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'
    document.body.prepend(textArea)
    textArea.select()
    try {
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    } catch (error) {
      console.error('Fallback: Could not copy text: ', error)
      textArea.remove()
      return false
    }
  }
}

export default {
  install(app) {
    app.config.globalProperties.$copyText = copyToClipboard
    app.provide('copyText', copyToClipboard)
  }
}
