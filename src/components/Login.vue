<template>
  <div id="login" class="login">
    <div class="container py-5">
    <div class="row justify-content-center my-5">
      <div class="col-6 card shadow py-3">
        <div class="login">
          <h3 class="text-center">Login Admin</h3>
          <form>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Email" v-model="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Password" v-model="password" required>
            </div>
            <button v-on:click="login" class="btn btn-dark float-right">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import firebase from 'firebase';
export default {
    name: 'login',
    data: function() {
        return {
        email: '',
        password: ''
        };
    },
    methods: {
        login: function(e) {
        firebase
            .auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then(
              user => {
                alert(`You'e logged in as ${user.email}`);
                this.$router.push('/');
              },
              //for the next usage

              // user => {
              //     console.log(user);
              //     this.$router.go({path: this.$router.path});
              // },
              err => {
                  console.log(err);
              }
            );
        e.preventDefault();
        }
    }
};
</script>