<template>
    <div class="max-w-5xl mx-auto flex flex-col items-center justify-center pt-6 px-6 gap-6">
        <form class="login-card max-w-lg flex flex-col gap-2 rounded-xl w-full items-center justify-center p-5">
            <h1 class="font-bold text-3xl">Change Password</h1>
            <br>
            <p class="w-full text-white/50">Current Password</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="password" autocomplete="current-password" v-model="oldPassword"/>
            <br>
            <p class="w-full text-white/50">New Password</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="password" autocomplete="new-password" v-model="newPassword1"/>
            <p v-if="!validatePassword()" class="text-red-300/50 w-full text-end">
                Password must have: 
                <ul>
                    <li>&#x2022; 10 or more characters</li>
                    <li>&#x2022; Lower case characters</li>
                    <li>&#x2022; Upper case characters</li>
                </ul>
            </p>
            <br>
            <p class="w-full text-white/50">Re-enter New Password</p>
            <input class="w-full h-10 bg-transparent border-b-[1px] border-white/50 outline-none focus:border-white transition-all" type="password" autocomplete="new-password" v-model="newPassword2"/> 
            <br>
            <button type="button" @click="changePassword" class="w-full p-5 rounded-3xl border-[1px] hover:bg-white hover:text-black transition-all">Change Password</button>
        </form>
    </div>
</template>
  
<script>
import { SHA256, enc } from 'crypto-js';
import axios from 'axios';
import router from '@/router';
import STATUS_TYPES from '@/../../global/DataTypes.mjs'

export default {
    name: 'ChangePasswordView',
    mounted() {
        if (!this.$store.getters.isLoggedIn) {
            router.push("/");
            return;
        }
    },
    data() {
        return {
            oldPassword: "",
            newPassword1: "",
            newPassword2: "",
        }
    },
    methods: {
        async changePassword() {
            if (!this.validatePassword()) {
                alert("Incorrect fields");
                return;
            }

            if (!this.passwordsMatch()) {
                alert("Passwords do not match");
                return;
            }

            const res = await axios.post("/api/me/change-pass", {
                currPassword: await this.encryptPassword(this.oldPassword),
                newPassword: await this.encryptPassword(this.newPassword1)
            });

            console.log(res.data);

            if (res.data.status == STATUS_TYPES.FAILURE) {
                alert("Something went wrong: " + res.data.message);
                return;
            }

            alert("Password changed successfully");
            router.push("/");
        },
        async encryptPassword(password) {
            let encrypted = SHA256(password).toString(enc.Hex);
            return encrypted;
        },
        validatePassword() {
            return String(this.newPassword1).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/);
        },
        passwordsMatch() {
            return this.newPassword1 == this.newPassword2;
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