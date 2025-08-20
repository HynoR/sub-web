import axios from "axios"

axios.defaults.timeout = 5000 //请求超时的时间设定

export default {
  install(app) {
    app.config.globalProperties.$axios = axios
    app.provide('axios', axios)
  }
}

export { axios }