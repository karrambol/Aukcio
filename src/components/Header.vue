<template>
  <header :style="bgGradient">
    <div>
      <!-- <h1><img src="../assets/img/blank_logo_d.png" /></h1> -->
    </div>
    <div>
      <h1><span>Помойный </span>аукцион</h1>
      <!-- <nav>
        <ul>
          <li><router-link to='/auk'>Auction</router-link></li>
          <li><router-link>About</router-link></li>
          <li><router-link>Rules</router-link></li>
        </ul>
      </nav> -->
    </div>
    <div>
      <ul>
        <li v-if="this.$store.getters.getAuth">
          <h2>ID: {{ this.$store.getters.getId }}</h2>
        </li>
        <li v-if="this.$store.getters.getAuth">
          <a v-on:click="sendNotification"><font-awesome-icon icon="bell"/></a>
        </li>
        <!--<li><router-link><font-awesome-icon icon="cog" /></router-link></li>-->
        <li v-if="!this.$store.getters.getAuth">
          <a href="/login/discord"><font-awesome-icon icon="sign-in-alt"/></a>
        </li>
        <li v-if="this.$store.getters.getAuth">
          <a href="/logout"><font-awesome-icon icon="sign-out-alt"/></a>
        </li>
      </ul>
    </div>
  </header>
</template>
<script>
export default {
  name: 'Header',
  props: {
    bloodyLevel: {
      type: Number,
      default: 0
    }
  },
  computed: {
    bgGradient () {
      return {
        background: `linear-gradient(180deg, rgba(100,9,9,1) 
        ${(this.bloodyLevel / 3.5) * 100}%, 
        #2e2e2e ${(this.bloodyLevel / 2.5) * 100}%) !important`
      }
    }
  },
  created () {
    this.$store.dispatch('getAuth').then()
    this.$store.dispatch('getId').then()
  },
  methods: {
    sendNotification () {
      this.$store.dispatch('sendNotification').then()
    }
  }
}
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
