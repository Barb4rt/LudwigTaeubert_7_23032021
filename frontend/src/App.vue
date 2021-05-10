<template>
  <v-app id="app" width="100vw">
      <AppNav @expandDrawer="expandDrawer"
      />
<v-navigation-drawer 
            app
            v-model="expand"
            v-if="loggedIn == true"
            clippedleft
        >
          <UserConnect :profil="userConnect" />
         <div class="mx-2 d-flex flex-column align-center"> 
           <p>Changer de theme</p>
           <v-switch
        @change="toggleTheme"
        :label="switchLabel"
      ></v-switch>
      </div>
        <filters/>
</v-navigation-drawer>

    <v-main class=" lighten-3">
      <v-container fluid>
            <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppNav from "./components/AppNav";
import Filters from "./components/Filters";
import UserConnect from "./components/UserConnect";
// import GroupomaniaIcon from "./components/GroupomaniaIcon";
import { mapGetters, mapActions, mapState } from "vuex";

import { authComputed } from "./store/helper";


export default {
  name: "App",

  components: {
    AppNav,
     Filters,
    // GroupomaniaIcon,
    UserConnect
  },
  data: () => ({
    expand : true,
    isMobile : false,
    links: [
      { label: 'Mon tableau de bord',
      url:'/dashboard/user' },
      ],
     profil: {},
     switchLabel:'Light',
  }),
  computed:  {
    ...authComputed,
    ...mapGetters(["userConnect"]),
    ...mapState(['status'])
  },
  methods:{ 
  expandDrawer(){
     this.expand = !this.expand
  },
  logout() {
      this.$store.dispatch("Logout");
    },
    toggleTheme() {
      this.$vuetify.theme.themes.dark.anchor = "#41B883";
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.switchLabel = this.switchLabel == 'Light' ? 'Dark' : 'Light'
    },
    ...mapActions(["GetUserProfil"]),
    async handleCreated(){
      try {
        await this.GetUserProfil();
      }catch (e) {
        console.log(e);
      }
  },
  },

  created(){
    if(this.loggedIn){
    this.handleCreated()
    }
  }
};
</script>
