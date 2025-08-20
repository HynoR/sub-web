import btoa from 'btoa'
import atob from 'atob'

export default {
  install(app) {
    app.config.globalProperties.$btoa = (string) => btoa(string)
    app.config.globalProperties.$atob = (string) => atob(string)
  }
}
