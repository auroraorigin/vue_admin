import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element模块
import './plugins/element.js'
// 引入全局样式
import './assets/css/global.css'
// 引入字体图标样式
import './assets/fonts/iconfont.css'
// 引入axios模块
import axios from 'axios'
// 引入加载进度条模块
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/admin/'

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
