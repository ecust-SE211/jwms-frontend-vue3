import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userType: null // 初始时没有用户类型
  },
  mutations: {
    setUserType(state, userType) {
      state.userType = userType
    }
  },
  modules: {
    app,
    settings,
    user,
    tagsView
  },
  getters
})

export default store
