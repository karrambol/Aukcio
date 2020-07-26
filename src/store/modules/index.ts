import { TableData } from './TableData';
import { Auth } from './auth';
import { Module } from 'vuex-simple';

export class RootModule {
  @Module()
  Auth = new Auth();

  @Module()
  TableData = new TableData();
}
