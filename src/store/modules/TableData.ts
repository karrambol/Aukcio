import { Mutation, State } from 'vuex-simple';
import { LogUnit, Lot, BankHistoryUnit, StateUnit } from '@/types';
import { toFloat } from './helpers';

export class TableData {
  @State()
  state: StateUnit = new StateUnit();

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

  @Mutation()
  setTitle ({ id, value }: { id: number; value: string }): void {
    this.state.lots[id].title = value;
  }

  @Mutation()
  setAdd ({ id, value }: { id: number; value: string }) {
    this.state.lots[id].add = value;
  }

  @Mutation()
  setPValue ({ id, value }: { id: number; value: string | number }) {
    this.state.lots[id].p = value;
  }

  @Mutation()
  sortLots () {
    this.state.lots = this.state.lots.sort(
      (a, b) => toFloat(b.p) - toFloat(a.p)
    );
  }

  @Mutation()
  push () {
    this.state.lots = [...this.state.lots, new Lot(this.state.lots.length)];
  }

  @Mutation()
  addBankHistoryUnit (bank: number) {
    this.state.bankHistory.push(new BankHistoryUnit(bank));
  }

  @Mutation()
  mutateArmageddon () {
    this.state.lots = this.state.lots.map(el => {
      let rez;
      if (toFloat(el.p) !== 0 && el.p !== '') {
        rez = Math.round((toFloat(el.p) / 2) * 100) / 100;
      } else rez = el.p;
      return { ...el, p: rez };
    });
  }

  @Mutation()
  mutateCommunism (newPrise: number) {
    this.state.lots = this.state.lots.map(el => {
      let rez;
      if (toFloat(el.p) !== 0 && el.p !== '') {
        rez = newPrise;
      } else rez = el.p;
      return { ...el, p: rez };
    });
  }

  @Mutation()
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

  @Mutation()
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

  @Mutation()
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

  add (id: number) {
    const add = toFloat(this.state.lots[id].add);
    const p = this.state.lots[id].p === '' ? 0 : toFloat(this.state.lots[id].p);
    if (!isNaN(p) && !isNaN(add) && add !== 0) {
      this.setPValue({ id, value: p + add });
      this.setAdd({ id, value: '' });
    }
    this.sort();
    this.updateBankHistory();
  }

  sort () {
    this.sortLots();
    this.createSnapShot();
  }

  setP ({ id, value }: { id: number; value: string }): void {
    this.setPValue({ id, value });
    if (
      this.state.lots.length !== undefined &&
      this.state.lots[this.state.lots.length - 1].p !== ''
    ) {
      this.push();
    }
  }

  updateBankHistory () {
    if (
      this.bank !==
      this.state.bankHistory[this.state.bankHistory.length - 1].bank
    ) {
      this.addBankHistoryUnit(this.bank);
    }
  }

  armageddon () {
    this.mutateArmageddon();
    this.sort();
  }

  communism () {
    this.mutateCommunism(Math.round((this.bank / this.activeLots) * 100) / 100);

    this.sort();
  }
}
