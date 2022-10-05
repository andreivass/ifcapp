<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">IFCapp</router-link>
      <div class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link to="/projects" class="nav-link">Projektid</router-link>
        </li>
      </div>
      <div class="navbar-nav">
        <li v-if="!this.$store.state.auth.status.loggedIn" class="nav-item mr-sm-2">
          <router-link to="/register" class="nav-link">Registreeri kasutaja</router-link>
        </li>
        <li v-if="!this.$store.state.auth.status.loggedIn" class="nav-item mr-sm-2">
          <router-link to="/login" class="nav-link">Logi sisse</router-link>
        </li>
        <li v-if="this.$store.state.auth.status.loggedIn" class="nav-item mr-sm-2">
          <button class="btn btn-danger mt-2" @click="logOut">Logi välja</button>
        </li>
        <!-- <li class="nav-item mr-sm-2">
          <router-link to="/logout" class="nav-link">Logi välja</router-link> TODO: logOut() 
        </li> -->
      </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
      this.userLoggedIn = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  background-color: white;
}

#body {
  background-color:slategray;
}
</style>
