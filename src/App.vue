<template>
  <TheNavigation/>
  <TheLoader v-if="showLoading"/>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheNavigation from "./components/TheNavigation";
import TheLoader from "@/components/TheLoader";
import {mapState} from "vuex";
import {AUTO_LOGIN_ACTION} from "@/store/storeconstants";

export default {
  name: 'App',
  computed: {
    ...mapState({
      showLoading: state => state.showLoading,
      autoLogout: state => state.auth.autoLogout
    })
  },
  watch: {
    autoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace('/login')
      }
    }
  },
  components: {
    TheNavigation,
    TheLoader
  },
  created() {
    this.$store.dispatch(`auth/${AUTO_LOGIN_ACTION}`)
  }
}
</script>

<style>

</style>
