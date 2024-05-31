/*
 * @Author: DaiYu
 * @Date: 2023-08-08 09:38:41
 * @LastEditors: DaiYu
 * @LastEditTime: 2023-08-10 10:53:56
 * @FilePath: \src\utils\location.js
 * @Description: file content
 */
import { QQ_MAP_KEY, GAODE_KEY } from '@/utils/config'
import { call } from '@/utils/hybrid'
function loader(url, cb, isAsync = true) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = isAsync
  script.src = url
  document.body.appendChild(script)
  script.onload = cb
}

// 腾讯serviceApi 使用jsonp方式 axios请求会跨域
const qqRequest = (params) => {
  return new Promise((resolve, reject) => {
    const oscript = document.createElement('script')
    let p = params.url + '?'
    delete params.url
    const timer = setTimeout(reject, 5000)
    params.callback = 'qq_' + new Date().getTime()
    window[params.callback] = (result) => {
      clearTimeout(timer)
      resolve(result)
    }
    Object.keys(params).map((item) => {
      p += item + '=' + params[item] + '&'
    })
    p += 'key=' + QQ_MAP_KEY + '&output=jsonp'
    oscript.src = 'https://apis.map.qq.com/ws/' + p
    oscript.type = 'text/javascript'
    document.head.appendChild(oscript)
    document.head.removeChild(oscript)
  })
}

/**
 * @description 综合定位方法
 * @param {boolean} [isGeocoder=false] 是否需要逆地址编码后的地址
 * @return {Promose<{province:string, city:string, district:string,street:string, neighborhood:string,township:string,latitude:string,longitude:string,areaCode:string, citycode:string,address:string}>}
 */
export const getLocation = async (isGeocoder = false) => {
  if (isInApp()) {
    try {
      return await getLocationByApp(isGeocoder)
    } catch (error) {
      return getLocationByQQMap(isGeocoder)
    }
  } else {
    return getLocationByQQMap(isGeocoder)
  }
}

/**
 * 浏览器H5定位
 * @param {Object} param 参数
 */
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          console.log('原生浏览器定位', coords)
          resolve(coords)
        },
        (err) => {
          console.log('原生浏览器失败', err)
          reject(err)
        },
        { enableHighAccuracy: true, timeout: 60000, maximumAge: 0 }
      )
    } else {
      console.log('浏览器不支持地理定位')
      reject()
    }
  })
}

export const initAmap = (cb) => {
  if (window.AMap) {
    cb()
  } else {
    window.initAmap = cb
    loader(`https://webapi.amap.com/maps?v=1.4.15&key=${GAODE_KEY}&callback=initAmap`)
  }
}

// 高德地图定位
export const getLocationByGaode = () => {
  return new Promise((resolve, reject) => {
    initAmap(_getlocation)
    function _getlocation() {
      window.AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 30000,
          extensions: 'base',
        })
        geolocation.getCurrentPosition((status, result) => {
          console.log('高德定位结果', result)
          if (status == 'complete') {
            const {
              addressComponent: { province, city, district, adcode, street, township, neighborhood },
              position,
              formattedAddress,
            } = result
            resolve({
              province,
              city,
              district,
              street,
              neighborhood,
              township,
              latitude: position.lat,
              longitude: position.lng,
              areaCode: adcode,
              citycode: adcode.substr(0, 4) + '00',
              address: formattedAddress,
            })
          } else {
            reject(result)
          }
        }, reject)
      })
    }
  })
}

// https://lbs.qq.com/webApi/component/componentGuide/componentGeolocation
// 腾讯定位api
export const getLocationByQQMap = (isGeocoder = true) => {
  return new Promise((resolve, reject) => {
    function _getlocation() {
      const geolocation = new window.qq.maps.Geolocation(QQ_MAP_KEY, '万顺叫车-H5')
      geolocation.getLocation(
        (location) => {
          console.log('腾讯定位', location)
          if (isGeocoder) {
            geocoderByQQMap(location)
              .then((res) => resolve(res))
              .catch(reject)
          } else {
            resolve(location)
          }
        },
        reject,
        { timeout: 30000 }
      )
    }
    if (window.qq) {
      _getlocation()
    } else {
      // loader(`https://apis.map.qq.com/tools/geoLocation/min?key=${QQ_MAP_KEY}&referer=wsjc`, _getlocation)
      loader('https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js', _getlocation)
    }
  })
}

// 判断是否在万顺app内部
export function isInApp() {
  return !!(window.ws || window.Activity || (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.userInfo))
}
// 调用app端定位方法,需要app授权后才会定位成功, 授权后第一次会失败
/**
 * @param {boolean} [isGeocoder=true]
 * @return {Promose<{province:string, city:string, district:string, street:string, neighborhood:string,township:string,latitude:string,longitude:string,areaCode:string, citycode:string,address:string}>}
 */
export const getLocationByApp = async (isGeocoder = true) => {
  try {
    let location = await call('getLocation', { type: 2 }, 'getLocation')
    console.log('原生app定位结果', location)
    if (isGeocoder) {
      // 老版本可能数据不全，自行解析经纬度
      return geocoderByGaode(location)
    }
    return { ...location, citycode: location.areaCode.substr(0, 4) + '00' }
  } catch (error) {
    console.log('执行app定位方法失败');
    return Promise.reject(error)
  }
}

// 腾讯地图逆地理编码
// https://lbs.qq.com/service/webService/webServiceGuide/webServiceGcoder
export const geocoderByQQMap = ({ lat, lng }) => {
  return new Promise((resolve, reject) => {
    qqRequest({
      url: 'geocoder/v1/',
      location: [lat, lng].join(','),
      get_poi: 0,
    })
      .then(({ status, result }) => {
        console.log('腾讯逆地理编码', result)
        if (status == 0) {
          const {
            ad_info: { adcode, province, city, district },
            address_component: { street },
            formatted_addresses: { recommend },
            location: { lat: latitude, lng: longitude },
            address_reference,
            address,
          } = result
          let township = ''
          if (address_reference && address_reference.town) {
            township = address_reference.town.title
          }
          resolve({
            province,
            city,
            district,
            street,
            neighborhood: '',
            township,
            latitude,
            longitude,
            areaCode: adcode,
            citycode: adcode.substr(0, 4) + '00',
            address: recommend || address,
          })
        } else {
          reject()
        }
      })
      .catch(() => {
        reject()
      })
  })
}

// https://lbs.amap.com/api/webservice/guide/api/georegeo
// 高德地图逆地理编码
export const geocoderByGaode = async ({ longitude, latitude }) => {
  return new Promise((resolve, reject) => {
    initAmap(getAddress)
    function getAddress() {
      AMap.plugin('AMap.Geocoder', () => {
        // { extensions: 'all' }
        const geocoder = new AMap.Geocoder()
        geocoder.getAddress([longitude, latitude], (status, result) => {
          console.log('高德逆地理编码', result)
          if (status === 'complete' && result.info === 'OK') {
            const {
              addressComponent: { province, city, district, adcode, township, neighborhood },
              formattedAddress,
            } = result.regeocode
            resolve({
              province,
              city,
              district,
              neighborhood,
              township,
              latitude,
              longitude,
              areaCode: adcode,
              citycode: adcode.substr(0, 4) + '00',
              address: formattedAddress,
            })
          } else {
            reject()
          }
        })
      })
    }
  })
}
