<template>
  <div class="background-flame flame invisible-flame" id="background-flame">
    <div class="background-flame-inner flame" id="background-flame-inner">
      <div class="background-flame-inner2 flame" id="background-flame-inner2">
        <div class="background-flame-inner3 flame" id="background-flame-inner3"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Flame',
  created () {
    setInterval(this.cashFlow, 500)
  },
  beforeDestroy () {
    clearInterval(this.cashFlowInterval)
    this.flameInvisTimers.forEach(el => clearTimeout(el))
  },
  data () {
    return {
      cashFlowInterval: null,
      flameTime: 60000,
      currentFlameIntense: 0,
      flameInvisTimers: []
    }
  },
  computed: {
    bankHistory: {
      get () {
        return this.$store.getters.bankHistory
      }
    },
    bank: {
      get () {
        return this.$store.getters.bank
      }
    },
    maxPrice: {
      get () {
        return this.$store.getters.maxPrice
      }
    }
  },
  methods: {
    bankAgo () {
      const filteredArray = this.bankHistory.filter(
        (el, i, arr) => el.date <= new Date(new Date().getTime() - this.flameTime) || i === 0
      )
      return filteredArray[filteredArray.length - 1].bank
    },
    cashFlow () {
      const delta2 = this.bankHistory[this.bankHistory.length - 1].bank - this.bankAgo()
      if (this.maxPrice >= 10000) {
        if (this.currentFlameIntense !== 100) this.flameIntense(100)
      } else {
        const derivative = delta2 / 60
        if (this.currentFlameIntense !== (100 * derivative) / 150) {
          this.flameIntense((100 * derivative) / 150)
        }
      }
    },
    flameIntense (intense) {
      if (this.currentFlameIntense - intense <= 0) {
        document.getElementById('background-flame').classList.add('fast')
        document.getElementById('background-flame-inner').classList.add('fast')
        document.getElementById('background-flame-inner2').classList.add('fast')
        document.getElementById('background-flame-inner3').classList.add('fast')
      } else {
        document.getElementById('background-flame').classList.remove('fast')
        document.getElementById('background-flame-inner').classList.remove('fast')
        document.getElementById('background-flame-inner2').classList.remove('fast')
        document.getElementById('background-flame-inner3').classList.remove('fast')
      }
      this.currentFlameIntense = intense
      if (intense <= 10) {
        intense = 0
        this.flameInvisTimers.push(
          setTimeout(() => {
            document.getElementById('background-flame').classList.add('invisible-flame')
          }, 5500)
        )
      } else {
        this.flameInvisTimers.forEach(el => clearTimeout(el))
        document.getElementById('background-flame').classList.remove('invisible-flame')
        this.flameInvisTimers = []
        if (intense <= 30) {
          intense = intense * 2 + 10
        } else {
          intense = (intense * 4) / 7 + 70 - 17
        }
      }
      if (intense < 0) {
        intense = 0
      }
      if (intense > 100) {
        intense = 100
      }
      const pos = 90 - 90 * (intense / 100)
      const x = 12
      document.getElementById('background-flame').style = 'background-position-y: ' + pos + 'vh'
      document.getElementById('background-flame-inner').style =
        'background-position-y: ' + (pos + 2 * x) + 'vh'
      document.getElementById('background-flame-inner2').style =
        'background-position-y: ' + (pos + 4 * x) + 'vh'
      document.getElementById('background-flame-inner3').style =
        'background-position-y: ' + (pos + 6 * x) + 'vh'
    }
  }
}
</script>
<style language="scss" scoped>
.fast {
  transition-property: background-position-y;
  transition-duration: 2s !important;
  transition-timing-function: cubic-bezier(0.29, 2.57, 0.37, 0.74) !important;
}
.invisible-flame {
  opacity: 0;
}
.flame {
  background-image: url('../assets/img/flame.gif');
  overflow: visible;
  background-size: 90vh;
  background-repeat: repeat-x;
  width: 100%;
  height: 100%;
  border: 0;
  position: fixed;
  transition-property: background-position-y;
  transition-duration: 5s;
  transition-timing-function: linear;
}
.background-flame {
  z-index: 1;
  background-position-x: 0vh;
  background-position-y: 90vh;
}
.background-flame-inner {
  background-position-x: 15vh;
  background-position-y: 140vh;
}
.background-flame-inner2 {
  background-position-x: 30vh;
  background-position-y: 190vh;
}
.background-flame-inner3 {
  background-position-x: 45vh;
  background-position-y: 240vh;
}
</style>
