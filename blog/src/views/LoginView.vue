<template>
    <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 px-6 gap-6">
        <div class="login-card max-w-lg flex flex-col gap-2 rounded-xl w-full items-center justify-center p-5">
            <h1 class="font-bold text-3xl">Login</h1>
            <p class="w-full text-white/50">Username</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="text" v-model="username"/>
            <br>
            <p class="w-full text-white/50">Password</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="text" v-model="password"/> 
            <br>
            <div class="w-full flex gap-5">
                <button class="w-full p-5 rounded-3xl border-[1px] hover:bg-white hover:text-black transition-all">Login</button>
                <button class="w-full p-5 rounded-3xl border-[1px] hover:bg-white hover:text-black transition-all">Register</button>
            </div>
        </div>
    </div>
</template>
  
<script>
  export default {
    name: 'LoginView',
    data() {
        return {
            username: "",
            password: "",
            displayName: "",
        }
    }

  }
</script>
  
<style>
.login-card {
    background-color: #202A25;
    filter: drop-shadow(0 0px 8px rgb(0 0 0 / 0.2)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}
</style>