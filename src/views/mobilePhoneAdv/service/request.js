import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/store'

const service = axios.create({
  timeout: 20000,
  baseURL: process.env.VUE_APP_ELITEVIPAPI_API,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    // window.console.log('请求参数', config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response) => {
    if (!response.data) {
      Toast({
        message: '系统繁忙,请稍后再试',
        forbidClick: true,
      })
      return
    }
    if (response.data.code !== 1) {
      if (response.data.code == -13) {
        if (store.getters.phoneType == 'IOS') {
          window.webkit.messageHandlers.tokenLose.postMessage('')
        } else {
          window.ws.logout()
        }
      } else {
        Toast({
          message: response.data.msg || response.data.message,
          forbidClick: true,
        })
      }
      return { data: response.data, code: response.data.code }
    } else {
      // window.console.log('响应结果', response.data)
      // window.console.log('响应结果--JSON.parse(data)===>', JSON.parse(response.data.data))
      return { data: JSON.parse(response.data.data), code: response.data.code }
    }
  },
  (error) => {
    console.log('err', error) // for debug
    if (error instanceof Error) {
      Toast({
        message: '系统繁忙 请稍后再试',
        forbidClick: true,
      })
    }
    return Promise.reject(error)
  }
)
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export const get = ({ url, ...config }) => {
  return service.get(url, config)
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {String} [type = passenger] [请求的baseUrl类型, 默认为乘客服务]
 */
export const post = ({ url, params = {}, op = '', ...config }) => {
  // 请求公参
  let storeUserInfo = store.state.userInfo
  let sysVersion = getQueryString('sysVersion')
  const commonParams = {
    // channel: storeUserInfo.channel ,
    // deviceId: storeUserInfo.deviceId,
    // op: op,
    // platform: storeUserInfo.platform,
    // softVersion: storeUserInfo.appVersion || '120',
    softVersion: "8.0.5", //暂时写死
    sysVersion: sysVersion || 'H5',
    // token: storeUserInfo.token || '',
    // data: null,
    // role: storeUserInfo.role || 1,
    // userId: storeUserInfo.userId,
    // orgType: storeUserInfo.orgType,
    // agencyNumber: storeUserInfo.agencyNumber,
    // idNumber: storeUserInfo.idNumber,
    // relationId: storeUserInfo.relationId,
    // positionIds: storeUserInfo.positionIds,
    // deptId: storeUserInfo.deptId,
    channel: '10600001',
    deviceId: getUUID(),
    platform: '3',
    token: '',
    data: null,
  }

  let data = {
    ...commonParams,
    data: JSON.stringify(params),
  }
  console.log(url,'11111111111111111111')
  return service.post(url, data, config)
}
/**
 * uploadFile方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} formData [请求时携带的参数]
 * @param {String} [type = passenger] [请求的baseUrl类型, 默认为乘客服务]
 */
export const uploadFile = ({ url, params, ...config }) => {
  return service.post(url, params, {
    headers: {
      'content-type': 'multipart/form-data',
    },
    ...config,
  })
}

function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let result = decodeURI(window.location.search.substr(1)).match(reg)
  return result ? unescape(result[2]) : null
}

/**
 * 生成并获取uuid（假设备号——缺点：不同浏览器打开都会生成新的）
 */
function getUUID() {
  let uuid = window.localStorage.getItem('uuid')
  if (!uuid) {
    let d = new Date().getTime()
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    window.localStorage.setItem('uuid', uuid)
  }
  return uuid
}
