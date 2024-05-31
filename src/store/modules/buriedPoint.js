import { advertVisit, shareVisit } from '@/api/buriedPoint.js'

const state = {

}

const mutations = {

}
const actions = {
  advertVisitRequest({common}, params){
    advertVisit(params).then(() => {}).catch(err => {})
  },
  shareVisitRequest({common}, params){
    shareVisit(params).then(() => {}).catch(err => {})
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
