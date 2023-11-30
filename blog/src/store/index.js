import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  getters: {
    isLoggedIn(state) {
      return state.user != null;
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
