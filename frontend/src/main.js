import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  store,

  created() {
    const userString = localStorage.getItem("user"); // grab user data from local storage
    if (userString) {
      // check to see if there is indeed a user
      const userData = JSON.parse(userString); // parse user data into JSON
      this.$store.commit("SET_USER_DATA", userData); // restore user data with Vuex
      this.$store.dispatch("GetUserProfil")
      this.$router.push({ name: "userdashboard" });

    }
    axios.interceptors.response.use(
      (response) => response, // simply return the response
      (error) => {
        if (error.response.status === 401) {
          // if we catch a 401 error
          this.$store.dispatch("logout"); // force a log out
        }
        return Promise.reject(error); // reject the Promise, with the error as the reason
      }
    );
  },

  vuetify,
  render: (h) => h(App),
}).$mount("#app");
