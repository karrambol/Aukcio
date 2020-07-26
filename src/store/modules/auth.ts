import axios from 'axios';
import { Mutation, State } from 'vuex-simple';

class AuthState {
  auth: boolean = false;
  id: number | null = null;
  notifResponse: null | any = null;
}

export class Auth {
  @State()
  state: AuthState = new AuthState();

  get getAuth () {
    return this.state.auth;
  }

  get getId () {
    return this.state.id;
  }

  get getNotifResponse () {
    return this.state.notifResponse;
  }

  @Mutation()
  setAuth (data: boolean) {
    this.state.auth = data;
  }

  @Mutation()
  setId (data: number) {
    this.state.id = data;
  }

  @Mutation()
  setNotifResponse (data: any) {
    this.state.notifResponse = data;
  }

  fetchAuth () {
    axios('/auth', {
      method: 'GET'
    })
      .then(response => {
        this.setAuth(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchId () {
    axios('/id', {
      method: 'GET'
    })
      .then(response => {
        this.setId(response.data);
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
        this.setNotifResponse(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
