import axios from 'axios'

export default {
  state: {
    auth: false,
    id: null,
    notifResponse: null
  },

  mutations: {
    setAuth (state, data) {
      state.auth = data
    },
    setId (state, data) {
      state.id = data
    },
    setNotifResponse (state, data) {
      state.notifResponse = data
    }
  },

  getters: {
    getAuth: state => state.auth,
    getId: state => state.id,
    getNotifResponse: state => state.notifResponse
  },

  actions: {
    getAuth (context) {
      axios('/auth', {
        method: 'GET'
      })
        .then(response => {
          context.commit('setAuth', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    getId (context) {
      axios('/id', {
        method: 'GET'
      })
        .then(response => {
          context.commit('setId', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    sendNotification (context) {
      axios('/send/notification', {
        method: 'POST'
      })
        .then(response => {
          context.commit('setNotifResponse', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
