<template>
  <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 px-6 gap-6">
    <h1 class="font-bold text-5xl">My Profile</h1>
    <div v-if="this.$store.getters.isLoggedIn" class="user-card max-w-lg flex flex-col gap-2 rounded-xl w-full items-center justify-center p-5">
      <p>Email: {{ this.$store.state.user.email }}</p>
      <p>Username: {{ this.$store.state.user.username }}</p>
      <p>Password: *********</p>
      <router-link to="/change-password" @click="startChangingPassword" class="border-[1px] p-2 rounded-lg hover:bg-white hover:text-black transition-all mt-2">Change Password</router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import router from '@/router';

export default {
  name: 'ProfileView',
  async mounted() {
    
    if (!this.$store.getters.isLoggedIn) {
      router.push("/");
      return;
    }
  },
  methods: {
  },
  data() {
    return {
      posts: [],
      changingPassword: false,
      oldPassword: "",
      newPassword1: "",
      newPassword2: "",
    }
  }
}
</script>

<style>
.post-create {
  background-color: #344844;
}


.user-card {
    background-color: #202A25;
    filter: drop-shadow(0 0px 8px rgb(0 0 0 / 0.2)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}
</style>
