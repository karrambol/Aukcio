import { Module } from 'vuex-smart-module';
import { StateUnit } from '@/types';
import { TableDataMutations } from './mutations';
import { TableDataGetters } from './getters';
import { TableDataActions } from './actions';

export const TableData = new Module({
  state: StateUnit,
  getters: TableDataGetters,
  mutations: TableDataMutations,
  actions: TableDataActions,
  namespaced: false
});
