<template>
  <nav class="max-w-5xl mx-auto flex items-center gap-3">
    <router-link to="/">Home</router-link>
    <router-link v-if="this.$store.getters.isLoggedIn" to="/my-profile">My Profile</router-link>
    <button @click="logout" v-if="this.$store.getters.isLoggedIn" class="ml-auto font-bold" to="">Logout</button>
    <router-link v-if="!this.$store.getters.isLoggedIn" class="ml-auto" to="/login">Login</router-link>
  </nav>
  <router-view/>
</template>

<script>
import axios from 'axios';
import STATUS_TYPES from '@/../../global/DataTypes.mjs'
import router from './router';

export default {
  async mounted() {
    const res = await axios.get("/api/me");
    if (res.data.status == STATUS_TYPES.SUCCESS) {
      this.$store.state.user = res.data.user;
    }
  },
  methods: {
    async logout() {
      await axios.get("/api/auth/logout");
      this.$store.state.user = null;
      alert("Logged out successfully");
      router.push("/");
    }
  }
}
</script>

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
