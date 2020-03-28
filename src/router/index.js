import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import admins from '../components/admins/admins.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/cate.vue'
import goodsList from '../components/goods/list.vue'
import add from '../components/goods/add.vue'
import order from '../components/order/order.vue'
import report from '../components/report/report.vue'

Vue.use(VueRouter)

// 配置模块路由路径
const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: login
},
{
  path: '/home',
  component: home,
  redirect: 'welcome',
  children: [{
    path: '/welcome',
    component: welcome
  }, {
    path: '/admins',
    component: admins
  }, {
    path: '/rights',
    component: rights
  }, {
    path: '/roles',
    component: roles
  }, {
    path: '/categories',
    component: cate
  },
  {
    path: '/goods',
    component: goodsList
  },
  {
    path: '/goods/add',
    component: add
  },
  {
    path: '/orders',
    component: order
  },
  {
    path: '/reports',
    component: report
  }
  ]
}
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
