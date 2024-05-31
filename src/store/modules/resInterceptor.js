// 响应拦截器相关
// 主要是为了阻止当接口401的时候多次请求
const state = {
  isApiNoAuth: false, // 判断接口是否401，在页面入口处重置
};
const getters = {
  isApiNoAuth: state => state.isApiNoAuth,
};
const mutations = {
  ALT_API_NOAUTH_STATUS(state, status) {
    state.isApiNoAuth = status
  }
};
const actions = {
  altApiNoAuthStatus({ commit }, status) {
    commit("ALT_API_NOAUTH_STATUS", status);
  },
};

export default {
    namespaced: true, // 模块独立
    state,
    getters,
    mutations,
    actions,
};

