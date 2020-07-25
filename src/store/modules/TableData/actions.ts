import { Actions } from 'vuex-smart-module';
import { StateUnit } from '@/types';
import { TableDataGetters } from './getters';
import { TableDataMutations } from './mutations';
import { toFloat } from './helpers';

export class TableDataActions extends Actions<
  StateUnit,
  TableDataGetters,
  TableDataMutations,
  TableDataActions
> {
  add (id: number) {
    const add = toFloat(this.state.lots[id].add);
    const p = this.state.lots[id].p === '' ? 0 : toFloat(this.state.lots[id].p);
    if (!isNaN(p) && !isNaN(add) && add !== 0) {
      this.commit('setPValue', { id, value: p + add });
      this.commit('setAdd', { id, value: '' });
    }
    this.dispatch('sort');
    this.dispatch('updateBankHistory');
  }

  sort () {
    this.commit('sortLots');
    this.commit('createSnapShot');
  }

  setP ({ id, value }: { id: number; value: string }): void {
    this.commit('setPValue', { id, value });
    if (
      this.state.lots.length !== undefined &&
      this.state.lots[this.state.lots.length - 1].p !== ''
    ) {
      this.commit('push');
    }
  }

  updateBankHistory () {
    if (
      this.getters.bank !==
      this.state.bankHistory[this.state.bankHistory.length - 1].bank
    ) {
      this.commit('addBankHistoryUnit', this.getters.bank);
    }
  }

  armageddon () {
    this.commit('mutateArmageddon');
    this.dispatch('sort');
  }

  communism () {
    this.commit(
      'mutateCommunism',
      Math.round((this.getters.bank / this.getters.activeLots) * 100) / 100
    );

    this.dispatch('sort');
  }
}
