import { expect } from 'chai';
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { createStore, Module } from 'vuex-smart-module';
import { TableDataMutations } from '@/store/modules/TableData/mutations';
import { StateUnit, Lot, BankHistoryUnit, LogUnit } from '@/types';

const localVue = createLocalVue();
localVue.use(Vuex);

let store: Store<StateUnit>;

beforeEach(() => {
  const m = new Module({
    state: StateUnit,
    mutations: TableDataMutations
  });
  store = createStore(m);
});
describe('Mutations', () => {
  it('setTitle', () => {
    store.commit('setTitle', { id: 2, value: 'A1' });

    expect(store.state.lots[2].title).to.be.equal('A1');
  });
  it('setAdd', () => {
    store.commit('setAdd', { id: 2, value: '1234' });

    expect(store.state.lots[2].add).to.be.equal('1234');
  });
  it('addToP', () => {
    store.commit('setPValue', { id: 2, value: '1234' });

    expect(store.state.lots[2].p).to.be.equal('1234');
  });
  describe('sortLots', () => {
    it('initial state input do nothing', () => {
      store.commit('sortLots');

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
      store.commit('sortLots');

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
      store.commit('sortLots');

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
      store.commit('sortLots');

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
    store.commit('push');

    expect(store.state.lots).to.be.deep.equal([
      new Lot(0),
      new Lot(1),
      new Lot(2),
      new Lot(3),
      new Lot(4)
    ]);
  });
  it('addBankHistoryUnit', () => {
    store.commit('addBankHistoryUnit', 200);

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
    store.commit('mutateArmageddon');

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
    store.commit('mutateCommunism', 50.1);

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
    store.commit('createSnapShot');

    expect(store.state.log[1]).to.be.deep.include({
      lots: [new Lot(0, '', 1), new Lot(1), new Lot(2), new Lot(3)],
      bankHistory: [new BankHistoryUnit(0), new BankHistoryUnit(1)],
      previousPosition: 0
    });
  });
  describe('undo and redo mutations', () => {
    it('undo from initial state do nothing', () => {
      store.commit('undo');

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
      store.commit('createSnapShot');
      store.commit('undo');

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
      store.commit('redo');

      expect(store.state).to.be.deep.equal({
        log: [new LogUnit()],
        lots: [new Lot(0), new Lot(1), new Lot(2), new Lot(3)],
        currentPosition: 0,
        bankHistory: [new BankHistoryUnit(0)]
      });
    });
    it('3 times logging, undo, redo', () => {
      store.commit('setPValue', { id: 0, value: 1 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 12 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 123 });
      store.commit('createSnapShot');
      const p = store.state.lots[0].p;
      store.commit('undo');
      store.commit('redo');

      expect(store.state.lots[0].p).to.be.equal(p);
    });
    it('3 times logging, undo, logging, redo do nothing', () => {
      store.commit('setPValue', { id: 0, value: 1 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 12 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 123 });
      store.commit('createSnapShot');
      store.commit('undo');
      store.commit('setPValue', { id: 0, value: 124 });
      store.commit('createSnapShot');
      const p = store.state.lots[0].p;
      store.commit('redo');

      expect(store.state.lots[0].p).to.be.equal(p);
    });
    it('3 times logging, 2 undo, 2 logging, 3 undo return to initial lots state', () => {
      store.commit('setPValue', { id: 0, value: 1 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 12 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 123 });
      store.commit('createSnapShot');
      store.commit('undo');
      store.commit('undo');
      store.commit('setPValue', { id: 0, value: 14 });
      store.commit('createSnapShot');
      store.commit('setPValue', { id: 0, value: 145 });
      store.commit('createSnapShot');
      store.commit('undo');
      store.commit('undo');
      store.commit('undo');

      expect(store.state.lots[0].p).to.be.equal('');
    });
  });
});
