<script lang="tsx">
import Header from './Header.vue';
import Timer from './Timer.vue';
import AukTable from './AukTable.vue';
import Flame from './Flame.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Header,
    Timer,
    AukTable,
    Flame
  }
})
class Auk extends Vue {
  bloodyLevel: number = 0;
  timeout: number = 0;
  flameOn: boolean = true;

  created () {
    const toggle = this.toggleFrameOn;
    window.onkeydown = function (event: KeyboardEvent) {
      if (event.ctrlKey && event.keyCode === 81) {
        toggle();
      }
    };
  }

  toggleFrameOn () {
    this.flameOn = !this.flameOn;
  }

  bloodyHandler () {
    this.$emit('add', '666');
    if (this.bloodyLevel >= 2) this.bloodyLevel = 3;
    else this.bloodyLevel += 1;
    this.$emit('bloody', this.bloodyLevel);
    this.bloodySub();
  }

  bloodySub () {
    clearTimeout(this.timeout);
    if (this.bloodyLevel >= 3) {
      this.timeout = setTimeout(() => {
        this.bloodyLevel -= 1;
        console.log(this.bloodyLevel);
      }, 20 * 60 * 1000);
    } else {
      this.timeout = setTimeout(() => {
        this.bloodyLevel -= 1;
        console.log(this.bloodyLevel);
        if (this.bloodyLevel > 0) this.bloodySub();
      }, 5 * 60 * 1000);
    }
  }

  render () {
    return (
      <div class='main'>
        <Header bloody-level={this.bloodyLevel} />
        <div class='auk-row'>
          <AukTable on-bloody={this.bloodyHandler} />
          <div class='right-col'>
            <Timer />
            <p>
              Сделано с любовью <span>♥️</span>
            </p>
          </div>
          {this.flameOn ? <Flame /> : ''}
        </div>
      </div>
    );
  }
}

export default Auk;
</script>
<style scoped>
.main {
  overflow: hidden;
  max-height: 100%;
}

.auk-row {
  flex-grow: 0;
  flex-shrink: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: flex-start;
  justify-items: stretch;
  overflow: hidden;
  height: calc(100vh - 42px);
}
@media screen and (max-width: 600px) {
  .right-col {
    width: 100vw;
  }
}
.right-col {
  z-index: 100;
  flex-grow: 1;
  flex-shrink: 1;
  max-width: 440px;
  min-width: 400px;
  height: auto;
}
@media screen and (max-width: 1207px) {
  .auk-row {
    display: flex;
    flex-direction: column-reverse;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: stretch;
    overflow: hidden;
  }
  .right-col {
    margin-left: auto;
    margin-right: auto;
    max-width: unset;
    width: 100%;
    flex-shrink: 1;
    align-content: center;
  }
  img {
    display: none;
  }
}
p {
  text-align: end;
  padding: 0 10px;
  margin: 0;
  color: var(--main-text-accent);
}
p span {
  vertical-align: sub;
  font-size: 30px;
  color: rgb(255, 0, 0);
}
.right-col img {
  width: 440px;
}
</style>
