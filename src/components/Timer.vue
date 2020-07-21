<template>
  <div class="timer-row">
    <div class="wasted">
      <div>
        Потрачено время: <span class="wasted-time">{{ wastedTimeString }}</span>
      </div>
      <div>
        Банк: <span class="wasted-bank">{{ bank }}</span>
      </div>
    </div>
    <div class="timer-container">
      <div class="timer-top timer-line">
        <button v-if="isGoing" v-on:click="stop()" class="button-start">
          СТОП
        </button>
        <button v-else v-on:click="start()" class="button-start">СТАРТ</button>
        <div class="time-container">
          <div class="time">
            {{ minutes }}:{{ seconds }}<span>.{{ milliseconds }}</span>
          </div>
        </div>
        <button v-on:click="clear()" class="button-clear">СБРОС</button>
      </div>

      <div class="timer-bot timer-line">
        <button v-on:click="addSmall()" class="timer-button">+1</button>
        <button v-on:click="addBig()" class="timer-button">+2</button>
        <button v-on:click="setEven()" class="timer-button">=10</button>
        <button v-on:click="subSmall()" class="timer-button">-1</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Timer',
  data () {
    return {
      isGoing: false,
      duration: 10 * 60000,
      currentTime: 10 * 60000,
      elapsed: 0,
      wasted: 0,
      aukStart: window.performance.now(),
      frame: 0,
      tick: 62,
      timeoutID: 0
    }
  },
  created () {
    const _this = this // eslint-disable-line @typescript-eslint/no-this-alias
    this.aukStart = window.performance.now()
    function timeWasted () {
      return window.performance.now() - _this.aukStart
    }
    function wastedCount () {
      _this.frame = window.requestAnimationFrame(wastedCount)
      _this.wasted = timeWasted()
    }
    wastedCount()
  },
  computed: {
    bank: {
      get () {
        return this.$store.getters.bank
      }
    },
    wastedTimeString: {
      get () {
        return `${String(Math.floor(this.wasted / 3600000)).padStart(
          2,
          '0'
        )}:${String(Math.floor((this.wasted % 3600000) / 60000)).padStart(
          2,
          '0'
        )}:${String(Math.floor((this.wasted % 60000) / 1000)).padStart(2, '0')}`
      }
    },
    minutes: {
      get () {
        return String(Math.floor(this.currentTime / 60000)).padStart(2, '0')
      }
    },
    seconds: {
      get () {
        return String(Math.floor((this.currentTime % 60000) / 1000)).padStart(
          2,
          '0'
        )
      }
    },
    milliseconds: {
      get () {
        return String(Math.floor(this.currentTime % 1000)).padStart(3, '0')
      }
    }
  },
  methods: {
    start: function () {
      if (this.currentTime > 0) {
        let lastTime = window.performance.now()
        const _this = this // eslint-disable-line @typescript-eslint/no-this-alias
        this.isGoing = true
        ;(function update () {
          if (_this.isGoing) {
            const time = window.performance.now()
            _this.elapsed += Math.min(
              time - lastTime,
              _this.duration - _this.elapsed
            )
            lastTime = time
            _this.timeoutID = setTimeout(update, _this.tick)
            _this.currentTime = _this.duration - _this.elapsed
            if (_this.currentTime <= 0) {
              _this.stop()
            }
          } else {
            _this.stop()
          }
        })()
      }
    },
    stop () {
      clearTimeout(this.timeoutID)
      this.timeoutID = undefined
      this.isGoing = false
    },
    clear () {
      this.stop()
      this.duration = 0
      this.elapsed = 0
      this.currentTime = 0
    },
    addSmall () {
      this.duration += 1000 * 60
      this.currentTime = this.duration - this.elapsed
    },
    addBig () {
      this.duration += 2000 * 60
      this.currentTime = this.duration - this.elapsed
    },
    setEven () {
      this.elapsed = 0
      this.duration = 10000 * 60
      this.currentTime = this.duration - this.elapsed
    },
    subSmall () {
      const newDuration = this.duration - 1000 * 60
      const newCurrentTime = newDuration - this.elapsed
      if ((newDuration > 0) & (newCurrentTime > 0)) {
        this.duration = newDuration
        this.currentTime = newCurrentTime
      } else {
        this.clear()
      }
    }
  }
}
</script>

<style scoped>
.timer-row {
  /* flex-grow: 1;
    flex-shrink: 1;
    align-self: stretch; */
  width: 400px;
  color: #fff;
  padding: 0 20px;
  z-index: 100;
}
/* @media screen and (max-width:600px) {
    .timer-row {
      max-width: 100vw;
    }
  } */
.timer-container {
  flex-grow: 1;
  flex-shrink: 1;
  line-height: 1;
  background-color: transparent;
  max-width: 400px;
  min-width: 400px;
  margin-top: 20px;
  text-shadow: 3px 3px 0 black;
}
button {
  border: none;
  color: white;
  border: none;
}
.timer-button {
  height: 35px;
  width: 85px;
  font-size: 20px;
  /* border: 3px solid #343a40; */
  border-radius: 5px;
  color: white;
  background-color: #343a40;
}
.timer-button:hover {
  background-color: black;
  /* box-shadow: none; */
  color: white;
}
.timer-line {
  font-size: 20px;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timer-top {
  padding: 10px 0;
}
.button-start {
  background-color: #28a745;
  border: 2px solid #28a745;
  border-radius: 50%;
  height: 64px;
  width: 64px;
}
.button-start:hover {
  border: 3px solid #218838;
  background-color: #218838;
}
.button-clear {
  background-color: #db3b21;
  border-radius: 50%;
  height: 64px;
  width: 64px;
}
.button-clear:hover {
  background-color: #a8321e;
}
.time-container {
  text-align: center;
  margin: -4px 0px;
}
.time {
  display: inline-block;
  font-size: 76px;
  /* text-shadow: 5px 3px 0 black; */
  /* font-family: 'Roboto', sans-serif; */
}
.time span {
  font-size: 48px;
}
.wasted {
  color: black;
  text-align: end;
  padding: 1rem 0;
  padding-bottom: 0px;
  display: flex;
  justify-content: space-between;
}
@media screen and (max-width: 1207px) {
  .timer-row {
    margin-left: auto;
    margin-right: auto;
    max-width: 400px;
    width: 100%;
    flex-shrink: 1;
    align-content: center;
  }
}
@media screen and (max-width: 450px) {
  .timer-row {
    width: 100vw;
    padding: 0;
    margin: 0;
  }
  .wasted,
  .timer-line {
    width: calc(100vw - 20px);
    padding-right: 10px;
    padding-left: 10px;
  }
  .timer-button {
    width: 18%;
  }
  .time {
    font-size: 50px;
  }
  .time span {
    font-size: 35px;
  }
}
</style>