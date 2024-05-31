'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
let NODE_ENV = process.env.NODE_ENV
module.exports = merge(prodEnv, {
  NODE_ENV: `"${NODE_ENV}"`,
  BASE_API: `"https://api-${NODE_ENV}.wsfmall.com/api/mobile"`,
  VUE_APP_BASE_API_SERVE: `"https://wssvc-${NODE_ENV}.wsecar.com/api/orgManager"`,
  UPLOAD_API: `"https://api-${NODE_ENV}.wsfmall.com/api/mobile/uploadToQqOSSYun"`,
  BASE_API_SERVE: `"https://promoterapp-${NODE_ENV}.wsecar.com"`,
  // 精英小程序
  VUE_APP_ELITEVIPAPI_API: `"https://elitevipapi-${NODE_ENV}.wsecar.com"`,
  SMART_API_SERVE: `"https://smartlife-${NODE_ENV}.wsfsmart.com"`,
  // 智慧生活页面请求域名
  SMART_PAGE_DOMAIN: `"https://smartlife-h5-${NODE_ENV}.wsfsmart.com"`,
})
