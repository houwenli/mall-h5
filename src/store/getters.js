const getters = {
  token: state => state.user.token,
  userId: state => state.user.userInfo.id,
  userInfo: state => state.user.userInfo,
  distrInfo: state => state.distrInfo,
  getDistribution: state => state.isDistribution,
  getDistributionPer:state => state.isDistributionPer,
  getUserSource: state => state.userSource,
  getThematicPost: state => state.isShowThematicPost,
  getRegistrationProtocol: state => state.registrationProtocol,
  phoneType: state => state.isAndroid,

  contentList:state => state.HOME_PAGE_CONFIG.contentList,
  floatBtnData:state => state.HOME_PAGE_CONFIG.floatBtnData,
  headerData:state => state.HOME_PAGE_CONFIG.headerData,
  // TODO: 废弃-带迁移完分销首页后去掉
  pageNavData:state => state.HOME_PAGE_CONFIG.pageNavData,
  tabData:state => state.HOME_PAGE_CONFIG.tabData,
  popupWindowConfigData: state => state.HOME_PAGE_CONFIG.popupWindowConfigData,
  popupWindowIsShow: state => state.HOME_PAGE_CONFIG.popupWindowIsShow,
  scorllTop: state => state.HOME_PAGE_CONFIG.scorllTop,
  exchangeGoodsScorllTop: state => state.AFTER_SALES_CONFIG.exchangeGoodsScorllTop,
  exchangeGoodsPageData: state => state.AFTER_SALES_CONFIG.exchangeGoodsPageData,
  loadExchangeGoodsData: state => state.AFTER_SALES_CONFIG.loadExchangeGoodsData,
  exchangeSkuCanUseFlag: state => state.AFTER_SALES_CONFIG.exchangeSkuCanUseFlag,
  isShowHomePageConfig: state => state.HOME_PAGE_CONFIG.isShowHomePageConfig,
  notLogInUid: state => state.notLogInUid,
  orderLastTotalPriceCopy: state => state.orderLastTotalPriceCopy,

  isApiNoAuth: state => state.RES_INTERCEPTOR.isApiNoAuth, // 判断接口是否401，在页面入口处重置
}
export default getters
