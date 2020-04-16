import Vue from 'vue'
import VueRouter from 'vue-router'

// import login from '../components/login.vue'
// import home from '../components/home.vue'
// import welcome from '../components/welcome.vue'

// import admins from '../components/admins/admins.vue'
// import rights from '../components/power/rights.vue'
// import roles from '../components/power/roles.vue'

// import cate from '../components/goods/cate.vue'
// import goodsList from '../components/goods/list.vue'
// import add from '../components/goods/add.vue'

// import order from '../components/order/order.vue'

// import report from '../components/report/report.vue'

// import ads from '../components/ads/ads.vue'

// 路由懒加载
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

const admins = () => import(/* webpackChunkName: "admins_rights_roles" */ '../components/admins/admins.vue')
const rights = () => import(/* webpackChunkName: "admins_rights_roles" */ '../components/power/rights.vue')
const roles = () => import(/* webpackChunkName: "admins_rights_roles" */ '../components/power/roles.vue')

const cate = () => import(/* webpackChunkName: "cate_goodsList_add" */ '../components/goods/cate.vue')
const goodsList = () => import(/* webpackChunkName: "cate_goodsList_add" */ '../components/goods/list.vue')
const add = () => import(/* webpackChunkName: "cate_goodsList_add" */ '../components/goods/add.vue')

const order = () => import(/* webpackChunkName: "order_report_ads" */ '../components/order/order.vue')
const report = () => import(/* webpackChunkName: "order_report_ads" */ '../components/report/report.vue')
const ads = () => import(/* webpackChunkName: "order_report_ads" */ '../components/ads/ads.vue')

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
  },
  {
    path: '/ads',
    component: ads
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
