<template>
  <nav class="max-w-5xl mx-auto flex items-center gap-3">
    <router-link to="/">Home</router-link>
    <router-link to="/about">My Profile</router-link>
    <router-link class="ml-auto" to="/login">Login</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}

body {
  background-color: #202A25;
}

nav {
  padding: 20px;
}

nav a {
  font-weight: bold;
  color: white;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
