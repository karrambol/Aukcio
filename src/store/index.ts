import Vue from 'vue';
import Vuex from 'vuex';
import { createStore, Module } from 'vuex-smart-module';
import { TableData } from './modules/TableData';
import { Auth } from './modules/auth';

Vue.use(Vuex);
const root = new Module({
  modules: {
    Auth,
    TableData
  }
});
export const store = createStore(
  root,

  {
    strict: process.env.NODE_ENV !== 'production'
  }
);
export default store;
