import { mobileIndex, selectListPopupWindowConfig } from '@/api/index'
import Cookies from 'js-cookie'

const state = {
    contentList: [],
    floatBtnData:{},
    headerData:{
      // 顶部背景图/颜色配置
      headerBg: {
        color: '',
        img: '',
        // pic或者color
        type: ''
      },
      // 消息图标
      iconMassageUrl: '',
      slideshowImageList: [],
      // 页眉广告
      smallAdList: []
    },
    tabData:{},
    popupWindowConfigData:[],
    popupWindowIsShow: false,
    scorllTop: 0,
    isShowHomePageConfig: false, //数据是否已加载

    // TODO: 首页是没有使用到这个字段的，分销首页迁移完毕后，再移除掉即可
    pageNavData: {},

    // 首页-一级分类高亮索引 src\views\home\components\classify\index.vue
    classifyActiveTab: 0,

    // 一级分类 - 分类广告会使用这里的数据
    topCategoryList: [],

    // 底部tab刷新gif图显示变量
    gifTime: false,
    timeOut: null,

    // 一级分类对应的二级分类
    secondCategoryList: []
}
const mutations = {
    SCORLL_TOP: (state, data) => {
        state.scorllTop = data
    },

    QUERY_MOBILE_INDEX: (state, data) => {
        state.contentList = data.contentList

        state.headerData = data.headerData

        state.tabData = data.tabData
        state.isShowHomePageConfig = true
        if(Cookies.get('h5_floatBtn') !==undefined && Cookies.get('h5_floatBtn')==0) return
        state.floatBtnData = data.floatBtnData
        if(state.floatBtnData.showConfig){
          Cookies.set('floatBtnH5',1)
        }else{
          Cookies.set('floatBtnH5',0)
        }
    },
    POPUP_WINDOW_CONFIG_DATA (state, data){
        state.popupWindowConfigData = data
          if(Cookies.get('h5_PagePopUpWindow') !==undefined && Cookies.get('h5_PagePopUpWindow')==0) return
          if(state.popupWindowConfigData.length) {
            state.popupWindowIsShow = true
            Cookies.set('showedHomePagePopUpWindow', 1)
          }
    },
    POPUP_WINDOW_IS_SHOW(state, isShow){
        state.popupWindowIsShow = isShow
        let flag = isShow?1:0
        Cookies.set('showedHomePagePopUpWindow', flag)
    },
    FILTRATION: (state, data) => {
        state.floatBtnData.showConfig = data.showConfig
        let flag = data.isShow?1:0
        Cookies.set('floatBtnH5',flag)
    },

    updataTabData(state, payload){
      state.gifTime = true
      if (state.timeOut){
        clearTimeout(state.timeOut)
      }
      state.timeOut = setTimeout(() => {
        // console.log('-------------------20秒')
        state.gifTime = false
      }, 2000);

    }
}
const actions = {
    queryMobileIndex({commit}){
        mobileIndex().then(res => {
            if(res.code === 200){
                let data = JSON.parse(res.data.contentJson)
                // console.log(data,'****')
                commit('QUERY_MOBILE_INDEX',data)
            }
        })
    },
    popupWindowConfig({commit}){
        selectListPopupWindowConfig().then(res => {
            // console.log(res,'弹窗数据');
            if(res.code === 200&&res.data.length){
                let data = res.data ,arr = []
                for (let i = 0; i < data.length; i++) {
                    let {windowUrl,jumpAddress} = data[i];
                    arr.push({windowUrl,jumpAddress})
                }
                commit('POPUP_WINDOW_CONFIG_DATA',arr)
            }
        })
    },
    popupWindowConfigIsShow({commit},isShow){
        commit('POPUP_WINDOW_IS_SHOW',isShow)
    },
    filtration({ commit }, data){
        commit('FILTRATION', data)
    },
    setScorllTop({commit}, data){
        commit('SCORLL_TOP', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
  }
