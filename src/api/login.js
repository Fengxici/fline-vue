import { axios } from '@/utils/request'
import api from '@/constants/api'
export function login (parameter) {
  return axios({
    url: api.LOGIN_URL,
    method: 'post',
    data: parameter
  })
}
export function getInfo () {
  return axios({
    url: api.getInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function logout () {
  return axios({
    url: api.LOGOUT_URL,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
