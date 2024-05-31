import Cookies from 'js-cookie'
import store from '../store/store'
const TokenKey = 'H5_token_key'

/**
 * 从cookie中获得token
 */
export function getToken() {
  return Cookies.get(TokenKey) ? Cookies.get(TokenKey) : ''
}

/**
 * 设置cookie中的token
 */
export function setToken(token) {
  store.commit('user/SET_TOKEN', token)
  return Cookies.set(TokenKey, token)
}

/**
 * 删除cookie中的token
 */
export function removeToken() {
  // return sessionStorage.removeItem(TokenKey)
  store.commit('user/REMOVE_TOKEN')
  return Cookies.remove(TokenKey)
}
