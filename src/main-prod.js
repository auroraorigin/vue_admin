import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局样式
import './assets/css/global.css'
// 引入axios模块
import axios from 'axios'
// 引入加载进度条模块
import NProgress from 'nprogress'

Vue.config.productionTip = false

// 配置请求根路径
axios.defaults.baseURL = 'https://www.auroraorigin.top:8888/admin/'

// 发起axios请求
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 收到服务器回应
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
