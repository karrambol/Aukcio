import { Mutations } from 'vuex-smart-module';
import { StateUnit, Lot, BankHistoryUnit, LogUnit } from '@/types';
import { toFloat } from './helpers';

export class TableDataMutations extends Mutations<StateUnit> {
  setTitle ({ id, value }: { id: number; value: string }): void {
    this.state.lots[id].title = value;
  }

  setAdd ({ id, value }: { id: number; value: string }) {
    this.state.lots[id].add = value;
  }

  setPValue ({ id, value }: { id: number; value: string | number }) {
    this.state.lots[id].p = value;
  }

  sortLots () {
    this.state.lots = this.state.lots.sort(
      (a, b) => toFloat(b.p) - toFloat(a.p)
    );
  }

  push () {
    this.state.lots = [...this.state.lots, new Lot(this.state.lots.length)];
  }

  addBankHistoryUnit (bank: number) {
    this.state.bankHistory.push(new BankHistoryUnit(bank));
  }

  mutateArmageddon () {
    this.state.lots = this.state.lots.map(el => {
      let rez;
      if (toFloat(el.p) !== 0 && el.p !== '') {
        rez = Math.round((toFloat(el.p) / 2) * 100) / 100;
      } else rez = el.p;
      return { ...el, p: rez };
    });
  }

  mutateCommunism (newPrise: number) {
    this.state.lots = this.state.lots.map(el => {
      let rez;
      if (toFloat(el.p) !== 0 && el.p !== '') {
        rez = newPrise;
      } else rez = el.p;
      return { ...el, p: rez };
    });
  }

  createSnapShot () {
    const snapShot = new LogUnit(
      this.state.lots.map(el => ({ ...el })),
      this.state.bankHistory.map(el => ({ ...el })),
      this.state.currentPosition * 1
    );
    const newPos = this.state.log.length;
    this.state.log[this.state.currentPosition].nextPosition = newPos;
    this.state.log.push(snapShot);
    this.state.currentPosition = newPos;
  }

  undo () {
    const prevPos = this.state.log[this.state.currentPosition].previousPosition;
    if (prevPos !== undefined) {
      this.state.currentPosition = prevPos;
      this.state.lots = this.state.log[prevPos].lots.map(el => ({ ...el }));
      this.state.bankHistory = this.state.log[prevPos].bankHistory.map(el => ({
        ...el
      }));
    }
  }

  redo () {
    const nextPos = this.state.log[this.state.currentPosition].nextPosition;
    if (nextPos) {
      this.state.currentPosition = nextPos;
      this.state.lots = this.state.log[nextPos].lots.map(el => ({ ...el }));
      this.state.bankHistory = this.state.log[nextPos].bankHistory.map(el => ({
        ...el
      }));
    }
  }
}
