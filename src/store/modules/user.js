// import { userLogin, getInfo, userLogout } from '@/api/system/user'
import { getToken, setToken, removeToken } from '@/utils/token'
import {customerDetail} from '@/api/home'
import { login, bindaccount, getlogininfo } from '@/api/login'
const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}, // 用户信息
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USERINFO: (state,info) => {
    state.userInfo = info
  },
  SET_TOKEN: (state,token) => {
    state.token= token
  },
  REMOVE_TOKEN:(state,token) => {
    state.token= ''
  }

}

const actions = {
  // 获取用户详细信息
  getUserInfo({ commit },data){
    return new Promise((resolve, reject) => {
      customerDetail().then(response => {
        const { data } = response
        if (response.flag == 1) {
          commit('SET_USERINFO', data)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

