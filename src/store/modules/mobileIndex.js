
import { mobileIndex } from '@/api/index'
const state = {
    pagesConfig: {},
};
const getters = {
    pagesConfig: state => state.pagesConfig,
};
const mutations = {
    UPDATE_PAGES_CONFIG: (state, data) => {
        state.pagesConfig = data
    }
};
const actions = {
    //   this.$store.dispatch('MOBILE_INDEX/findMobileIndex',0)调用存储方法
    findMobileIndex ({ commit }, storeId) {
        return new Promise((resolve, reject) => {
            mobileIndex(storeId).then(response => {
                if (response.code === 200) {
                    // console.log(response, 222222222);
                    commit('UPDATE_PAGES_CONFIG', response.data)
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
};

export default {
    namespaced: true, // 模块独立
    state,
    getters,
    mutations,
    actions,
};
