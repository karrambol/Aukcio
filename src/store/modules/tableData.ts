// interface Lot {
//   id: number
//   title: string
//   p: string | number
//   add: string | number
// }
// class Lot implements Lot {
//   public id: number,
//     public title: string,
//     public p: string | number,
//     public add: string | number
//   constructor (
//     public id: number,
//     public title: string,
//     public p: string | number,
//     public add: string | number
//   ) {}
// }

export default {
  state: {
    log: [
      {
        lots: [
          {
            id: 0,
            title: '',
            p: '',
            add: ''
          },
          {
            id: 1,
            title: '',
            p: '',
            add: ''
          },
          {
            id: 2,
            title: '',
            p: '',
            add: ''
          },
          {
            id: 3,
            title: '',
            p: '',
            add: ''
          }
        ],
        bankHistory: [{ date: new Date(0), bank: 0 }],
        previousPosition: undefined,
        nextPosition: undefined
      }
    ],
    lots: [
      {
        id: 0,
        title: '',
        p: '',
        add: ''
      },
      {
        id: 1,
        title: '',
        p: '',
        add: ''
      },
      {
        id: 2,
        title: '',
        p: '',
        add: ''
      },
      {
        id: 3,
        title: '',
        p: '',
        add: ''
      }
    ],
    bankHistory: [{ date: new Date(0), bank: 0 }],
    currentPosition: 0
  },
  getters: {
    tableData: state => state.lots,
    bank: state =>
      Math.round(
        state.lots.reduce((acc, el) => {
          acc += 1 * el.p
          return acc
        }, 0) * 100
      ) / 100,
    bankHistory: state => state.bankHistory,
    maxPrice: state => state.lots[0].p,
    armageddonPrice: state => {
      return (
        state.lots.reduce((acc, el) => {
          acc += 1 * el.p
          return acc
        }, 0) * 0.5
      ).toFixed(2)
    },
    communismPrice: state => {
      return (
        state.lots.reduce((acc, el) => {
          acc += 1 * el.p
          return acc
        }, 0) * 0.5
      ).toFixed(2)
    },
    activeLots: state => {
      const rez = state.lots.reduce((acc, el, i, arr) => {
        if (!isNaN(parseFloat(el.p)) && el.p !== '') acc++
        return acc
      }, 0)
      console.log(rez)
      return rez
    },
    is666: state => {
      return function (id) {
        return parseInt(state.lots[id].add) === 666
      }
    }
  },
  mutations: {
    setTableData: function (state, value) {
      state.state.lots = value
    },
    setTitle: function (state, { id, value }) {
      state.lots[id].title = value
    },
    setP: function (state, { id, value }) {
      state.lots[id].p = value
      if (
        state.lots.length !== undefined &&
        state.lots[state.lots.length - 1].p !== ''
      ) {
        this.dispatch('push')
      }
    },
    setAdd: function (state, { id, value }) {
      state.lots[id].add = value
    }
  },
  actions: {
    push (state, data) {
      state.state.lots = [
        ...state.state.lots,
        {
          id: state.state.lots.length,
          title: '',
          p: '',
          add: ''
        }
      ]
    },
    sort (state) {
      state.state.lots = state.state.lots.sort((a, b) => b.p - a.p)
      state.dispatch('createSnapShot')
    },
    add (state, id) {
      const add = parseFloat(state.state.lots[id].add)
      const p =
        state.state.lots[id].p === '' ? 0 : parseFloat(state.state.lots[id].p)
      if (!isNaN(p) && !isNaN(add) && add !== 0) {
        state.state.lots[id].p = p + add
        state.state.lots[id].add = ''
      }
      state.dispatch('sort')
      state.dispatch('updateBankHistory')
    },
    updateBankHistory (state) {
      if (
        state.getters.bank !==
        state.state.bankHistory[state.state.bankHistory.length - 1].bank
      ) {
        state.state.bankHistory.push({
          date: new Date(),
          bank: state.getters.bank
        })
      }
    },
    createSnapShot (state) {
      const snapShot = {
        lots: state.state.lots.map(el => ({ ...el })),
        bankHistory: state.state.bankHistory.map(el => ({ ...el })),
        previousPosition: state.state.currentPosition
      }
      state.state.log.push(snapShot)
      const newPos = state.state.log.length - 1
      state.state.log[state.state.currentPosition].nextPosition = newPos
      state.state.currentPosition = newPos
    },
    undo (state) {
      const prevPos =
        state.state.log[state.state.currentPosition].previousPosition
      if (prevPos !== undefined) {
        state.state.currentPosition = prevPos
        state.state.lots = state.state.log[prevPos].lots.map(el => ({ ...el }))
        state.state.bankHistory = state.state.log[prevPos].bankHistory.map(
          el => ({ ...el })
        )
      }
    },
    redo (state) {
      const nextPos = state.state.log[state.state.currentPosition].nextPosition
      if (nextPos) {
        state.state.currentPosition = nextPos
        state.state.lots = state.state.log[nextPos].lots.map(el => ({ ...el }))
        state.state.bankHistory = state.state.log[nextPos].bankHistory.map(
          el => ({ ...el })
        )
      }
    },
    armageddon (state) {
      state.state.lots = state.state.lots.map(el => {
        let rez
        if (!isNaN(parseFloat(el.p)) && el.p !== '') {
          rez = Math.round((el.p / 2) * 100) / 100
        } else rez = el.p
        return { ...el, p: rez }
      })
      state.dispatch('sort')
    },
    communism (state) {
      state.state.lots = state.state.lots.map(el => {
        let rez
        if (!isNaN(parseFloat(el.p)) && el.p !== '') {
          rez =
            Math.round((state.getters.bank / state.getters.activeLots) * 100) /
            100
        } else rez = el.p
        return { ...el, p: rez }
      })
      state.dispatch('sort')
    }
  }
}
