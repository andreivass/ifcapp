<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <router-link to="/" class="navbar-brand">IFCapp</router-link>
      <div class="navbar-nav me-auto">
        <li class="nav-item">
          <router-link to="/projects" class="nav-link">Projektid</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/mainlayout" class="nav-link">Viewer</router-link>
        </li>
      </div>
      <div class="navbar-nav">
        <li class="nav-item mr-sm-2">
          <router-link to="/addproject" class="nav-link">Login</router-link>
        </li>
        <li class="nav-item mr-sm-2">
          <router-link to="/addproject" class="nav-link">Logout</router-link>
        </li>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view />
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
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
