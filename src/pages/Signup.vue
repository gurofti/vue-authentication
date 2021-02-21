<template>

  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div>
        <div>
          <h3>Signup</h3>
          <hr/>
        </div>

        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <form @submit.prevent="onSignup()">
          <!-- Email -->
          <div class="form-group">
            <label>Email</label>
            <input
                type="email"
                v-model.trim="email"
                class="form-control"
            />
            <div class="text-danger" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>Password</label>
            <input
                type="text"
                v-model.trim="password"
                class="form-control"
            />
            <div class="text-danger" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <!-- Submit -->
          <div class="my-3">
            <button type="submit" class="btn btn-primary">Signup</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import SignupValidations from "@/services/SignupValidations";
import {mapActions, mapMutations} from "vuex";
import {LOADING_SPINNER_SHOW_MUTATION, SIGNUP_ACTION} from "@/store/storeconstants";

export default {
  data() {
    return {
      email: '',
      password: '',
      errors: [],
      error: ''
    }
  },
  methods: {
    ...mapActions('auth', {
      signup: SIGNUP_ACTION
    }),
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION
    }),
    onSignup() {
      let validations = new SignupValidations(
          this.email,
          this.password
      )
      this.errors = validations.checkValidations()
      if ('email' in this.errors || 'password' in this.errors) {
        return false
      }
      // make spinner true
      this.showLoading(true)
      // signup registration
      this.signup({
        email: this.email,
        password: this.password
      }).catch((error) => {
        this.error = error
        this.showLoading(false)
      })
      this.showLoading(false)
    }
  }
}
</script>

<style scoped>

</style>