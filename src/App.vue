<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';

@Component
class App extends Vue {
  mainColor = '#009688';
  bloodyColor = '#c3332b';
  isBloody = false;
  timeoutID = 0;
  amountVisible = false;
  currentTheme = 'classic';
  colorThemes: { [key: string]: { [key: string]: string } } = {
    classic: {
      '--main': '#009688',
      '--header-background': '#2e2e2e',
      '--header-text': '#fff',
      '--header-text-accent': '#657b83',
      '--main-text': '#fff',
      '--main-text-accent': '#000',
      '--main-inputs-background': '#d8d8d8',
      '--main-inputs-background-focus': '#fff',
      '--main-inputs-text': '#000',
      '--main-buttons-background': '#343a40',
      '--main-buttons-background-hover': '#000',
      '--main-buttons-text': '#fff'
    },
    dark: {
      '--main': '#023846',
      '--background': '',
      '--header-background': '#073642',
      '--header-text': '#839496',
      '--header-text-accent': '#000000',
      '--main-text': '#ccc',
      '--main-text-accent': '#839496',
      '--main-inputs-background': '#999',
      '--main-inputs-background-focus': '#ccc',
      '--main-inputs-text': '#000',
      '--main-buttons-background': '#999',
      '--main-buttons-background-hover': '#ccc',
      '--main-buttons-text': '#000'
    }
  };

  get appStyle () {
    return {
      ...this.colorThemes[this.currentTheme],
      ...{
        '--bgc': this.isBloody
          ? this.bloodyColor
          : this.colorThemes[this.currentTheme]['--main']
      }
    };
  }

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

  get background () {
    return {
      background: `url(./assets/img/background_transparent.png), ${
        this.isBloody ? this.bloodyColor : this.mainColor
      } !important`,
      'background-blend-mode': 'multiply'
    };
  }

  get amountClassObject () {
    return { visible: this.getAmountVisible };
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

  render () {
    return (
      <div id='app' style={this.appStyle}>
        <p id='amount' class={this.amountClassObject}>
          666
        </p>
        <div class='wrapper'>
          <router-view onBloody={this.bloodyHandler} onAdd={this.addHandler} />
        </div>
      </div>
    );
  }
}
export default App;
</script>

<style>
#amount {
  position: absolute;
  font-size: 250px;
  color: var(--main-text-accent);
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
