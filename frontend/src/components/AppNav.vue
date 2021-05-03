<template>
  <v-app-bar  app>
    <v-toolbar-title>Groupomania</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      text
      rounded
      to="/thread"
      v-if="loggedIn"
    > What's new ?
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      text
      rounded
      to="/thread/privatethread"
      v-if="loggedIn"
    > Private
    </v-btn>
    <v-spacer></v-spacer>
          <v-menu v-if="loggedIn == true" offset-y>
          <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            icon
          >
            <v-avatar color="grey darken-3">
            <v-img 
                alt=""
                 :src= profil.profilePicture
              ></v-img>
              </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(link, index) in links"
            :key="index"
            :to="link.url"
          >
            <v-list-item-title>{{ link.label }}</v-list-item-title>
          </v-list-item>
          <v-list-item-action>
            <v-list-item>
            <v-switch
        @change="toggleTheme"
        :label="switchLabel"
      ></v-switch>
      </v-list-item>
      <v-list-item>
          <v-btn type="button" class="Danger" @click="logout">
      Logout
    </v-btn>
    </v-list-item>
    </v-list-item-action>
        </v-list>
      </v-menu>
<v-chip
  color="blue"
  dark
  class="pa-1"
><ExpBar id="level" :fullDisplay="false" :exp="profil.exp"/></v-chip>
  </v-app-bar>
  
</template>

<script>
import ExpBar from "./ExpStatus"
import { authComputed } from "../store/helper";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: { ExpBar },
  data() {
    return {
      links: [
      { label: 'Mon tableau de bord',
      url:'/dashboard/user' },
      ],
     profil: {},
     switchLabel:'Light'
    };
  },
  watch: {
   status(newVal, oldVal){
    console.log(`Updating from ${oldVal} to ${newVal}`);
    if (newVal === 'success') {
      this.handleCreated().then(()=>
      this.profil = this.userProfil
      )
      
    }
    }
  },
  computed: {
    ...authComputed,
    ...mapGetters(["userProfil"]),
    ...mapState(['status'])

  },
  created: function() {
    if(this.loggedIn){
 this.handleCreated()
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
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
    }
    
  },
};
</script>

<style scoped>
/* #level{
  color: cornflowerblue;
} */
</style>
