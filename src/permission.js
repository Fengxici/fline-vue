import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// 进度条配置
NProgress.configure({ showSpinner: false })
const whiteList = [''] // 白名单
const defaultRoutePath = '/system'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  /* 路由发生变化修改页面title */
  if (to.meta.title) document.title = to.meta.title
  if (to.path === '/login') {
      next()
    } else {
      if (Vue.ls.get(ACCESS_TOKEN)) {
        next()
        // if(store.getters.roles.length === 0) {
        //   store.dispatch('GetInfo')
        //   .then( res => {
        //     const redirect = decodeURIComponent(from.query.redirect || to.path)
        //    // 跳转到目的路由
        //    next({ path: redirect })
        //   })
        //   .catch(err => {
        //     notification.error({
        //       message: '错误',
        //       description: '请求用户信息失败，请重试'
        //     })
        //     next({ path: '/login', query: { redirect: to.fullPath } })
        //   })
        // } else {
        //   next()
        // }
      } else {
        next({ path: '/login', query: {redirect: to.fullPath} }) //将跳转的路由path作为参数，登录成功后跳转到该路由
        NProgress.done() // finish progress bar
      }
    }
})
router.afterEach(() => {
  NProgress.done() // finish progress bar
})
