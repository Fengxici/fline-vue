import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { login, getInfo, logout } from '@/api/login'
const user = {
  state: {
    token: '',
    name: '',
    nickname:'',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },
  mutations:{
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_NICKNAEM:(state, nickname) => {
      state.nickname = nickname
    }
  },
  actions: {
   // 登录
   Login ({ commit }, userInfo) {
     return new Promise((resolve, reject) => {
       login(userInfo).then(response => {
         if(response.data) {
           const result = response.data;
           Vue.ls.set(ACCESS_TOKEN, result.password, 7 * 24 * 60 * 60 * 1000)
           commit('SET_TOKEN', result.password);
           commit('SET_ROLES', result.roleIds)
           commit('SET_INFO', result)
           commit('SET_NAME', result.name)
         }
         resolve(response)
       }).catch(error => {
         reject(error)
       })
     })
   },
   // 获取用户信息
   GetInfo ({ commit }) {
     return new Promise((resolve, reject) => {
       getInfo().then(response => {
         const res = response.result;
         commit('SET_ROLES', res.role)
         commit('SET_INFO', res)
         commit('SET_NAME', res.name)
         resolve(response)
       }).catch(error => {
         reject(error)
       })
     })
   },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
       commit('SET_TOKEN', '')
       commit('SET_ROLES', '')
       commit('SET_INFO', '')
       commit('SET_NAME', '')
       Vue.ls.remove(ACCESS_TOKEN)
       resolve();
      })
    }
  }

}
export default user
