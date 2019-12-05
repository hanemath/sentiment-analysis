<template>
    <div id="app" class="mb-5">
      <nav class="navbar .navbar-expand{-sm|-md|-lg|-xl} navbar-dark custombg fixed-top">
        <router-link v-if="isLoggedIn" class="navbar-brand active" to="/">
            <img src="../assets/logougmputih.png" class="col-1 p-0 img-responsive">
            <b>SENTIMEN</b>
        </router-link>
        <router-link class="on-user ml-auto px-4" to="/" v-if="isLoggedIn">hey {{currentUser}}, you're on!</router-link>
        <button class="navbar-toggler m-0" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <form class="row align-items-center form-inline ml-auto">
                <router-link v-if="!isLoggedIn" class="link-nav" to="/login">Login</router-link>
                <router-link v-if="isLoggedIn" class="link-nav col-12" to="/register">Daftar Admin Baru</router-link>
                <router-link v-if="isLoggedIn" class="link-nav col-12" to="/coba">Download Data Sentimen</router-link>
                <router-link v-if="isLoggedIn" class="link-nav col-12" to="/result">BI Dashboard Panel</router-link><br> 
                <button v-if="isLoggedIn" class="btn btn-secondary mr-2 ml-auto" v-on:click="logout">Logout</button>
            </form>
        </div>
      </nav>
    </div>  
</template>

<script>
import firebase from 'firebase';
export default {
        name : 'navbar',
        data() {
            return {
                isLoggedIn: false,
                currentUser: false,
            };
        },
        created() {
            if (firebase.auth().currentUser) {
            this.isLoggedIn = true;
            this.currentUser = firebase.auth().currentUser.email;
            }
        },
        methods: {
            logout: function() {
            firebase
                .auth()
                .signOut()
                .then(() => {
                //this.$router.push('/login');
                this.$router.go({path: this.$router.path});
                });
            }
        }
    }
</script>
<style>
nav form .form-inline {
    margin: 0;
    padding: 0;
}
nav .on-user{
    color:#fff;
}
nav .link-nav {
    color: #fff;
}
#app .custombg {
    background-color: #01203c
}
</style>

