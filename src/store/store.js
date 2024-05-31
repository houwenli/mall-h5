import Vue from "vue"
import Vuex from "vuex"
import user from '@/store/modules/user'
import MOBILE_INDEX from '@/store/modules/mobileIndex'
import HOME_PAGE_CONFIG from '@/store/modules/homePageConfig'
import AFTER_SALES_CONFIG from '@/store/modules/afterSalesConfig'
import BURIED_POINT from '@/store/modules/buriedPoint'
import RES_INTERCEPTOR from '@/store/modules/resInterceptor'
import getters from "./getters"
import {stopBodyScroll} from '@/utils/utils'
Vue.use(Vuex);


const store = new Vuex.Store({

    // 全局访问的state对象
    state: {
        //分销员信息
        distrInfo:{},
        // 是否是分销员
        isDistributionPer:false,
        // 是否有分销权限
        isDistribution: false,
        // 判断手机型号
        isAndroid: 'Android',
        //用户来源
        userSource: 3, // 1:乘客端，2：车主端，3：H5
        newUserSource: 4,
        //展示过专题海报弹窗
        isShowThematicPost: false,
        // 控制乘客端授权弹窗
        registrationProtocol:false,
        //未登录生成的uid
        notLogInUid: '',
        orderLastTotalPriceCopy:0,// 确认订单页结算金额
    },

    // 唯一修改state的方法
    mutations: {
        SET_DISTRINFO (state, data){
            state.distrInfo = data
        },
      ORDER_LAST_TOTAL_PRICE_COPY (state, data){
        state.orderLastTotalPriceCopy = data
      },
        // 改变权限
        OPERATION_DISTRIBUTION (state, data) {
            state.isDistribution = data
        },
        // 改变是否是分销员权限
        OPERATION_DISTRIBUTIONPER (state, data) {
            state.isDistributionPer = data
        },
        // 手机型号
        SET_PHONETYPE (state, phoneType) {
            state.isAndroid = phoneType
        },
        SET_USERSOURCE (state, data) {
            state.userSource = data
        },
        SET_THEMATICPOST (state, data) {
            state.isShowThematicPost = data
        },
        SET_REGISTRATIONPROTOCOL(state,data){
            stopBodyScroll(data)
            state.registrationProtocol = data
        },
        SET_NOTLOGINUID(state,data) {
            state.notLogInUid = data
        },
        SET_NEWUSERSOURCE (state, source) {
            state.newUserSource = source
        },
    },

    // 提交mutations
    actions: {
      orderLastTotalPriceCopy({commit},data){
        commit('ORDER_LAST_TOTAL_PRICE_COPY',data)
      },
        editDistribution ({ commit }, data) {
            commit('OPERATION_DISTRIBUTION', data)
        },
        setDistributionPer({ commit }, data){
            commit('OPERATION_DISTRIBUTIONPER', data)
        },
        setDistrInfo({ commit }, data){
            commit('SET_DISTRINFO', data)
        },
        setPhoneType ({ commit }) {
            let phoneType = ''
            let u = navigator.userAgent
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //判断是否是 android终端
            let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //判断是否是 iOS终端
            console.log('是否是Android：' + isAndroid) //true,false
            console.log('是否是iOS：' + isIOS)
            if (isAndroid) {
                phoneType =  'Android'
            } else if (isIOS) {
                phoneType = 'IOS'
            } else {
                phoneType = 'PC'
            }
            commit('SET_PHONETYPE', phoneType)
        },
        // 获取用户来源
        setUserSource ({ commit }, data) {
            commit('SET_USERSOURCE', data)
        },
        // 设置展示专题海报
        setThematicPost ({ commit }, data) {
            commit('SET_THEMATICPOST', data)
        }
    },

    // 实时监听state值得变化（最新状态）
    getters,
    modules: {
        user,
        MOBILE_INDEX,
        HOME_PAGE_CONFIG,
        AFTER_SALES_CONFIG,
        BURIED_POINT,
        RES_INTERCEPTOR
    },

})

export default store
