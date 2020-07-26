<script lang="tsx">
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { RootModule } from '@/store/modules';
import { useStore } from 'vuex-simple';

interface HeaderProps {
  bloodyLevel: number;
}

@Component({
  props: {
    bloodyLevel: { type: Number, default: 0 }
  }
})
class Header extends tsx.Component<HeaderProps> {
  bloodyLevel: number = 0;
  store: RootModule = useStore(this.$store);

  get bgGradient (): { background: string } {
    return {
      background: `linear-gradient(180deg, rgba(100,9,9,1)
        ${(this.bloodyLevel / 3.5) * 100}%,
        #2e2e2e ${(this.bloodyLevel / 2.5) * 100}%) !important`
    };
  }

  created () {
    this.store.Auth.fetchAuth();
    this.store.Auth.fetchId();
  }

  sendNotification () {
    this.store.Auth.sendNotification();
  }

  render () {
    return (
      <header style={this.bgGradient}>
        <div></div>
        <div>
          <h1>
            <span>Помойный </span>аукцион
          </h1>
        </div>
        <div>
          {this.store.Auth.getAuth ? (
            <ul>
              <li>
                <h2>ID: {this.store.Auth.getId}</h2>
              </li>
              <li>
                <a on-click={this.sendNotification}>
                  <font-awesome-icon icon='bell' />
                </a>
              </li>
              <li>
                <a href='/logout'>
                  <font-awesome-icon icon='sign-out-alt' />
                </a>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <a href='/login/discord'>
                  <font-awesome-icon icon='sign-in-alt' />
                </a>
              </li>
            </ul>
          )}
        </div>
      </header>
    );
  }
}
export default Header;
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  color: #fff;
  /* background-color: #2e2e2e; */
  background: linear-gradient(180deg, rgb(95, 0, 0) 0%, rgba(2, 0, 36, 1) 0%);
}
h1 {
  font-size: 32px;
  margin: auto 0;
  text-transform: uppercase;
}
h1 span {
  color: #657b83;
}
h1 img {
  margin-left: 10px;
  height: 2rem;
  vertical-align: bottom;
}
div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
header nav {
  padding: 0;
  font-size: 18px;
}
ul {
  list-style-type: none;
  margin: 0;
  align-content: center;
}
ul li {
  float: left;
  padding: 0, 10px;
}
ul li a {
  display: block;
  cursor: pointer;
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 14px;
}
ul li a:hover {
  background-color: #fff;
  color: black;
}
h2 {
  display: block;
  font-size: 18px;
  padding: 0.8rem 14px;
  margin: auto 0;
}
@media screen and (max-width: 500px) {
  h1 span {
    display: none;
  }
  h1 {
    justify-self: center;
  }
}
</style>
