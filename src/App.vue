<template>
  <div id="app" :style="appStyle">
    <p id="amount" v-bind:class="{ visible: getAmountVisible }">666</p>
    <div class="wrapper">
      <router-view v-on:bloody="bloodyHandler" v-on:add="addHandler" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
class App extends Vue {
  mainColor = '#009688';
  bloodyColor = '#c3332b';
  isBloody = false;
  timeoutID = 0;
  amountVisible = false;
  daemonVoice = (function () {
    const audio = new Audio();
    audio.src = require('./assets/audio/daemon_voice.mp3');
    return function () {
      audio.play();
    };
  })();

  get getAmountVisible () {
    return this.amountVisible;
  }

  get appStyle () {
    return {
      '--bgc': this.isBloody ? this.bloodyColor : this.mainColor
    };
  }

  get background () {
    return {
      background: `url(./assets/img/background_transparent.png), ${
        this.isBloody ? this.bloodyColor : this.mainColor
      } !important`,
      'background-blend-mode': 'multiply'
    };
  }

  bloodyHandler (bloodyLevel: number) {
    if (bloodyLevel >= 3 && this.timeoutID === 0) {
      this.isBloody = true;
      this.daemonVoice();
      clearTimeout(this.timeoutID);
      this.timeoutID = setTimeout(() => {
        this.isBloody = false;
        this.timeoutID = 0;
      }, 20 * 60 * 1000);
    } else if (bloodyLevel >= 3) {
      clearTimeout(this.timeoutID);
      this.timeoutID = this.timeoutID = setTimeout(() => {
        this.isBloody = false;
        this.timeoutID = 0;
      }, 20 * 60 * 1000);
    }
  }

  setAmountVisible (value: boolean) {
    this.amountVisible = value;
  }

  addHandler (amount: string) {
    const set = this.setAmountVisible;
    if (amount === '666') {
      set(true);
      setTimeout(() => {
        set(false);
      }, 500);
    }
  }
}
export default App;
</script>

<style>
#amount {
  position: absolute;
  font-size: 250px;
  color: black;
  z-index: 150;
  line-height: 100%;
  margin-left: calc(50% - 150px);
  transition: 500ms;
  opacity: 0;
  pointer-events: none;
}
p#amount.visible {
  opacity: 1;
}
html {
  max-height: 100vh;
  overflow: hidden;
}
button:hover {
  cursor: pointer;
}
body {
  overflow: hidden;
  margin: 0;
  max-height: 100%;
  font-family: 'Source Sans Pro', sans-serif;
}
input {
  outline: none;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  box-shadow: 3px 3px 0 black;
}
button {
  outline: none;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px solid;
  box-shadow: 3px 3px 0 black;
}
#app {
  text-align: center;
  background: url(./assets/img/background_transparent.png), var(--bgc);
  background-blend-mode: multiply;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  max-height: 100%;
  font-size: 18px;
  /* --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: "Menlo", "DejaVu Sans Mono", "Liberation Mono", "Consolas", "Ubuntu Mono", "Courier New", "andale mono", "lucida console", monospace; */
}
</style>
