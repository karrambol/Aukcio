import axios from 'axios';
import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';

class AuthState {
  auth: boolean = false;
  id: number | null = null;
  notifResponse: null | any = null;
}

class AuthGetters extends Getters<AuthState> {
  get getAuth () {
    return this.state.auth;
  }

  get getId () {
    return this.state.id;
  }

  get getNotifResponse () {
    return this.state.notifResponse;
  }
}
class AuthMutations extends Mutations<AuthState> {
  setAuth (data: boolean) {
    this.state.auth = data;
  }

  setId (data: number) {
    this.state.id = data;
  }

  setNotifResponse (data: any) {
    this.state.notifResponse = data;
  }
}

class AuthActions extends Actions<
  AuthState,
  AuthGetters,
  AuthMutations,
  AuthActions
> {
  getAuth () {
    axios('/auth', {
      method: 'GET'
    })
      .then(response => {
        this.commit('setAuth', response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getId () {
    axios('/id', {
      method: 'GET'
    })
      .then(response => {
        this.commit('setId', response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  sendNotification () {
    axios('/send/notification', {
      method: 'POST'
    })
      .then(response => {
        this.commit('setNotifResponse', response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export const Auth = new Module({
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions,
  namespaced: false
});
