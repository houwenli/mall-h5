/**
 * @Description: 嵌入App,加密免登陆凭证
 * @Author: ChenFeng
 * @Date: 2020-07-18 17:01:02
 * @LastEditTime: 2019-06-05 16:09:00
 * @LastEditors: ChenFeng
 */
// 引入md5
import md5 from 'js-md5'
import { noAuthLogin, unAuthLoginV1 } from '../api/login'
import { setToken, removeToken } from '@/utils/token'
import Cookies from 'js-cookie'
import { Toast } from 'vant'
import store from '../store/store'
import { customerDetail } from '@/api/home'
import { selectOneByCondition, selectOneDriverByCondition  } from '@/api/personalinfo'
import { app } from '@/main'
import wx from 'weixin-js-sdk'
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
 */
export const call = function(platform, name, data) {
  console.log(platform, name, data, 'platform, name, data')
  // android
  // eslint-disable-next-line eqeqeq
  if (platform == 1) {
    return androidCall(name, data)
    // eslint-disable-next-line eqeqeq
  } else if (platform == 2) {
    // ios
    return iosCall(name, data)
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
function iosCall(name, data) {
  return new Promise((resolve) => {
    /**
     * 万顺云办方法使用postMessage方式调用userInfo方法，获取app公参
     * 从万顺云app进入H5时候是无法直接拿到用户信息，H5是无法知道在哪个app容器内（司机、乘客、万顺云办公）
     * 通过特定app平台注入的事件句柄尝试去执行userInfo方法，如果执行成功，则为万顺云办公、否则不是
     */
    try {
      if(window.webkit) {
        window.userInfoBack = (res) => {
            resolve(res)
        }
        window.webkit.messageHandlers.userInfo.postMessage('');
        
        return
      }
    } catch (error) {
      console.log('万顺云办公postMessage报错:', error);
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
function androidCall(method, data) {
  return new Promise((resolve, reject) => {
    let param
    if (data) {
      if (Array.isArray(data)) {
        param = data
      } else {
        param = [data]
      }
    } else if (['userInfo', 'getPayment', 'getLocation', 'getServiveUrl'].includes(method)) {
      const time = Date.now()
      const success = 'success' + time
      const fail = 'fail' + time
      window[success] = resolve
      window[fail] = reject
      param = {
        success,
        fail,
      }
      param = [JSON.stringify(param)]
    } else {
      param = []
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
    platform = 1
  } else if (window.__wxjs_environment === 'miniprogram') {
    // 小程序
    platform = 4
  } else if (/(?:iPhone)/.test(navigator.userAgent)) {
    window.WVJBCallbacks = [
      () => {
        platform = 2
      },
    ]
    addIOSIframe()
    platform = 2
  }

  // eslint-disable-next-line no-unreachable
  return platform
}

export const checkFreeSignIn = async (flag = true) => {
  // Cookies.set('_wsf_role', getQueryString('role'))
  const platform = getPlatform()
  // 设置成App状态 - 禁用退出功能
  window.platform = platform
  // eslint-disable-next-line eqeqeq
  if (platform == 1 || platform == 2 || platform == 3) {
    // 防止是ios app 获取平台标识延迟
    await new Promise((resolve) => {
      setTimeout(async () => {
        await call(platform, 'userInfo').then(
          async (data) => {
            console.log('获取的网约车数据---->', data)
            let { channel, userPhone, role, token, userId, passengerId, driverId } = data

            Cookies.set('_wsf_channel', channel.substr(0, 4))
            // Todo 未完成 退出登录清除token登录信息
            // if (!token && deviceId) {
            //   console.log('////// 清除登录状态')
            //   removeToken()
            // }
            
            if (token) {
              store.dispatch('setUserSource', role == 2 ? 2 : 1)
              Cookies.set('_wsf_role', 1)
              // 实体店电商支付回调不执行免密登录
              let channelCode = transChannel(channel)
              Cookies.set('_wsf_channel_code', channelCode)
              let userSource = getUserSource(channelCode)
              let isAuth
              // 万顺云办公不需要检查授权
              if(userSource===3){
                isAuth = flag
              }else{
                isAuth = flag && (await getAuth(data))
                console.log(isAuth, 'isAuth')
                console.log(!isAuth.flag, '!isAuth.flag')
                console.log(flag, 'flag')
                console.log(isAuth.passengerPhone, 'isAuth.passengerPhone')
                // 判断下车主  role
                if (!isAuth && flag) {
                  if (role == 2 && location.pathname == '/blessing') {
                    app.$router.replace({
                      path: '/version'
                    })
                  } else {
                    app.$router.replace({
                      path: 'userAuthorize',
                      query: {
                        phone: userPhone,
                        isApp: true,
                        passengerId,
                        backUrl: window.location.pathname + window.location.search
                      },
                    })
                  }
                }
                // 车主端如果没有乘客账号，不走免密登录
                // if (role == 2 && !isAuth.passengerPhone) {
                //   return false
                // }
              } 
              if (isAuth || !flag) {
                await unAuthLoginForToken(data)
              }
            }
          },
          () => {
            // alert('获取app用户信息失败')
            console.log('获取app用户信息失败')
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
export const transChannel = function(channel) {
  let typeCode = `${channel}`.substring(0, 4)
  let channelCode
  switch (typeCode) {
    case '1010':
    case '1050':
    case '1020':
      channelCode = 6
      Cookies.set('_wsf_channel_name', '万顺叫车乘客端')
      break
    case '2010':
    case '2050':
    case '6010': // 代驾
      channelCode = 5
      Cookies.set('_wsf_channel_name', '万顺叫车车主端')
      break
    case '3010':
    case '5050':
      channelCode = 15
      Cookies.set('_wsf_channel_name', '万顺云办公')
      break
    default:
      channelCode = 2
      Cookies.set('_wsf_channel_name', '万顺福h5')
      break
  }
  return channelCode
}
export const getUserSource = function(channelCode) {
  let userSource
  switch (channelCode) {
    case 5://万顺叫车车主端
      userSource= 2
      break;
    case 6://万顺叫车乘客端
      userSource= 1
      break;
    case 15://万顺云办公
      userSource= 3
      break;
    default:
      break;
  }
  return userSource
}
// 免密登录方案2 - 网约车token请求登录
async function unAuthLoginForToken(userInfo) {  
  let { token, channel, role, userPhone, platform, appVersion, sysVersion, passengerId, driverId,userId, valetId, appScheme } = userInfo
  console.log(userInfo,appScheme,'appSchemeappScheme');
  if (!token) return
  // let userSource = role ? role : discernmentChannel(channel)
  // let userSource = role == 2 ? 2 : 1

  let channelCode = transChannel(channel)
  let userSource = getUserSource(channelCode)
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

function setWebFunny() {
  let channelName = Cookies.get('_wsf_channel_name')
  customerDetail().then((response) => {
    const { data } = response
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
    return await call(platform, 'userInfo')
  }
}
