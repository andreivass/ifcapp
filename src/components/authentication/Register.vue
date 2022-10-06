<template>
  <div class="col-md-12">
    <div class="card card-container">
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <div class="form-group">
            <label for="firstName">Eesnimi</label>
            <input
              v-model="user.firstName"
              type="text"
              class="form-control"
              name="firstName"
            />
          </div>
          <label v-if="showFirstNameRequiredError" class="error">Väli Eesnimi on kohustuslik</label>
          <div class="form-group">
            <label for="lastName">Perekonnanimi</label>
            <input
              v-model="user.lastName"
              type="text"
              class="form-control"
              name="lastName"
            />
          </div>
          <label v-if="showLastNameRequiredError" class="error">Väli Perekonnanimi on kohustuslik</label>
          <div class="form-group">
            <label for="email">E-mail (kasutajanimi)</label>
            <input
              v-model="user.email"
              type="email"
              class="form-control"
              name="email"
            />
          </div>
          <div class="form-group">
            <label for="password">Parool</label>
            <input
              v-model="user.password"
              type="password"
              class="form-control"
              name="password"
            />
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block">Registreeri</button>
          </div>
        </div>
      </form>

      <div
        v-if="message"
        class="alert"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message}}</div>
    </div>
  </div>
</template>

<script>
import RegisterUser from '../../models/registerUser';

export default {
  name: 'Register',
  data() {
    return {
      user: new RegisterUser('', '', '', ''),
      submitted: false,
      successful: false,
      message: '',
      showFirstNameRequiredError: false,
      showLastNameRequiredError: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/projects');
    }
  },
  methods: {
    handleRegister() {

      if (this.user.firstName == ''){
        this.showFirstNameRequiredError = true;
      }
      else if (this.user.lastName == ''){
        this.showLastNameRequiredError = true;
        this.showFirstNameRequiredError = false;
      }
      else
      {
        this.message = '';
        this.submitted = true;

        this.$store.dispatch('auth/register', this.user).then(
            () => {
              // TODO: succ handling + nav to projects/login
            this.message = 'Registreerimine edukas.';
            this.successful = true;
            },
            error => {
            this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            this.successful = false;
            }
        );

        this.showLastNameRequiredError = false;
      }
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error {
  color: red;
}
</style>