<template>
  <div class="container-fluid register ml-0">
    <div class="row">
      <div class="col-12">
        <div class="tab-content" id="v-pills-tabContent">
          <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
            <div id="register">
              <div class="container py-5">
              <div class="row justify-content-center">
                <h1 class="page-header col-12">REGISTER</h1>
                <span class="col-12">Note : hanya dapat diakses pada saat login, admin baru harus didaftarkan oleh admin lama.</span>
                <div class="col-9 card shadow mt-5 p-3">
                  <div class="register">
                    <h3>Register</h3>
                    <form action="index.html">

                      <div class="form-group">
                          <label for="email">Email</label>
                          <input type="email" id="email" class="form-control" placeholder="Email" v-model="email" required>
                      </div>
                      <div class="form-group">
                          <label for="password">Password</label>
                          <input type="password" id="password" class="form-control" placeholder="Password" v-model="password" required>
                      </div>
                      <button v-on:click.prevent="register" class="btn btn-custom float-right">Register</button>

                    </form>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'register',
  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    register: function(e) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            console.log(user);
            alert(`Account Created for ${user.email}`);
            this.$router.push('/result');


            // firebase.auth().onAuthStateChanged(function(user){
            //   if (user){
            //     console.log(user);
            //     this.$router.go({path: this.$router.path});
            //   }
            //   else  {
            //     console.log("sign-out");
            //   }
            // })
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    }
  }
};
</script>