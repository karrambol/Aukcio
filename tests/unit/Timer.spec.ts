/* eslint-disable @typescript-eslint/no-empty-function */
import { expect } from 'chai';
import Vuex, { Store } from 'vuex';
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Timer from '@/components/Timer.vue';
import FakeTimers from '@sinonjs/fake-timers';
import { RootModule } from '@/store/modules';
import { createVuexStore } from 'vuex-simple';

const localVue = createLocalVue();
localVue.use(Vuex);

let clock: FakeTimers.InstalledClock;
let wrapper: Wrapper<Timer>;
let store: Store<RootModule>;
let frame = 1;
window.performance.now = () => Date.now();
window.requestAnimationFrame = function (callback) {
  setTimeout(callback, 1000 / 60);
  return frame++;
};
beforeEach(() => {
  const instance = new RootModule();
  store = createVuexStore(instance, {
    strict: true,
    modules: {},
    plugins: []
  });
  clock = FakeTimers.install();
  wrapper = shallowMount(Timer, {
    store,
    localVue
  });
});
describe('initial state', () => {
  it('stoped', () => {
    expect(wrapper.vm.$data).to.be.include({
      isGoing: false,
      duration: 10 * 60000,
      currentTime: 10 * 60000,
      elapsed: 0,
      tickValue: 62,
      timeoutID: 0
    });
  });
  it('wasted > 0', async () => {
    clock.tick(100);

    expect(wrapper.vm.$data.wasted).to.be.above(0);
  });
  it('frame > 0', () => {
    expect(wrapper.vm.$data.frame).to.be.above(0);
  });
  it('correct wasted text', () => {
    const wastedEvalText = wrapper.find('.wasted').text();

    expect(wastedEvalText).to.be.equal('Потрачено время: 00:00:00Банк: 0');
  });
});
describe('button-start when timer stoped', () => {
  it('starts timer', () => {
    wrapper.find('.button-start').trigger('click');

    expect(wrapper.vm.$data).to.be.include({
      isGoing: true,
      duration: 10 * 60000
    });
  });
  it('elapsed after 5000ms > 5000 ms', () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000 + wrapper.vm.$data.tickValue);

    expect(wrapper.vm.$data.elapsed).to.be.above(5000);
  });
  it('currentTime after 5000ms sub up to 5000ms', () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000 + wrapper.vm.$data.tickValue);

    expect(wrapper.vm.$data.currentTime).to.be.below(10 * 60000 - 5000);
  });
});
describe('button-start when timer run', () => {
  it('stops timer', async () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    await setTimeout(() => {}, 1);
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      isGoing: false,
      timeoutID: 0
    });
  });
  it('elapsed after 5000ms not changed', async () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    await setTimeout(() => {}, 1);
    wrapper.find('.button-start').trigger('click');
    clock.tick(wrapper.vm.$data.tickValue);
    const elapsed = wrapper.vm.$data.elapsed;
    clock.tick(5000);

    expect(wrapper.vm.$data.elapsed).to.be.equal(elapsed);
  });
  it('currentTime after 5000ms not changed', async () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    await setTimeout(() => {}, 1);
    wrapper.find('.button-start').trigger('click');
    clock.tick(wrapper.vm.$data.tickValue);
    const currentTime = wrapper.vm.$data.currentTime;
    clock.tick(5000);

    expect(wrapper.vm.$data.currentTime).to.be.equal(currentTime);
  });
});
describe('button-clear', () => {
  it('stops and clear timer', async () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    wrapper.find('.button-clear').trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      isGoing: false,
      timeoutID: 0,
      duration: 0,
      elapsed: 0,
      currentTime: 0
    });
  });
  it('elapsed after 5000ms not changed', async () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    wrapper.find('.button-clear').trigger('click');
    const elapsed = wrapper.vm.$data.elapsed;
    clock.tick(5000);

    expect(wrapper.vm.$data.elapsed).to.be.equal(elapsed);
  });
  it('currentTime after 5000ms not changed', async () => {
    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    wrapper.find('.button-clear').trigger('click');
    const currentTime = wrapper.vm.$data.currentTime;
    clock.tick(5000);

    expect(wrapper.vm.$data.currentTime).to.be.equal(currentTime);
  });
});
describe('auto stop when time = 0', () => {
  it('stops timer', () => {
    wrapper.vm.$data.duration = 100;
    wrapper.vm.$data.currentTime = 100;

    wrapper.find('.button-start').trigger('click');
    clock.tick(100 + wrapper.vm.$data.tickValue);

    expect(wrapper.vm.$data.isGoing).to.equal(false);
  });
  it('elapsed after 5000ms not changed', () => {
    wrapper.vm.$data.duration = 100;
    wrapper.vm.$data.currentTime = 100;

    wrapper.find('.button-start').trigger('click');
    clock.tick(100 + wrapper.vm.$data.tickValue);
    const elapsed = wrapper.vm.$data.elapsed;
    clock.tick(5000);

    expect(wrapper.vm.$data.elapsed).to.be.equal(elapsed);
  });
  it('currentTime after 5000ms not changed', () => {
    wrapper.vm.$data.duration = 100;
    wrapper.vm.$data.currentTime = 100;

    wrapper.find('.button-start').trigger('click');
    clock.tick(100 + wrapper.vm.$data.tickValue);
    const currentTime = wrapper.vm.$data.currentTime;
    clock.tick(5000);

    expect(wrapper.vm.$data.currentTime).to.be.equal(currentTime);
  });
  it('after adding duration timer still stoped', () => {
    wrapper.vm.$data.duration = 100;
    wrapper.vm.$data.currentTime = 100;

    wrapper.find('.button-start').trigger('click');
    clock.tick(100 + wrapper.vm.$data.tickValue);
    wrapper.find('.timer-bot .timer-button').trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data.isGoing).to.equal(false);
  });
  it('after adding duration elapsed const', () => {
    wrapper.vm.$data.duration = 100;
    wrapper.vm.$data.currentTime = 100;

    wrapper.find('.button-start').trigger('click');
    clock.tick(100 + wrapper.vm.$data.tickValue);
    wrapper.find('.timer-bot .timer-button').trigger('click');
    const elapsed = wrapper.vm.$data.elapsed;
    clock.tick(5000);

    expect(wrapper.vm.$data.elapsed).to.be.equal(elapsed);
  });
  it('after adding 1m currentTime 1m', () => {
    wrapper.vm.$data.duration = 100;
    wrapper.vm.$data.currentTime = 100;

    wrapper.find('.button-start').trigger('click');
    clock.tick(100 + wrapper.vm.$data.tickValue);
    wrapper.find('.timer-button').trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data.currentTime).to.be.equal(60 * 1000);
  });
});
describe('add and sub buttons', () => {
  it('addSmall add 1m', () => {
    const buttons = wrapper.findAll('.timer-bot .timer-button');

    buttons.at(0).trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      duration: 11 * 60000,
      currentTime: 11 * 60000,
      isGoing: false
    });
  });
  it('addBig add 2m', () => {
    const buttons = wrapper.findAll('.timer-bot .timer-button');

    buttons.at(1).trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      duration: 12 * 60000,
      currentTime: 12 * 60000
    });
  });
  it('setEven set cur time = 10m', () => {
    const buttons = wrapper.findAll('.timer-bot .timer-button');
    wrapper.vm.$data.duration = 0;
    wrapper.vm.$data.currentTime = 0;
    wrapper.vm.$data.elapsed = 0;

    buttons.at(2).trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      duration: 10 * 60000,
      currentTime: 10 * 60000,
      elapsed: 0
    });
  });
  it('subSmall sub 1m', () => {
    const buttons = wrapper.findAll('.timer-bot .timer-button');

    buttons.at(3).trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      duration: 9 * 60000,
      currentTime: 9 * 60000
    });
  });
  it('subSmall not leave cur time < 0 if isGong', () => {
    const buttons = wrapper.findAll('.timer-bot .timer-button');
    wrapper.vm.$data.duration = 10 * 1000 * 60;
    wrapper.vm.$data.currentTime = 0.5 * 1000 * 60;
    wrapper.vm.$data.elapsed = 9 * 1000 * 60 + 0.5 * 1000 * 60;

    wrapper.find('.button-start').trigger('click');
    clock.tick(5000);
    buttons.at(3).trigger('click');
    clock.tick(5000);

    expect(wrapper.vm.$data).to.be.include({
      duration: 0,
      currentTime: 0,
      elapsed: 0,
      isGoing: false
    });
  });
  it('after subSmall leave cur time = 0 addSmall leave cur time = 1m', async () => {
    const buttons = wrapper.findAll('.timer-bot .timer-button');
    wrapper.vm.$data.duration = 10 * 1000 * 60;
    wrapper.vm.$data.currentTime = 0.5 * 1000 * 60;
    wrapper.vm.$data.elapsed = 9 * 1000 * 60 + 0.5 * 1000 * 60;

    buttons.at(3).trigger('click');
    clock.tick(5000);
    await setTimeout(() => {}, 100);
    buttons.at(0).trigger('click');

    expect(wrapper.vm.$data).to.be.include({
      duration: 1000 * 60,
      currentTime: 1000 * 60,
      elapsed: 0,
      isGoing: false
    });
  });
});
describe('bank evaluation', () => {
  it('100', async () => {
    wrapper.vm.$data.store.TableData.setPValue({ id: 0, value: 100 });
    await setTimeout(() => {}, 1);
    const text = wrapper.find('.wasted-bank').text();
    const bankEvaluated = parseFloat(text);

    expect(bankEvaluated).to.be.equal(100);
  });
  it('1000.01', async () => {
    wrapper.vm.$data.store.TableData.setPValue({ id: 0, value: 1000.01 });
    await setTimeout(() => {}, 1);
    const text = wrapper.find('.wasted-bank').text();
    const bankEvaluated = parseFloat(text);

    expect(bankEvaluated).to.be.equal(1000.01);
  });
});
describe('wasted time evaluation', () => {
  it('00:00:00', () => {
    const text = wrapper.find('.wasted-time').text();

    expect(text).to.be.equal('00:00:00');
  });
  it('01:02:33', async () => {
    const tick = 250;
    window.requestAnimationFrame = function (callback) {
      setTimeout(callback, tick); // bigger tick just for faster test
      return frame++;
    };

    clock.tick(((1 * 60 + 2) * 60 + 33) * 1000 + tick);
    await setTimeout(() => {}, 1);
    const text = wrapper.find('.wasted-time').text();

    expect(text).to.be.equal('01:02:33');
  });
});
describe('current time evaluation', () => {
  it('initial 10:00.00', async () => {
    await setTimeout(() => {}, 1);
    const text = wrapper.find('.time').text();

    expect(text).to.be.equal('10:00.000');
  });
  it('01:02:33', async () => {
    wrapper.vm.$data.currentTime = (14 * 60 + 33) * 1000 + 253;

    await setTimeout(() => {}, 1);
    const text = wrapper.find('.time').text();

    expect(text).to.be.equal('14:33.253');
  });
  it('after start for 311 ticks', async () => {
    wrapper.vm.$data.currentTime = (14 * 60 + 33) * 1000 + 253;
    wrapper.vm.$data.duration = wrapper.vm.$data.currentTime;
    wrapper.vm.$data.elapsed = 0;
    const tick = wrapper.vm.$data.tickValue;
    clock = FakeTimers.install({
      shouldAdvanceTime: true,
      advanceTimeDelta: tick
    });

    wrapper.find('.button-start').trigger('click');
    clock.tick(311 * tick);
    await setTimeout(() => {}, 1);
    const text = wrapper.find('.time').text();

    expect(text).to.be.equal('14:13.971');
  });
  it('after start for 311 ticks and add 1m by button click', async () => {
    wrapper.vm.$data.currentTime = (14 * 60 + 33) * 1000 + 253;
    wrapper.vm.$data.duration = wrapper.vm.$data.currentTime;
    wrapper.vm.$data.elapsed = 0;
    const tick = wrapper.vm.$data.tickValue;
    clock = FakeTimers.install({
      shouldAdvanceTime: true,
      advanceTimeDelta: tick
    });

    wrapper.find('.button-start').trigger('click');
    clock.tick(311 * tick);
    wrapper.find('.timer-button').trigger('click');
    await setTimeout(() => {}, 1);
    const text = wrapper.find('.time').text();

    expect(text).to.be.equal('15:13.971');
  });
});
