export const USER_SOURCE = {
  passenger: 1, // 乘客端
  driver: 2, // 司机端
  wscloud: 3, // 万顺云
  designatedDrver: 2, // 代驾和司机端共用
  wsmall: 4, // 商城
  // promoter: 8, // 推广员
  smartLife: 11, // 智慧生活
}

export const CHANNEL_CODE = {
  passenger: 6, // 乘客端
  driver: 5, // 司机端
  wscloud: 15, // 万顺云
  wsmall: 2, // 商城
  // promoter: 8888, // 推广员
  designatedDrver: 5, // 代驾 和司机端公用
  smartLife: 2, // 智慧生活
}

// 业务线
export const BIZLINE = {
  smartLife: 'SMART_LIFE', // 智慧生活
  wsfMall: 'WSF_MALL', // 万顺福电商
  mobileRecharge: 'MOBILE_RECHARGE', // 话费充值
}

// 系统平台
export const SYSPLATFORM = {
  android: 1, // 安卓
  ios: 2, // ios
  h5: 3, // h5
  xcx: 5, // 小程序
}
export const SYSPLATFORMMAP = {
  [SYSPLATFORM.android]: 'ANDROID',
  [SYSPLATFORM.ios]: 'IOS',
  [SYSPLATFORM.h5]: 'HTML',
  [SYSPLATFORM.xcx]: 'WX_SMALL_PROGRAM',
}

// 登录类型
// PASSWORD(1, "密码"), SMS(2, "短信验证码"), TOKEN(3, "令牌"), UNAUTH(4, "免密登录")
export const SIGNINTYPE = {
  messAuth: 'SMS',
  token: 'TOKEN'
}

// 验证码类型
// 可用值:SIGN_IN,SIGN_OUT,BIND_BANK_CARD,WITHDRAW,MODIFY_PHONE
export const SMSCODETYPE = {
  signIn: 'SIGN_IN',
  modifPhone: 'MODIFY_PHONE', // 修改手机号

}