import Vue from 'vue';
import Vuex from 'vuex';
import { createStore, Module } from 'vuex-smart-module';
import { TableData } from './modules/TableData';
import { Auth } from './modules/auth';

Vue.use(Vuex);
export const rootModule = new Module({
  modules: {
    Auth,
    TableData
  }
});
const store = createStore(
  rootModule,

  {
    strict: process.env.NODE_ENV !== 'production'
  }
);
export default store;
