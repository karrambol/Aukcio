import { Getters } from 'vuex-smart-module';
import { StateUnit, Lot, BankHistoryUnit } from '@/types';
import { toFloat } from './helpers';

export class TableDataGetters extends Getters<StateUnit> {
  get tableData (): Lot[] {
    return this.state.lots;
  }

  get bank (): number {
    return (
      Math.round(
        this.state.lots.reduce((acc: number, el: Lot): number => {
          acc += toFloat(el.p);
          return acc;
        }, 0) * 100
      ) / 100
    );
  }

  get bankHistory (): BankHistoryUnit[] {
    return this.state.bankHistory;
  }

  get maxPrice (): number {
    return toFloat(this.state.lots[0].p);
  }

  get armageddonPrice (): number {
    return (
      Math.round(
        this.state.lots.reduce((acc: number, el: Lot): number => {
          acc += toFloat(el.p);
          return acc;
        }, 0) * 50
      ) / 100
    );
  }

  get communismPrice (): number {
    return (
      Math.round(
        this.state.lots.reduce((acc: number, el: Lot): number => {
          acc += toFloat(el.p);
          return acc;
        }, 0) * 50
      ) / 100
    );
  }

  get activeLots (): number {
    return this.state.lots.reduce((acc, el): number => {
      if (toFloat(el.p) && el.p !== '') acc += 1;
      return acc;
    }, 0);
  }

  get is666 (): Function {
    const state = this.state;
    return function (id: number): boolean {
      return toFloat(state.lots[id].add) === 666;
    };
  }
}
