<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import { Lot } from '@/types';
import { useStore } from 'vuex-simple';
import { RootModule } from '@/store/modules';

@Component
class AukTable extends Vue {
  store: RootModule = useStore(this.$store);

  get tableData (): Lot[] {
    return this.store.TableData.tableData;
  }

  get armageddonPrice (): number {
    return this.store.TableData.armageddonPrice;
  }

  get communismPrice (): number {
    return this.store.TableData.communismPrice;
  }

  get activeLots (): number {
    return this.store.TableData.activeLots;
  }

  push () {
    this.store.TableData.push();
  }

  setTitle (id: number) {
    return (e: any) => {
      this.store.TableData.setTitle({ id: id, value: e.target.value });
    };
  }

  setP (id: number) {
    return (e: any) => {
      this.store.TableData.setP({ id: id, value: e.target.value });
    };
  }

  setAdd (id: number) {
    return (e: any) => {
      this.store.TableData.setAdd({ id: id, value: e.target.value });
    };
  }

  sort () {
    this.store.TableData.sort();
  }

  pChangeHandler (id: number) {
    return (e: any) => {
      const value = e.target.value.replace(/,/gi, '.');
      this.store.TableData.setP({ id: id, value: value });
      this.store.TableData.sort();
      this.store.TableData.updateBankHistory();
    };
  }

  addChangeHandler (id: number) {
    return (e: any) => {
      let value = e.target.value.replace(/,/gi, '.');
      const newString = parseFloat(value);
      value = isNaN(newString) ? value + '' : newString + '';
      this.store.TableData.setAdd({ id: id, value: value });
    };
  }

  add (id: number) {
    return () => {
      if (this.store.TableData.is666(id)) {
        this.$emit('bloody');
      }
      this.store.TableData.add(id);
    };
  }

  undo () {
    this.store.TableData.undo();
  }

  redo () {
    this.store.TableData.redo();
  }

  armageddon () {
    const elements = document.getElementsByClassName('lot-price');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add('damaged-price');
      setTimeout(() => elements[i].classList.remove('damaged-price'), 200);
    }
    this.store.TableData.armageddon();
  }

  communism () {
    const elements = document.getElementsByClassName('lot-price');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add('communised-price');
      setTimeout(() => elements[i].classList.remove('communised-price'), 200);
    }
    this.store.TableData.communism();
  }

  render () {
    return (
      <div class='left-col'>
        <div class='top-controls-container'>
          <div class='left-top-buttons'>
            <button class='undo-button' onClick={this.undo}>
              <font-awesome-icon icon='undo' />
            </button>
            <button class='redo-button' onClick={this.redo}>
              <font-awesome-icon icon='redo' />
            </button>
          </div>
          <div class='right-top-buttons'>
            <button
              class='communism-button'
              title='Построить коммунизм'
              onClick={this.communism}
            >
              <span>☭</span> {this.communismPrice}
            </button>
            <button
              class='armageddon-button'
              title='Обрушить метеорит'
              onClick={this.armageddon}
            >
              <font-awesome-icon icon='meteor' /> {this.armageddonPrice}
            </button>
          </div>
        </div>
        <transition-group class='lot-table' name='list' tag='p'>
          {this.tableData.map((row, index) => {
            return (
              <div key={row.id} class='lot-row'>
                <input
                  key={index}
                  class='lot-title'
                  type='text'
                  value={row.title}
                  onInput={this.setTitle(index)}
                />
                <input
                  class='lot-price'
                  type='text'
                  value={row.p}
                  onInput={this.setP(index)}
                  onChange={this.pChangeHandler(index)}
                />
                <input
                  class='lot-add'
                  type='text'
                  value={row.add}
                  onInput={this.setAdd(index)}
                  onChange={this.addChangeHandler(index)}
                />
                <button class='add-button' onClick={this.add(index)}>
                  +
                </button>
              </div>
            );
          })}
        </transition-group>
        <div class='add-row-button-container'>
          <button class='add-row-button' onClick={this.push}>
            +
          </button>
        </div>
      </div>
    );
  }
}

export default AukTable;
</script>

<style scoped>
.top-controls-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 8px;
  justify-content: space-between;
  padding-right: calc(15px + 37px + 8px);
}
.top-controls-container button {
  height: 35px;
  width: 35px;
  font-size: 20px;
  border-radius: 8px;
  margin-right: 5px;
}
.top-controls-container .armageddon-button {
  width: 150px;
  border: 3px solid #000;
  color: rgb(168, 66, 168);
}
.top-controls-container .communism-button {
  width: 150px;
  border: 3px solid rgb(0, 0, 0);
  background-color: rgb(202, 0, 0);
  color: orange;
}
.top-controls-container .communism-button:hover {
  background-color: rgb(153, 1, 1);
}
.top-controls-container .communism-button span {
  font-size: 30px;
  vertical-align: sub;
}
p {
  margin-block-start: 0;
  margin-block-end: 0;
  overflow-x: visable;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.2s;
}
.list-enter,
.list-leave-to {
  transform: translateX(-1500px);
}
.bounce {
  display: block;
}
.left-col {
  flex-grow: 1;
  flex-shrink: 1;
  max-height: 100%;
  padding-top: 4px;
  overflow-y: auto;
  z-index: 100;
}
.lot-row {
  display: flex;
  flex-wrap: nowrap;
  padding: 8px;
  overflow-x: visable;
}
.lot-title {
  flex-grow: 5;
  text-align: end;
  width: 350px;
  min-width: 300px;
}
.lot-price {
  width: 130px;
  flex-shrink: 0;
}
.lot-add {
  width: 75px;
  display: block;
  flex-shrink: 0;
}
input {
  height: 100%;
  background-color: #d8d8d8;
  border: 3px solid #343a40;
  color: black;
  font-size: 36px;
  font-weight: 500;
  border-radius: 7px;
  height: 35px;
  padding: 0 7.5px;
  margin-right: 15px;
}
input:focus {
  border: 3px solid #448aff;
  background-color: white;
}
.lot-table :nth-child(1) input {
  background-color: gold;
  color: black;
  text-shadow: 15px #448aff;
  border: 3px outset gold;
  box-shadow: 0 0 10px gold, 3px 3px 0 black;
}
.lot-table :nth-child(1) input:focus {
  border: 3px outset #448aff;
  box-shadow: 0 0 15px #448aff, 3px 3px 0 black;
}
.lot-table :nth-child(2) input {
  background-color: silver;
  color: black;
  border: 3px outset silver;
  box-shadow: 0 0 10px #bdbdbd, 3px 3px 0 black;
}
.lot-table :nth-child(2) input:focus {
  border: 3px outset #448aff;
  box-shadow: 0 0 50px #bdbdbd, 3px 3px 0 black;
}
button {
  width: 41px;
  height: 41px;
  font-size: 32px;
  font-weight: bold;
  line-height: 1;
  flex-shrink: 0;
  background-color: #343a40;
  color: #fff;
  border-radius: 5px;
  border: none;
  border-radius: 50%;
}
button:hover {
  background-color: black;
  color: #fff;
}
.add-row-button-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 8px;
  line-height: 1;
  transition: 500ms;
}
.add-row-button {
  border-radius: 5px;
  font-size: 32px;
  font-weight: bold;
  line-height: 32px;
  margin-bottom: 5px;
  height: 32px;
  width: calc(100% - 15px - 37px);
}
.lot-table input.damaged-price {
  background-color: rgb(168, 66, 168);
  border-color: rgb(168, 66, 168);
  box-shadow: 0 0 20px red;
}
.lot-table input.communised-price {
  background-color: red;
  border-color: red;
  box-shadow: 0 0 20px red;
}
input:invalid {
  outline: 0.3rem solid #a31818;
}
@media screen and (max-width: 650px) {
  input {
    font-size: 16px;
    height: 28px;
    padding: 0px 2px;
    margin: 0px 3px;
  }
  button {
    width: 32px;
    height: 32px;
    font-size: 22px;
    margin: 0px 3px;
  }
  .lot-row {
    margin: 0px;
    padding: 3px 3px;
  }
  .lot-title {
    flex-grow: 5;
    text-align: start;
    min-width: 150px;
  }
  .lot-price {
    width: 50px;
    flex-shrink: 0;
  }
  .lot-add {
    width: 35px;
    display: block;
    flex-shrink: 0;
  }
}
</style>
