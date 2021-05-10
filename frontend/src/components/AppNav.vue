<template>
  <v-app-bar elevation="5" app   v-if="loggedIn == true"
      clipped >
    <v-app-bar-nav-icon class="d-md-none" @click="expandDrawer"  ></v-app-bar-nav-icon>
    <v-btn
      text
      rounded
      to="/thread"
      v-if="loggedIn"
    > What's new ?
    </v-btn>
    <v-spacer class="d-xs-none" ></v-spacer>
    <v-btn
      text
      rounded
      to="/privatethread"
    > Private
    </v-btn>
    <v-spacer class="d-xs-none"></v-spacer>
  </v-app-bar>
</template>

<script>

import { authComputed } from "../store/helper";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  
  props: {
    isMobile: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
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
        console.log('chargement');
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
