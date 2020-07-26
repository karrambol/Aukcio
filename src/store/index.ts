import Vue from 'vue';
import Vuex from 'vuex';
import { RootModule } from './modules';
import { createVuexStore } from 'vuex-simple';

Vue.use(Vuex);

const instance = new RootModule();

export default createVuexStore(instance, {
  strict: true,
  modules: {},
  plugins: []
});
