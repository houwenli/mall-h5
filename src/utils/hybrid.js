/**
 * @Description: 嵌入App,加密免登陆凭证
 * @Author: ChenFeng
 * @Date: 2020-07-18 17:01:02
 * @LastEditTime: 2019-06-05 16:09:00
 * @LastEditors: ChenFeng
 */
// 引入md5
import md5 from 'js-md5'
import { noAuthLogin, unAuthLoginV1, unAuthLoginSmart } from '../api/login'
import { setToken, removeToken } from '@/utils/token'
import Cookies from 'js-cookie'
import { Toast } from 'vant'
import store from '../store/store'
import { customerDetail } from '@/api/home'
import { selectOneByCondition, selectOneDriverByCondition  } from '@/api/personalinfo'
import { app } from '@/main'
import wx from 'weixin-js-sdk'
import { USER_SOURCE, CHANNEL_CODE, SYSPLATFORM } from '../constants/userinfo'
/**
 * @method 加密手机号
 * @param { Number } phone 手机号
 * @return { Object } 提交的完整数据类型
 */
function sign({ phoneNo, userSource }) {
  const timeStamp = Date.now()
  const key = getRandomNumberByRange(10, 99)
  const md532 = md5(`${timeStamp}@#fd*sa%fagfdgv43532ju76jM${phoneNo}${key}`)
  return {
    phoneNo,
    timeStamp,
    userSource,
    sign: `ws${md532}${key}`,
  }
}

/**
 * @method 获取随机 start ~ end 的整数
 * @param {int} start 开始整数
 * @param {int} end 结束整数
 * @return {int} 随机值
 */
function getRandomNumberByRange(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

/**
 * @method 识别channel 渠道值判别用户类型
 * android乘客：1010
 * android司机：2010
 * ios乘客：1050
 * ios司机：2050
 *
 */
export const discernmentChannel = function(channel) {
  let typeCode = `${channel}`.substring(0, 4)
  let userSource
  switch (typeCode) {
    case 1010:
      userSource = 1
      break
    case 2010:
      userSource = 2
      break
    case 1050:
      userSource = 1
      break
    case 2050:
      userSource = 2
      break
    default:
      userSource = 0
      break
  }
  return userSource
}
/**
 * 请求app的方法
 * @param {string} name 方法名称
 * @param {string|object} data 数据
 * @param {string} callBackName? 回调函数名称 可选
 */
export const call = function(name, data, callBackName) {
  let platform = getPlatform()
  console.log(name, data)
  // android
  // eslint-disable-next-line eqeqeq
  if (platform == SYSPLATFORM.android) {
    return androidCall(name, data, callBackName)
    // eslint-disable-next-line eqeqeq
  } else if (platform == SYSPLATFORM.ios) {
    // ios
    return iosCall(name, data, callBackName)
  }
  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject()
}

/**
 *  @method iOS 通过Iframe 发送请求并拦截输出获取参数
 */
function addIOSIframe() {
  let WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'https://__bridge_loaded__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe)
  })
}

/**
 * 请求messageHandlers方法取参
 */
function userInfoBack(action) {
  let { userPhone = '', role, platform, channel, token } = action
  let channelCode = transChannel(channel)
  Cookies.set('_wsf_channel_code', channelCode)
  if (token) {
    unAuthLoginForToken(action)
  }
}

window.userInfoBack = userInfoBack

/**
 * 请求iphone app的方法
 * @param {string} method 方法名称
 * @param {any} data 请求的数据
 */
function iosCall(name, data, callBackName) {
  return new Promise((resolve, reject) => {
    /**
     * 万顺云办方法使用postMessage方式调用userInfo方法，获取app公参
     * 从万顺云app进入H5时候是无法直接拿到用户信息，H5是无法知道在哪个app容器内（司机、乘客、万顺云办公）
     * 通过特定app平台注入的事件句柄尝试去执行userInfo方法，如果执行成功，则为万顺云办公、否则不是
     */
    // try {
    //   if(window.webkit) {
    //     window.userInfoBack = (res) => {
    //         resolve(res)
    //     }
    //     window.webkit.messageHandlers.userInfo.postMessage('');

    //     return
    //   }
    // } catch (error) {
    //   console.log('万顺云办公postMessage报错:', error);
    // }
    if(window.webkit) {
      if (callBackName) {
        window[callBackName] = res => {
          resolve(res)
          delete window[callBackName]
        }
      }
      try {
        window.webkit.messageHandlers[name].postMessage(data)
      } catch (error) {
        reject()
      }
      return
    }


    /**
     * 司机乘客端app执行bridge
     * 下面不同的判断表示不同IOS版本事件句柄的语法兼容
     */
    if (window.WebViewJavascriptBridge) {
      window.WebViewJavascriptBridge.callHandler(name, data, resolve)
      return
    }
    if (window.WVJBCallbacks) {
      window.WVJBCallbacks.push((bridge) => {
        bridge.callHandler(name, data, resolve)
      })
      return
    }
    window.WVJBCallbacks = [
      (bridge) => {
        bridge.callHandler(name, data, resolve)
      },
    ]
    addIOSIframe()
  })
}

/**
 * 请求android app的方法
 * @param {string} method 方法名称
 * @param {Array} data 请求的数据
 */
function androidCall(method, data, callBackName) {
  return new Promise((resolve, reject) => {
    let param
    if (data) {
      if (Array.isArray(data)) {
        param = data
      } else {
        param = [data]
      }
    }
    if (callBackName) {
      const time = Date.now()
      const success = 'success' + time
      const fail = 'fail' + time
      window[success] = (res) => {
        resolve(res)
        delete window[success]
        delete window[fail]
      }
      window[fail] = (res) => {
        reject(res)
        delete window[success]
        delete window[fail]
      }
      param = {
        success,
        fail,
      }
      if (data) {
        param = { ...param, ...data }
      }
      param = [JSON.stringify(param)]
    }
    let callMethod = (object) => {
      const fun = object[method]
      // eslint-disable-next-line prefer-promise-reject-errors
      fun ? fun.apply(object, param) : reject()
    }
    if (window.Activity) {
      callMethod(window.Activity)
    } else if (window.ws) {
      callMethod(window.ws)
    }
  })
}

export const getPlatform = function() {
  let platform
  if (window.ws || window.Activity) {
    // android
    platform = SYSPLATFORM.android
  } else if (window.__wxjs_environment === 'miniprogram') {
    // 小程序
    platform = SYSPLATFORM.xcx
  } else if (/(?:iPhone)/.test(navigator.userAgent)) {
    // ios
    window.WVJBCallbacks = [
      () => {
        platform = SYSPLATFORM.ios
      },
    ]
    addIOSIframe()
    platform = SYSPLATFORM.ios
  } else {
    // h5
    platform = SYSPLATFORM.h5
  }

  // eslint-disable-next-line no-unreachable
  return platform
}

let freeSignInLoding = false
export const checkFreeSignIn = async (flag = true) => {
  console.log('-----', freeSignInLoding)
  // 正在进行免密登录
  if (freeSignInLoding) {
    return
  }
  freeSignInLoding = true
  // Cookies.set('_wsf_role', getQueryString('role'))
  const platform = getPlatform()
  // 设置成App状态 - 禁用退出功能
  window.platform = platform
  // eslint-disable-next-line eqeqeq
  if (platform == SYSPLATFORM.android || platform == SYSPLATFORM.ios) {
    // 防止是ios app 获取平台标识延迟
    await new Promise((resolve) => {
      setTimeout(async () => {
        await call('userInfo', '', 'userInfoBack').then(
          async (data) => {
            console.log('获取的APP数据---->', JSON.stringify(data))
            // 扩展数据
            // 系统参数,ios,android,html等等
            data.sysPlatform = platform
            localStorage.setItem('appData', JSON.stringify(data))
            let { channel, role, token} = data

            // 进入渠道放入vuex
            let userSource = getUserSource(channel)
            store.commit('SET_NEWUSERSOURCE', userSource)
            
            Cookies.set('_wsf_channel', channel.substr(0, 4))
            // Todo 未完成 退出登录清除token登录信息
            // if (!token && deviceId) {
            //   console.log('////// 清除登录状态')
            //   removeToken()
            // }
            // token不存在的时候兼容处理，_wsf_role设置初始值
            Cookies.set('_wsf_role', 0)

            if (token) {
              store.dispatch('setUserSource', role == 2 ? 2 : 1)
              Cookies.set('_wsf_role', 1)
              // 实体店电商支付回调不执行免密登录
              let channelCode = transChannel(userSource)
              Cookies.set('_wsf_channel_code', channelCode)

              // 新版本的免密登录不需要授权 2023/07/04
              // 如果是智慧生活的，不需要再走登录接口，因为本身token都是一样的
              if (userSource == USER_SOURCE.smartLife) {
                await signInSignUpAppSmart(data)
              } else {
                await unAuthLoginForTokenSmart(data)
              }

              freeSignInLoding = false
            }
          },
          () => {
            // alert('获取app用户信息失败')
            console.log('获取app用户信息失败')
            freeSignInLoding = false
          }
        )
        resolve()
      }, 0)
    })
  }
}

/** 返回url的参数值 */
function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  let result = decodeURI(window.location.search.substr(1)).match(reg)
  return result ? unescape(result[2]) : null
}

/**
 * unAuthLogin 免密登录
 * @params phoneNo,
 * @params userSource,
 * @params platform
 * */
function unAuthLogin(phoneNo, userSource, platform, channel) {
  if (!phoneNo) return
  if (!userSource) {
    userSource = discernmentChannel(channel)
  }
  // store.dispatch('setUserSource', userSource)
  localStorage.setItem('userSource', userSource)
  let wsf_channle = channel.substr(0, 4)
  Cookies.set('_wsf_channel', wsf_channle)
  Cookies.set('_wsf_role', userSource)
  const data = sign({
    phoneNo,
    userSource,
  })
  data.channel = channel
  console.log('reqNoAuthLoginData', data)
  noAuthLogin(data).then((res) => {
    // console.log(res, 'token');
    // 设置成登录状态
    // window.isLogin = true
    // 设置token
    if (res.data) {
      setToken(res.data)
      setWebFunny()
    }
    // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
    // 更新推荐列表
    window.resetRecommendData()
  })
}
export async function unAuthLoginV1fun(data) {
  await unAuthLoginV1(data).then((res) => {
    // 设置成登录状态
    // window.isLogin = true
    // 设置token
    removeToken()

    sessionStorage.removeItem('HASDISTRIBUTIONPOWER')
    if (res.code == 200) {
      console.log('这个是免密得返回',res);
      setToken(res.data.token)
      // window.IS_DISTRIBUTION = res.data.hasDistributionPermission
      sessionStorage.setItem('HASDISTRIBUTIONPOWER', res.data.hasDistributionPermission)
      store.commit('OPERATION_DISTRIBUTION', res.data.hasDistributionPermission)
      setWebFunny()
    } else {
      Toast(res.description)
    }
    // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
    // 更新推荐列表 加延时
    setTimeout(() => {
      window.resetRecommendData && window.resetRecommendData()
      window.resetSpudetail && window.resetSpudetail()
    }, 1500)
  })
}
// 转换渠道值 放入请求头  首单活动增加
// export const transChannel = function(channel) {
//   let typeCode = `${channel}`.substring(0, 4)
//   let channelCode
//   switch (typeCode) {
//     case '1010':
//     case '1050':
//     case '1020':
//       channelCode = 6
//       Cookies.set('_wsf_channel_name', '万顺叫车乘客端')
//       break
//     case '2010':
//     case '2050':
//     case '6010': // 代驾
//       channelCode = 5
//       Cookies.set('_wsf_channel_name', '万顺叫车车主端')
//       break
//     case '3010':
//     case '5050':
//       channelCode = 15
//       Cookies.set('_wsf_channel_name', '万顺云办公')
//       break
//     default:
//       channelCode = 2
//       Cookies.set('_wsf_channel_name', '万顺福h5')
//       break
//   }
//   return channelCode
// }

// export const getUserSource = function(channelCode) {
//   let userSource
//   switch (channelCode) {
//     case 5://万顺叫车车主端
//       userSource= 2
//       break;
//     case 6://万顺叫车乘客端
//       userSource= 1
//       break;
//     case 15://万顺云办公
//       userSource= 3
//       break;
//     default:
//       break;
//   }
//   return userSource
// }

// 转换渠道值，获取usersource
export const getUserSource = function(channel) {
  // 根据渠道码后4位判断app来源
  let typeCode = `${channel}`.substring(0, 4)
  let userSource
  switch (typeCode) {
    // 万顺叫车乘客端
    case '1010':
    case '1050':
    case '1020':
      userSource = USER_SOURCE.passenger
      Cookies.set('_wsf_channel_name', '万顺叫车乘客端')
      break
    // 万顺叫车车主端
    case '2010':
    case '2050':
      userSource = USER_SOURCE.driver
      Cookies.set('_wsf_channel_name', '万顺叫车车主端')
      break
    // 万顺云办公
    case '3010':
    case '5050':
      userSource = USER_SOURCE.wscloud
      Cookies.set('_wsf_channel_name', '万顺云办公')
      break
    // 推广员
    // case '8888': // TODO
    //   userSource = USER_SOURCE.promoter
    //   Cookies.set('_wsf_channel_name', '推广员')
    //   break
    // 万顺叫车代驾端
    case '6010':
      userSource = USER_SOURCE.designatedDrver
      Cookies.set('_wsf_channel_name', '万顺叫车代驾端')
      break
    // 智慧生活
    case '7050':
    case '7010':
      userSource = USER_SOURCE.smartLife
      Cookies.set('_wsf_channel_name', '万顺福APP') // 智慧生活APP
      break
    default:
      userSource = USER_SOURCE.wsmall
      Cookies.set('_wsf_channel_name', '万顺福h5')
      break
  }
  return userSource
}

// 根据usersource，也就是根据渠道值获取channelCode
export const transChannel = function(userSource) {
  let channelCode
  switch (userSource) {
    // 万顺叫车乘客端
    case USER_SOURCE.passenger:
      channelCode = CHANNEL_CODE.passenger
      break
    // 万顺叫车车主端
    case USER_SOURCE.driver:
      channelCode = CHANNEL_CODE.driver
      break
    // 代驾
    case USER_SOURCE.designatedDrver:
      channelCode = CHANNEL_CODE.designatedDrver
      break
    // 万顺云办公
    case USER_SOURCE.wscloud:
      channelCode = CHANNEL_CODE.wscloud
      break
    // 推广员
    case USER_SOURCE.promoter:
      channelCode = CHANNEL_CODE.promoter
      break
    // 智慧生活
    case USER_SOURCE.smartLife:
      channelCode = CHANNEL_CODE.smartLife
      break
    default:
      channelCode = CHANNEL_CODE.wsmall
  }
  return channelCode
}

// 免密登录方案2 - 网约车token请求登录
async function unAuthLoginForToken(userInfo) {
  let { token, channel, role, userPhone, platform, appVersion, sysVersion, passengerId, driverId,userId, valetId, appScheme } = userInfo
  console.log(userInfo,appScheme,'appSchemeappScheme');
  if (!token) return
  // let userSource = role ? role : discernmentChannel(channel)
  // let userSource = role == 2 ? 2 : 1

  let userSource = getUserSource(channel)
  let channelCode = transChannel(userSource)
  Cookies.set('_wsf_channel_code', channelCode)
  localStorage.setItem('userSource', userSource)
  let phoneNo = userPhone
  const data = sign({
    phoneNo,
    userSource,
  })
  data.channel = channel
  data.token = token
  data.platform = platform
  data.softVersion = appVersion
  data.sysVersion = sysVersion
  data.passengerId = passengerId
  data.driverId = driverId
  // 免密登录userinfo里加了一个appScheme 参数 ，如果是 wsjc,那么把userid赋值给passengerId ,
  // 如果是wscz，那么把userid赋值给driverId，如果是wsdj,那么把userid赋值给valetId
  // data.userId =  {
  //   'wsjc': passengerId,
  //   'wscz': driverId,
  //   'wsdj': valetId
  // }[appScheme]
  data.userId = userId
  data.valetId= valetId // 代驾id
  if(appScheme == 'wsjc'){
    data.passengerId = userId
  } else if(appScheme == 'wscz') {
    data.driverId = userId
  } else if(appScheme == 'wsdj') {
    data.valetId = userId
  }

  Cookies.set('registrationProtocolData', JSON.stringify(data))
  // if (userSource == 1) return
  console.log('------这个是免密入参',data);
  await unAuthLoginV1fun(data, channelCode)
}

/**
 * 智慧生活 直接设置不用调接口
 */
async function signInSignUpAppSmart(userInfo) {
  let { token, channel, role, userPhone, platform, sysPlatform, appVersion, softVersion, sysVersion, passengerId, driverId,userId, valetId, appScheme } = userInfo

  if (token) {
    setToken(token)
    setWebFunny()
  }

  // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
  // 更新推荐列表 加延时
  setTimeout(() => {
    window.resetRecommendData && window.resetRecommendData()
    window.resetSpudetail && window.resetSpudetail()
  }, 1500)
}

/**
 * 免密登录升级版本--智慧生活版本
 */
async function unAuthLoginForTokenSmart(userInfo) {
  let { token, channel, role, userPhone, platform, sysPlatform, appVersion, softVersion, sysVersion, passengerId, driverId,userId, valetId, appScheme, deviceId } = userInfo
  console.log(userInfo, appScheme,'appSchemeappScheme');
  if (!token) return
  // let userSource = role ? role : discernmentChannel(channel)
  // let userSource = role == 2 ? 2 : 1

  let userSource = getUserSource(channel)
  let channelCode = transChannel(userSource)
  Cookies.set('_wsf_channel_code', channelCode)
  localStorage.setItem('userSource', userSource)
  let phoneNo = userPhone
  const data = sign({
    phoneNo,
    userSource,
  })
  data.channel = channel
  data.token = token
  data.platform = sysPlatform
  data.softVersion = appVersion || softVersion
  data.sysVersion = sysVersion
  data.passengerId = passengerId
  data.driverId = driverId
  // 免密登录userinfo里加了一个appScheme 参数 ，如果是 wsjc,那么把userid赋值给passengerId ,
  // 如果是wscz，那么把userid赋值给driverId，如果是wsdj,那么把userid赋值给valetId
  // data.userId =  {
  //   'wsjc': passengerId,
  //   'wscz': driverId,
  //   'wsdj': valetId
  // }[appScheme]
  data.valetId= valetId // 代驾id
  if(appScheme == 'wsjc'){
    data.passengerId = userId
  } else if(appScheme == 'wscz') {
    data.driverId = userId
  } else if(appScheme == 'wsdj') {
    data.valetId = userId
  }
  data.userId = userId

  // 设备id，不是所有app都有，先给一个默认值
  data.deviceId = deviceId || ''

  Cookies.set('registrationProtocolData', JSON.stringify(data))
  // if (userSource == 1) return
  console.log('------这个是免密入参',data);
  await unAuthLoginSmartFun(data)
}

async function unAuthLoginSmartFun(data) {
  await unAuthLoginSmart(data).then((res = {}) => {
    // 设置成登录状态
    // window.isLogin = true
    // 设置token
    removeToken()

    sessionStorage.removeItem('HASDISTRIBUTIONPOWER')
    if (res.code == 200) {
      console.log('这个是免密得返回',res);
      setToken(res.data.token)
      // window.IS_DISTRIBUTION = res.data.hasDistributionPermission
      sessionStorage.setItem('HASDISTRIBUTIONPOWER', res.data.hasDistributionPermission)
      store.commit('OPERATION_DISTRIBUTION', res.data.hasDistributionPermission)
      setWebFunny()
    } else {
      Toast(res.msg)
    }
    // Todo App内嵌入口的H5屏蔽退出功能,后续需修复
    // 更新推荐列表 加延时
    setTimeout(() => {
      window.resetRecommendData && window.resetRecommendData()
      window.resetSpudetail && window.resetSpudetail()
    }, 1500)
  })
}

export function setWebFunny() {
  let channelName = Cookies.get('_wsf_channel_name')
  customerDetail().then((response) => {
    const { data } = response || {}
    if (response.flag == 1) {
      window.localStorage.wmUserInfo = JSON.stringify({ userId: response.data.id, userTag: channelName, projectVersion: 'V1.8.0' })
      //覆盖未登录uid
      store.commit('SET_NOTLOGINUID', response.data.id)
      store.commit('user/SET_USERINFO', data)
    }
  })
}

// 查询app是否授权
export async function getAuth(userInfo) {

  let params = {
    passengerId: userInfo.passengerId,
    phone: userInfo.userPhone
  }
  // 代驾车主userId转代驾id
  if(userInfo.appScheme == 'wsdj') {
    params.valetId = userInfo.userId
  }
  try {
    let res = userInfo.role == 1 ? await selectOneByCondition(params) : await selectOneDriverByCondition(params)
    if(userInfo.role == 1) {
      if (res.code === 200 && !res.data.passengerId && res.data.passengerPhone) {
        return false
      } else {
        return true
      }
    } else {
      if (res.code === 200 && !res.data.id) {
        return false
      } else {
        return true
      }
    }

  } catch (error) {
    console.log(error)
  }
  return true
}

// 此方法仅限用于从app配置路径跳转到h5不走授权但需要获取app公参信息的
export async function analysisGinseng() {
  const platform = getPlatform()
  window.platform = platform
  if (platform == 1 || platform == 2 || platform == 3) {
    return await call('userInfo', '', 'userInfoBack')
  }
}

// 智慧生活跳转app原生页面
export function smartOpenDeepLink(url) {
  // android
  if (window.ws) {
    window.ws.openDeepLink(url)
  }
  // ios
  else if (window.webkit) {
    window.webkit.messageHandlers.openDeepLink.postMessage(url);
  }
}

// 智慧生活是否展示app顶部
// true显示，false隐藏
export function showOrHideStatusBar(statu) {
  // android
  if (window.ws && window.ws.showOrHideStatusBar) {
    window.ws.showOrHideStatusBar(statu)
  }
  // ios
  else if (window.webkit && window.webkit.messageHandlers.showOrHideStatusBar) {
    window.webkit.messageHandlers.showOrHideStatusBar.postMessage(statu);
  }
}

export function judgeOpenAppLogin() {
  let res = false
  let appData
  try {
    appData = JSON.parse(localStorage.getItem('appData')) || {}
  } catch(e) {
    appData = {}
  }
  let { channel, token } = appData

  let userSource = getUserSource(channel)
  // 目前的判断条件是智慧生活app跳转需要，其他app都是走的前置登录
  // 智慧生活且token不存在
  if (userSource == USER_SOURCE.smartLife && !token) {
    smartOpenDeepLink('wsf://app/login')
    res = true
  }

  return res
}
