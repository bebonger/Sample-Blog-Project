<template>
    <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 px-6 gap-6">
        <div class="login-card max-w-lg flex flex-col gap-2 rounded-xl w-full items-center justify-center p-5">
            <h1 v-if="!registering" class="font-bold text-3xl">Login</h1>
            <h1 v-else class="font-bold text-3xl">Create Account</h1>
            <br>
            <p v-if="registering" class="w-full text-white/50">Email</p>
            <input v-if="registering" class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="text" v-model="email"/>
            <p v-if="!validateEmail() && registering" class="text-red-300/50 w-full text-end">Invalid Email</p>
            <br v-if="registering">
            <p class="w-full text-white/50">Username</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="text" v-model="username"/>
            <p v-if="!validateUsername() && registering" class="text-red-300/50 w-full text-end">Username cannot be empty or contain special characters</p>
            <br v-if="registering">
            <p class="w-full text-white/50">Password</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="password" v-model="password"/> 
            <p v-if="!validatePassword() && registering" class="text-red-300/50 w-full text-end">
                Password must have: 
                <ul>
                    <li>&#x2022; 10 or more characters</li>
                    <li>&#x2022; Lower case characters</li>
                    <li>&#x2022; Upper case characters</li>
                </ul>
            </p>
            <br v-if="registering">
            <p v-if="registering" class="w-full text-white/50">Re-enter Password</p>
            <input v-if="registering" class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="password" v-model="repassword"/> 
            <button v-if="!registering" @click="startRegister" class="w-full text-end text-sm p-4 text-white/50 hover:text-white transition-all">Create Account</button>
            <button v-else @click="startLogin" class="w-full text-end text-sm p-4 text-white/50 hover:text-white transition-all">Back to login</button>
            <button v-if="!registering" @click="login" class="w-full p-5 rounded-3xl border-[1px] hover:bg-white hover:text-black transition-all">Login</button>
            <button v-else @click="register" class="w-full p-5 rounded-3xl border-[1px] hover:bg-white hover:text-black transition-all">Register</button>
        </div>
    </div>
</template>
  
<script>
import { SHA256, enc } from 'crypto-js';
import axios from 'axios';
import router from '@/router';

export default {
    name: 'LoginView',
    data() {
        return {
            email: "",
            username: "",
            password: "",
            repassword: "",
            displayName: "",
            registering: false,
        }
    },
    methods: {
        async login() {
            const res = await axios.post("/api/auth/login", {
                username: this.username,
                password: await this.encryptPassword(this.password)
            });
            if (res.data.status == 1) {
                alert("Login successful");
                const _user = await axios.get("/api/me", { withCredentials: true });
                this.$store.state.user = _user.data;
                router.push({ path: "/" });
            } else if (res.data.status == 0) {
                alert("Wrong username or password");
                this.username = "";
                this.password = "";
            }
        },
        startRegister() {
            this.registering = true;
            this.username = "";
            this.password = "";
            this.repassword = "";
        },
        startLogin() {
            this.registering = false;
            this.username = "";
            this.password = "";
        },
        async register() {
            if (!this.validateEmail() || !this.validateUsername() || !this.validatePassword()) {
                alert("Incorrect fields");
                return;
            }

            if (!this.passwordsMatch()) {
                alert("Passwords do not match");
                return;
            }
            
            const res = await axios.post("/api/auth/register", {
                username: this.username,
                email: this.email,
                password: await this.encryptPassword(this.password)
            });

            if (res.data.status == 1) {
                alert("User created successfully");
                const _user = await axios.get("/api/me", { withCredentials: true });
                this.$store.state.user = _user.data;
                router.push({ path: "/" });
            } else if (res.data.status == 0) {
                alert("User already exists");
                this.username = "";
                this.password = "";
                this.repassword = ""; 
            }
        },
        async encryptPassword(password) {
            let encrypted = SHA256(password).toString(enc.Hex);
            return encrypted;
        },
        validateEmail() {
            return String(this.email)
                .toLowerCase()
                .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        },
        validateUsername() {
            return String(this.username).match(/^[a-zA-Z0-9_]+$/);
        },
        validatePassword() {
            return String(this.password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/);
        },
        passwordsMatch() {
            return this.password == this.repassword;
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