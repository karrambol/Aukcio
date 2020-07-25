export interface ILot {
  id: number;
  title: string;
  p: string | number;
  add?: string | number;
}
export class Lot implements ILot {
  id: number;
  title: string;
  p: string | number;
  add: string | number;
  constructor (
    id: number = 0,
    title: string = '',
    p: string | number = '',
    add: string | number = ''
  ) {
    this.id = id;
    this.title = title;
    this.p = p;
    this.add = add;
  }
}
export interface IBankHistoryUnit {
  date: Date;
  bank: number;
}
export class BankHistoryUnit implements IBankHistoryUnit {
  date: Date;
  bank: number;
  constructor (bank: number = 0) {
    this.date = new Date();
    this.bank = bank;
  }
}
export interface IStateUnit {
  lots: Lot[];
  bankHistory: BankHistoryUnit[];
  previousPosition?: number;
  currentPosition?: number;
  nextPosition?: number;
}
export class LogUnit implements IStateUnit {
  lots: Lot[];
  bankHistory: BankHistoryUnit[];
  previousPosition: undefined | number;
  nextPosition: undefined | number;
  constructor (
    lots: Lot[] = [new Lot(0), new Lot(1), new Lot(2), new Lot(3)],
    bankHistory: BankHistoryUnit[] = [new BankHistoryUnit(0)],
    previousPosition: number | undefined = undefined
  ) {
    this.lots = lots;
    this.bankHistory = bankHistory;
    this.previousPosition = previousPosition;
  }
}
export class StateUnit implements IStateUnit {
  log: LogUnit[];
  lots: Lot[];
  bankHistory: BankHistoryUnit[];
  currentPosition: number;
  constructor (
    lots: Lot[] = [new Lot(0), new Lot(1), new Lot(2), new Lot(3)],
    bankHistory: BankHistoryUnit[] = [new BankHistoryUnit(0)],
    currentPosition: number = 0,
    log: LogUnit[] = [new LogUnit()]
  ) {
    this.lots = lots;
    this.bankHistory = bankHistory;
    this.currentPosition = currentPosition;
    this.log = log;
  }
}
