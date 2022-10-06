<template>
  <div class="col-md-12">
    <div class="card card-container">
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            v-model="user.email"
            type="text"
            class="form-control"
            name="email"
          />
        </div>
        <label v-if="showEmailRequiredError" class="error">Väli E-mail on kohustuslik</label>
        <div class="form-group">
          <label for="password">Parool</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            name="password"
          />
        </div>
        <label v-if="showPassRequiredError" class="error">Väli Parool on kohustuslik</label>
        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Logi sisse</span>
          </button>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import LoginUser from '../../models/loginUser';

export default {
  name: 'Login',
  data() {
    return {
      user: new LoginUser('', ''),
      loading: false,
      message: '',
      showEmailRequiredError: false,
      showPassRequiredError: false
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/projects');
    }
  },
  methods: {
    handleLogin() {
      if (this.user.email == ''){
        this.showEmailRequiredError = true;
      }
      else if (this.user.password == ''){
        this.showPassRequiredError = true;
        this.showEmailRequiredError = false;
      }
      else
      {
        this.loading = true;

        if (this.user.email && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(
            () => {
            this.$router.push('/projects');
            },
            error => {
            this.loading = false;
            this.message =
                (error.response && error.response.data) ||
                "Vale E-mail või parool. Sisselogimine ebaõnnestus."
            }
        );
        this.showPassRequiredError = false;
        }
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