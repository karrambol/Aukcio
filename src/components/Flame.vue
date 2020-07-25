<template>
  <div
    class="background-flame flame"
    id="background-flame"
    v-bind:class="classObject"
    :style="{ backgroundPositionY: `${this.pos}vh` }"
  >
    <div
      class="background-flame-inner flame"
      id="background-flame-inner"
      v-bind:class="classObject"
      :style="{ backgroundPositionY: `${this.pos + 24}vh` }"
    >
      <div
        class="background-flame-inner2 flame"
        id="background-flame-inner2"
        v-bind:class="classObject"
        :style="{ backgroundPositionY: `${this.pos + 48}vh` }"
      >
        <div
          class="background-flame-inner3 flame"
          id="background-flame-inner3"
          v-bind:class="classObject"
          :style="{ backgroundPositionY: `${this.pos + 72}vh` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BankHistoryUnit } from '../types';

@Component
class Flame extends Vue {
  cashFlowInterval = 0;
  flameTime = 60000;
  currentFlameIntense = 0;
  flameInvisTimers: number[] = [];
  fast = false;
  invisibleFlame = true;
  x = 12;

  get classObject (): { fast: boolean; 'invisible-flame': boolean } {
    return { fast: this.fast, 'invisible-flame': this.invisibleFlame };
  }

  get pos (): number {
    let intense = 1 * this.currentFlameIntense;
    if (intense <= 10) {
      intense = 0;
      this.flameInvisTimers.push(
        setTimeout(() => {
          this.invisibleFlame = true;
        }, 5500)
      );
    } else {
      this.flameInvisTimers.forEach(el => clearTimeout(el));
      this.flameInvisTimers = [];
      this.invisibleFlame = false;
      if (intense <= 30) {
        intense = intense * 2 + 10;
      } else {
        intense = (intense * 4) / 7 + 70 - 17;
      }
    }
    if (intense > 100) {
      intense = 100;
    }
    const pos = 90 - 90 * (intense / 100);
    return pos;
  }

  get bankHistory (): BankHistoryUnit[] {
    return this.$store.getters.bankHistory;
  }

  get bank (): number {
    return this.$store.getters.bank;
  }

  get maxPrice (): number {
    return this.$store.getters.maxPrice;
  }

  get bankAgo (): number {
    const filteredArray = this.bankHistory.filter(
      (el: BankHistoryUnit, i: number) =>
        el.date <= new Date(new Date().getTime() - this.flameTime) || i === 0
    );
    return filteredArray[filteredArray.length - 1].bank;
  }

  created () {
    setInterval(this.cashFlow, 100);
  }

  beforeDestroy () {
    clearInterval(this.cashFlowInterval);
    this.flameInvisTimers.forEach(el => clearTimeout(el));
  }

  intenseHandler (intanse: number) {
    if (this.currentFlameIntense - intanse <= 0) {
      this.fast = true;
    } else {
      this.fast = false;
    }
    this.currentFlameIntense = intanse;
  }

  cashFlow () {
    const delta2 =
      this.bankHistory[this.bankHistory.length - 1].bank - this.bankAgo;
    if (this.maxPrice >= 10000) {
      if (this.currentFlameIntense !== 100) this.intenseHandler(100);
    } else {
      const derivative = delta2 / 60;
      if (this.currentFlameIntense !== (100 * derivative) / 150) {
        this.intenseHandler((100 * derivative) / 150);
      }
    }
  }
}
export default Flame;
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
