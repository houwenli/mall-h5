import routers  from '../router/index'
import store from '../store/store'
import Cookies from 'js-cookie'
import { encrypt } from './sign'
import { getUserSource } from '@/utils/hybrid'

 // 唤醒小程序分销
export const toMiniAppDistribution = async function(liveUrl) {
  let platform = undefined
  if (window.ws) {
    platform = 2
  } else if (window.webkit) {
    platform = 1
  }
    const { data } = await store.dispatch('user/getUserInfo')
  // 准备密钥
  console.log('this.userId: ', store.getters.userId)
  let aesToken = encrypt(store.getters.userId, 'VGrCjJsxus1pXky0').encryptStr
  console.log('aesToken', aesToken)
  // let userSource = store.getters.getUserSource,
  let userSource = Cookies.get('_wsf_channel_code'), us = ''
  if (userSource && (userSource == 5 || userSource == 6)) {
    us = userSource
  }
  //判断是否为生成环境
  let miniprogramType
  if (process.env.NODE_ENV == 'production') {
    miniprogramType = 0
  } else {
    miniprogramType = 2
  }
  let shareData = {
    sharePlatformList: [
      {
        userName: process.env.MINI_APPLET_ID, // 小程序原始Id,
        path: `${liveUrl}?k=${aesToken}&us=${us}`,
        miniprogramType: miniprogramType,
        platformTag: 7,
      },
    ],
  }
  shareData = JSON.stringify(shareData)
  if (platform === 2) {
    try {
      window.ws.wsShare(shareData)
      // window.location.href = this.getUrl(true)
    } catch (err) {
      console.log('安卓拉起失败', err)
      if (Cookies.get('_wsf_role') != 1) {
        // window.location.href = this.getUrl()
      }
    }
  } else if (platform === 1) {
    try {
      window.webkit.messageHandlers.wsShare.postMessage(shareData)
      // window.location.href = this.getUrl(true)
    } catch (err) {
      console.log('ios拉起失败', err)
      /* if (Cookies.get('_wsf_role') != 1) {
        window.location.href = this.getUrl()
      } */
    }
  }
  /* if (Cookies.get('_wsf_role') != 1) {
    window.location.href = this.getUrl(true)
  } */
};

//判断是否是微信浏览器
export const isWx = () => {
  if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
};
// 获取usersource用来判断各个APP来源  -- 因为部分app不走免密登录，未存usersource
export const getUsersource = ()=>{
  let appData
  try {
    appData = JSON.parse(localStorage.getItem('appData')) || {}
  } catch(e) {
    appData = {}
  }
  let { channel } = appData
  let usersource = getUserSource(channel)
  return usersource
}
// 格式化金额，保留两位小数
export const formatPrice = function (num, scale = 2) {
  if (num === null || isNaN(num)) {
    return '';
  }
  return num.toFixed(scale);
};

// 获取单品价格（批发价）
export const getBatchSkuPrice = (sku) => {
  if (!sku) {
    return ''
  }
  let priceHtml = parseFloat(sku.price).toFixed(2) + '';
  if (sku.isBatchSku == '1') {
    priceHtml = parseFloat(sku.lowestBatchPrice).toFixed(2) + '起';
  }
  return priceHtml;
};


//  获取cookie中的值
export function getCookie(name) {
  let arr = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');

  if (arr == document.cookie.match(reg)) {
    return unescape(arr[2]);
  }
  return "";
}

/**
 * 在一个连续操作行为中，每间隔delay的时间触发1次。
 * 函数在一段时间内多次触发只会执行第一次，在这段时间结束前，不管触发多少次也不会执行函数。
 * 频率控制(函数节流) 返回函数连续调用时，func 执行频率限定为 次 / wait
 * @from underscore源码注解 https://www.cnblogs.com/guanine/p/9623325.html
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始边界上的调用，传入{leading: false}。
 *                                如果想忽略结尾边界上的调用，传入{trailing: false}
 * @return {function}             返回客户调用函数
 */
export const throttle = function (func, wait = 300, options) {
  let context, args, result
  let timeout = null
  // 上次执行时间点
  let previous = 0
  if (!options) options = {}
  // 延迟执行函数
  let later = function () {
    // 若设定了开始边界不执行选项，上次执行时间始终为0
    previous = options.leading === false ? 0 : Number(new Date())
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function (..._args) {
    let now = Number(new Date())
    // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
    if (!previous && options.leading === false) previous = now
    // 延迟执行时间间隔
    let remaining = wait - (now - previous)
    context = this
    args = _args
    // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
    // remaining大于时间窗口wait，表示客户端系统时间被调整过
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
      //如果延迟执行不存在，且没有设定结尾边界不执行选项
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 * @description 函数防抖，就是指触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。
 * @param  {function} func        传入函数，最后一个参数是额外增加的this对象，.apply(this, args) 这种方式，this无法传递进函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 * @return {function}             返回客户调用函数
 */
export const debounce = function (func, wait = 300, immediate = true) {
  let timeout, args, context, timestamp, result
  const later = function () {
    // 据上一次触发时间间隔
    let last = Number(new Date()) - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.call(context, ...args, context)
        if (!timeout) {
          context = args = null
        }
      }
    }
  }

  return function (..._args) {
    context = this
    args = _args
    timestamp = Number(new Date())
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (callNow) {
      result = func.call(context, ...args, context)
      context = args = null
    }

    return result
  }
}

// 图片尺寸
export const SMALL_SIZE = '!58'
export const MIDDLE_SIZE = '!220'
export const BIG_SIZE = '!400'
export const SIZE_800 = '!800'
export const SIZE_120 = '!120'

// 根据时间戳返回年月日
export const getDate = function(dateTime) {
  let date = new Date(dateTime);
  let year = date.getFullYear();
  let month =  date.getMonth()+1 < 10 ? '0'+(+date.getMonth()+1):+date.getMonth()+1; //js从0开始取
  let date1 = date.getDate();
  let hour =  date.getHours() < 10 ? '0'+date.getHours():date.getHours();
  let minutes = date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes();
  let second = date.getSeconds();
  return `${month}月${date1}日 ${hour}:${minutes}`
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function parseTimeData(time) {
  const days = Math.floor(time / DAY);
  const hours = Math.floor((time % DAY) / HOUR);
  const minutes = Math.floor((time % HOUR) / MINUTE);
  const seconds = Math.floor((time % MINUTE) / SECOND);
  const milliseconds = Math.floor(time % SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}



// 解决模态框底部页面滚动问题
let bodyEl = document.body
let top = 0
export function stopBodyScroll (isFixed) {
 if (isFixed) {
 top = window.scrollY

 bodyEl.style.position = 'fixed'
 bodyEl.style.top = -top + 'px'
 } else {
 bodyEl.style.position = ''
 bodyEl.style.top = ''

 window.scrollTo(0, top) // 回到原先的top
 }
}

// 深度克隆
export const deepClone = function(obj) {
  // 对常见的“非”值，直接返回原来值
  if([null, undefined, NaN, false].includes(obj)) return obj;
    if(typeof obj !== "object" && typeof obj !== 'function') {
    //原始类型直接返回
        return obj;
    }
    let o = isArray(obj) ? [] : {};
    for(let i in obj) {
        if(obj.hasOwnProperty(i)){
            o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
  }

  // 判断arr是否为一个数组，返回一个bool值
function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}

  // 获取url参数
function parseUrlParams(str) {
  const reg = /([^?&=]+)=([^&]+)/g  // 分组捕获 两个子组
  const params = {}
  str.replace(reg, (_, k, v) => params[k] = v)
  return params
}


/**
 * 解析url 中的参数
 * @param {String} url
 * @param {String} type
 */
export const routerPathName = function(url,type){
  // const aimUrl = url.split('?').pop().split('#').shift().split('&');

  // H5只取第一个
  let ProcessUrl = url.split('~')[0]

  // 获取地址中的参数
  let query = parseUrlParams(ProcessUrl);
  // let path = url.split("?")[0]

  let path = ProcessUrl.split('?')[0]
  let strtok = ''
  if (url.indexOf('.com') !== -1) strtok = '.com'
  if (url.indexOf('.cn') !== -1) strtok = '.cn'
  path = path.split(strtok)[1]
  /**
   * 此处逻辑判断拿到的链接是否是内置路由,否则直接跳转
   */
  let isShow  = routers.options.routes.find(item => {
    return item.path === path
  })
  console.log('此路由地址是否为内置路由-->',isShow);
  if(isShow === undefined){
    let h5Link
    if(type && type == 'distribution') {
      h5Link = url.split("~")[0]
    } else {
      h5Link = url
    }
    window.location.href = h5Link //外部链接
  }else {
    // 此处为分销首页模板跳转单独处理----------开始-------------
    // let isDistribution=url.split('&')
    // if(isDistribution.length>1&&isDistribution[1]=='isDistribution=true'){
    //   let aimUrl22=url.split("~")[0].split('?').pop().split('&')
    //   aimUrl22.forEach(item => {
    //     const [key, val] = item.split('=');
    //     query[key] = val;
    //   });
    //   if(store.getters.getDistributionPer){//判断是否是分销员
    //     routers.push({path,query})
    //   }else{
    //     delete query.isDistribution
    //     routers.push({path,query:{...query,promoteInfo:true}})
    //   }
    //   return
    // }
    // 此处为分销首页模板跳转单独处理----------完毕-------------


    // 是否为分销
    if(ProcessUrl.indexOf('isDistribution=true') != -1) {
        if(store.getters.getDistributionPer){//判断是否是分销员
          routers.push({path,query})
        }else{
          delete query.isDistribution
          routers.push({path,query:{promoteInfo:true, ...query}})
        }
        return
    }



    // aimUrl.forEach(item => {
    //     const [key, val] = item.split('=');
    //     query[key] = val;
    // });
    routers.push({path,query})
  }
}
// 单位转换 分转元, float = true 保留两位小数,不足两位则补0；false 没有小数位或不足两位，不补0
export const regFenToYuan = function(m, float = true) {
  if (!parseInt(m)) {
    return '0.00'
  }
  let num = Math.round((m / 100) * 100) / 100
  return float ? num.toFixed(2) : num
}
//获取经纬度
export const getLocation= function(platform) {
      const time = Date.now()
      const success = 'success' + time
      const fail = 'fail' + time
      const loc = {type:"",success,fail}
      return new Promise((resolve, reject)=>{
          if (platform==1) {//安卓
            try {
              window.ws.getLocation(JSON.stringify(loc))
            } catch (error) {
              this.$toast('获取定位失败')
            }
          }else if(platform==2){//ios
            try {
              window.webkit.getLocation(JSON.stringify(loc))
            } catch (error) {
              this.$toast('获取定位失败')
            }
          }
          window[success] = resolve
          window[fail] = reject
      })

}
// H5获取经纬度
export const location = (id, onComplete, onError)=> {
  let mapObj = new AMap.Map(id, {});
  let geolocation;
  mapObj.plugin(['AMap.Geolocation'], function() {
      geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          position: 'RB', //定位按钮的停靠位置
          offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
          zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
      });
      mapObj.addControl(geolocation);
      geolocation.getCurrentPosition((status, result) => {
          if (status == 'complete') {
              onComplete(result);
          } else {
              onError(result);
          }
      });
  });
  return geolocation;
}
;


export const isMobile = () => {
  const ua = navigator && navigator.userAgent,
      isWindowsPhone = /(?:Windows Phone)/.test(ua),
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
      isAndroid = /(?:Android)/.test(ua),
      isFireFox = /(?:Firefox)/.test(ua),
      isChrome = /(?:Chrome|CriOS)/.test(ua),
      isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
      isPhone = /(?:iPhone)/.test(ua) && !isTablet,
      isWexin = ua.toLowerCase().indexOf('micromessenger') !== -1,
      isPc = !isPhone && !isAndroid && !isSymbian;
  return {
      isTablet: isTablet, // 平板
      isPhone: isPhone,
      isAndroid: isAndroid,
      isPc: isPc,
      isMobile: isPhone || isAndroid,
      isWexin
  }
}

export const getQueryString = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

// 获取小数的整数位和小数位，不足保留位数补0
export const getSplitPrice = (price, point = 2) => {
  if (isNaN(price)) {
    return null
  }

  let newPrice = Math.round(price * Math.pow(10, point)) / Math.pow(10, point)
  newPrice = newPrice.toFixed(point); // 补位

  let priceArr = newPrice.split('.') || [];
  let int = priceArr[0] || 0
  let decimal = priceArr[1] || '00'
  return {
    price,
    int,
    decimal
  }
}

// 元转分
export const yuanToFen = function(amount) {
  if (!parseFloat(amount)) {
    return 0;
  }
  return Math.round(amount * 100);
}

// 返回上一页，兼容app内嵌的返回
export const appBack = function () {
  let url = window.location.href
  // instance.$router.go(-1)
  // 替代方案因为，智慧生活壳子和电商不是一个项目
  window.history.back()
  let time = setTimeout(() => {
    clearTimeout(time)
    console.log(url, window.location.href)
    if (url === window.location.href){
      console.log('进入app返回');
      if (window.ws) {
        console.log('安卓返回');
        // android环境
        window.ws.finishActivity();
      } else if (window.webkit) {
        // ios环境
        console.log('ios返回');
        window.webkit.messageHandlers.finishActivity.postMessage('');
      }
    }
  }, 200)
}