import { checkSpuOrSku } from '@/api/backorderlist'

const state = {
  exchangeGoodsScorllTop: 0,
  loadExchangeGoodsData: false,
  exchangeSkuCanUseFlag: false,
  exchangeGoodsPageData: {}
}
const mutations = {
  SET_EXCHANGE_GOODS_SCORLL_TOP: (state, data) => {
    state.exchangeGoodsScorllTop = data
  },
  SAVA_EXCHANGE_GOODS_PAGE_DATA: (state, data) => {
    state.exchangeGoodsPageData = data
  },
  LOAD_EXCHANGE_GOODS_DATA: (state, data) => {
    state.loadExchangeGoodsData = data
  },
  CHECK_EXCHANGE_SKU_OR_SPU: (state, data) => {
    state.exchangeSkuCanUseFlag = data
  },
}
const actions = {
  setExchangeGoodsScorllTop({commit}, data){
    commit('SET_EXCHANGE_GOODS_SCORLL_TOP', data)
  },
  saveExchangeGoodsPageData({commit}, data){
    commit('SAVA_EXCHANGE_GOODS_PAGE_DATA', data)
  },
  // 换货申请时校验商品
  checkExchangeSkuOrSpu({ commit }, data){
    return new Promise((resolve, reject) => {
      let flag = false
      checkSpuOrSku(data).then(res => {
        if (res.code == 200) {
          flag = true
        } else {
          flag = false
        }
        commit('CHECK_EXCHANGE_SKU_OR_SPU', flag)
        resolve(res)
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
  actions,
}
