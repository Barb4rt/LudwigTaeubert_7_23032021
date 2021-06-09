<template>
  <v-app-bar hide-on-scroll elevation="5" app fixed  v-if="loggedIn == true"
      clipped >
    <v-app-bar-nav-icon class="d-lg-none" @click="expandDrawer"  ></v-app-bar-nav-icon>
    <v-btn class="d-none d-lg-flex" @click="expandDrawer" fab icon > <UserConnect  :profil="userConnect" :onlyProfilePicture="true" /></v-btn>
      <v-spacer class="d-xs-none" ></v-spacer>
    <v-btn
      class="d-none d-md-flex"
      text
      rounded
      to="/thread"
    > <v-icon>mdi-earth</v-icon><span class="ml-2">Place public</span>
    </v-btn>
     <v-btn
  class="d-md-none d-sm-flex"
     icon
      to="/thread"
    ><v-icon>mdi-earth</v-icon>
    </v-btn>
    <v-spacer class="d-xs-none" ></v-spacer>
    <v-btn
    class="d-none d-md-flex"
      text
      rounded
      to="/privatethread"
    > <v-icon>mdi-account</v-icon><span class="ml-2" >Place personnel</span>
    </v-btn>
    <v-btn
    class="d-md-none d-sm-flex"
     icon
      to="/privatethread"
    ><v-icon>mdi-account</v-icon>
    </v-btn>
    <v-spacer class="d-xs-none"></v-spacer>
    <v-btn
    v-if="userConnect.isAdmin === true"
    class="d-none d-md-flex"
      text
      rounded
      to="/admin"
    > <v-icon>mdi-account</v-icon><span class="ml-2" >Admin</span>
    </v-btn>
  </v-app-bar>
</template>

<script>

import { authComputed } from "../store/helper";
import { mapGetters, mapActions, mapState } from "vuex";
import UserConnect from "./UserConnect";

export default {
  components: {
    UserConnect
  },
  watch: {
   status(newVal, oldVal){
    console.log(`Updating from ${oldVal} to ${newVal}`);
    if (newVal === 'success') {
      this.handleCreated().then(()=>
      this.profil = this.userConnect
      )
    }
    }
  },
  computed: {
    ...authComputed,
    ...mapGetters(["userConnect"]),
    ...mapState(['status'])

  },
  created: function() {
    if(this.loggedIn){
 this.handleCreated()
    }
  },

  methods: {   
    ...mapActions(["GetUserProfil"]),
    async handleCreated(){
      try {
        await this.GetUserProfil();
        this.profil = this.userConnect;
        console.log(this.profil);
      }catch (e) {
        console.log(e);
      }
    },
    expandDrawer() {
            this.$emit('expandDrawer')
        }
    
  },
};
</script>

<style scoped>
/* #level{
  color: cornflowerblue;
} */
</style>
