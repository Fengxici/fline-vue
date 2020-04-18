import Vue from 'vue'
import Router from 'vue-router'
import api from '../constants/api'
Vue.use(Router)
Vue.prototype.Api = api
//此Router是自己自定义引入暴露出来的，即是自定义的，以下的Router同样是这样
// 解决两次访问相同路由地址报错
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
export default new Router({
  mode: "history",
  base: '/item/page/',
  routes: [
    {
      path: '/',
      redirect: "/dashboard",
      name: 'layout',
      meta: {
        title: '首页',
      },
      component: () => import('@/layout/index'),
      children: [
        // dashboard
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('@/viewPage/Dashboard'),
          meta: {
            title: '欢迎'
          },
        },
        // 系统设置
        {
          path: '/system',
          name: 'system',
          redirect: "/roles",
          component: () => import('@/layout/RouteView'),
          meta: {
            title: '系统设置',
            permission: [ 'system' ]
          },
          children:[
            {
              path: '/roles',
              name: 'roles',
              component: () => import('@/viewPage/system/roles'),
              meta: {
                title: '角色管理',
                permission: [ 'roles' ]
              },
            },
            {
              path: '/permission',
              name: 'permission',
              component: () => import('@/viewPage/system/permission'),
              meta: {
                title: '菜单管理',
                permission: [ 'permission' ]
              },
            },
            {
              path: '/user',
              name: 'user',
              component: () => import('@/viewPage/system/user'),
              meta: {
                title: '用户管理',
                permission: [ 'user' ]
              },
            },
            {
              path: '/department',
              name: 'deptment',
              component: () => import('@/viewPage/system/department'),
              meta: {
                title: '部门管理',
                permission: [ 'department' ]
              },
            },
          ]
        },
        // 数据分析
        {
          path: '/data',
          name: 'data',
          component: () => import('@/viewPage/dataAnalysis/dataAnalysis'),
          meta: {
            title: '数据统计',
            permission: [ 'data' ]
          },
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '非线前端VUE模板项目',
      },
      component: () => import('@/viewPage/Login')
    },
  ]
})
