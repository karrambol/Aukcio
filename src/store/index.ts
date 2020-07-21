import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import tableData from './modules/tableData'
import auth from './modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tableData,
    auth
  }
})
