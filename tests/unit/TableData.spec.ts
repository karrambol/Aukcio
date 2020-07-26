import { expect } from 'chai';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { Lot, BankHistoryUnit, LogUnit } from '@/types';
import { TableData } from '@/store/modules/TableData';
import { createVuexStore, useStore } from 'vuex-simple';

const localVue = createLocalVue();
localVue.use(Vuex);

let store: TableData;

beforeEach(() => {
  const m = new TableData();
  const storeInst = createVuexStore(m, {
    strict: false,
    modules: {},
    plugins: []
  });
  store = useStore(storeInst);
});
describe('Mutations', () => {
  it('setTitle', () => {
    store.setTitle({ id: 2, value: 'A1' });

    expect(store.state.lots[2].title).to.be.equal('A1');
  });
  it('setAdd', () => {
    store.setAdd({ id: 2, value: '1234' });
    expect(store.state.lots[2].add).to.be.equal('1234');
  });
  it('addToP', () => {
    store.setPValue({ id: 2, value: '1234' });

    expect(store.state.lots[2].p).to.be.equal('1234');
  });
  describe('sortLots', () => {
    it('initial state input do nothing', () => {
      store.sortLots();

      expect(store.state.lots).to.be.deep.equal([
        new Lot(0),
        new Lot(1),
        new Lot(2),
        new Lot(3)
      ]);
    });
    it('reverse input', () => {
      store.state.lots = [
        new Lot(0, 'a', 1, 11),
        new Lot(1, 'b', 2, 12),
        new Lot(2, 'c', 3, 13),
        new Lot(3, 'd', 4, 14)
      ];
      store.sortLots();

      expect(store.state.lots).to.be.deep.equal([
        new Lot(3, 'd', 4, 14),
        new Lot(2, 'c', 3, 13),
        new Lot(1, 'b', 2, 12),
        new Lot(0, 'a', 1, 11)
      ]);
    });
    it('reverse input with NaN in between', () => {
      store.state.lots = [
        new Lot(0, 'a', 1, 11),
        new Lot(1, 'b', 2, 12),
        new Lot(2, 'c', 'NaN', 13),
        new Lot(3, 'd', 4, 14)
      ];
      store.sortLots();

      expect(store.state.lots).to.be.deep.equal([
        new Lot(3, 'd', 4, 14),
        new Lot(1, 'b', 2, 12),
        new Lot(0, 'a', 1, 11),
        new Lot(2, 'c', 'NaN', 13)
      ]);
    });
    it('reverse input with NaN and priceless lots in between', () => {
      store.state.lots = [
        new Lot(0, '', 1),
        new Lot(1, '', 2),
        new Lot(2, '', 0),
        new Lot(3, '', 'NaN'),
        new Lot(4, '', 3),
        new Lot(5, '', NaN),
        new Lot(6, '', 4),
        new Lot(7, '', 0)
      ];
      store.sortLots();

      expect(store.state.lots).to.be.deep.equal([
        new Lot(6, '', 4),
        new Lot(4, '', 3),
        new Lot(1, '', 2),
        new Lot(0, '', 1),
        new Lot(2, '', 0),
        new Lot(3, '', 'NaN'),
        new Lot(5, '', NaN),
        new Lot(7, '', 0)
      ]);
    });
  });
  it('push new lot', () => {
    store.push();

    expect(store.state.lots).to.be.deep.equal([
      new Lot(0),
      new Lot(1),
      new Lot(2),
      new Lot(3),
      new Lot(4)
    ]);
  });
  it('addBankHistoryUnit', () => {
    store.addBankHistoryUnit(200);

    expect(store.state.bankHistory).to.be.deep.equal([
      new BankHistoryUnit(0),
      new BankHistoryUnit(200)
    ]);
  });
  it('mutateArmageddon', () => {
    store.state.lots = [
      new Lot(0, '', 100),
      new Lot(1, '', '100'),
      new Lot(2, '', '100,4'),
      new Lot(3, '', 100.4),
      new Lot(3, '', 0),
      new Lot(3, '', ''),
      new Lot(3, '', 'NaN')
    ];
    store.mutateArmageddon();

    expect(store.state.lots).to.be.deep.equal([
      new Lot(0, '', 50),
      new Lot(1, '', 50),
      new Lot(2, '', 50.2),
      new Lot(3, '', 50.2),
      new Lot(3, '', 0),
      new Lot(3, '', ''),
      new Lot(3, '', 'NaN')
    ]);
  });
  it('mutateCommunism', () => {
    store.state.lots = [
      new Lot(0, '', 100),
      new Lot(1, '', '100'),
      new Lot(2, '', '100,4'),
      new Lot(3, '', 100.4),
      new Lot(4, '', 0),
      new Lot(5, '', ''),
      new Lot(6, '', 'NaN')
    ];
    store.mutateCommunism(50.1);

    expect(store.state.lots).to.be.deep.equal([
      new Lot(0, '', 50.1),
      new Lot(1, '', 50.1),
      new Lot(2, '', 50.1),
      new Lot(3, '', 50.1),
      new Lot(4, '', 0),
      new Lot(5, '', ''),
      new Lot(6, '', 'NaN')
    ]);
  });
  it('createSnapShot', () => {
    store.state.lots = [new Lot(0, '', 1), new Lot(1), new Lot(2), new Lot(3)];
    store.state.bankHistory = [new BankHistoryUnit(0), new BankHistoryUnit(1)];
    store.createSnapShot();

    expect(store.state.log[1]).to.be.deep.include({
      lots: [new Lot(0, '', 1), new Lot(1), new Lot(2), new Lot(3)],
      bankHistory: [new BankHistoryUnit(0), new BankHistoryUnit(1)],
      previousPosition: 0
    });
  });
  describe('undo and redo mutations', () => {
    it('undo from initial state do nothing', () => {
      store.undo();

      expect(store.state).to.be.deep.equal({
        log: [new LogUnit()],
        lots: [new Lot(0), new Lot(1), new Lot(2), new Lot(3)],
        currentPosition: 0,
        bankHistory: [new BankHistoryUnit(0)]
      });
    });
    it('undo from one step', () => {
      store.state.lots = [
        new Lot(0, '', 1),
        new Lot(1),
        new Lot(2),
        new Lot(3)
      ];
      store.state.bankHistory = [
        new BankHistoryUnit(0),
        new BankHistoryUnit(1)
      ];
      store.createSnapShot();
      store.undo();

      expect(store.state).to.be.deep.equal({
        log: [
          Object.assign(new LogUnit(), { nextPosition: 1 }),
          {
            lots: [new Lot(0, '', 1), new Lot(1), new Lot(2), new Lot(3)],
            bankHistory: [new BankHistoryUnit(0), new BankHistoryUnit(1)],
            previousPosition: 0
          }
        ],
        lots: [new Lot(0), new Lot(1), new Lot(2), new Lot(3)],
        currentPosition: 0,
        bankHistory: [new BankHistoryUnit(0)]
      });
    });

    it('redo from initial state do nothing', () => {
      store.redo();

      expect(store.state).to.be.deep.equal({
        log: [new LogUnit()],
        lots: [new Lot(0), new Lot(1), new Lot(2), new Lot(3)],
        currentPosition: 0,
        bankHistory: [new BankHistoryUnit(0)]
      });
    });
    it('3 times logging, undo, redo', () => {
      store.setPValue({ id: 0, value: 1 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 12 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 123 });
      store.createSnapShot();
      const p = store.state.lots[0].p;
      store.undo();
      store.redo();

      expect(store.state.lots[0].p).to.be.equal(p);
    });
    it('3 times logging, undo, logging, redo do nothing', () => {
      store.setPValue({ id: 0, value: 1 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 12 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 123 });
      store.createSnapShot();
      store.undo();
      store.setPValue({ id: 0, value: 124 });
      store.createSnapShot();
      const p = store.state.lots[0].p;
      store.redo();

      expect(store.state.lots[0].p).to.be.equal(p);
    });
    it('3 times logging, 2 undo, 2 logging, 3 undo return to initial lots state', () => {
      store.setPValue({ id: 0, value: 1 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 12 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 123 });
      store.createSnapShot();
      store.undo();
      store.undo();
      store.setPValue({ id: 0, value: 14 });
      store.createSnapShot();
      store.setPValue({ id: 0, value: 145 });
      store.createSnapShot();
      store.undo();
      store.undo();
      store.undo();

      expect(store.state.lots[0].p).to.be.equal('');
    });
  });
});
