<template v-if="profil">
<div>
  <h1 class="text-center grey--text my-2">
      Bienvenue sur le profil de {{ profil.username }}
      </h1>
      <v-divider class="my-5 mx-12"></v-divider>
  <div class="d-md-flex my-2">
    <v-col cols="d-md-4 px-15">
      <div id="rounded-card">
        <v-img 
        aspect-ratio="1"
         :src="profil.profilePicture">
        </v-img>
        </div>
    </v-col>
    <v-col cols="d-sm-10 text-center">
          <div class="">
            <div class="font-weight-medium" >Son niveau de réputation est : </div>
          <ExpBar id="expBar" :exp="profil.exp"/>
          <v-divider class="my-5 mx-12"></v-divider>
          <h3 class="text-center font-weight-medium my-5 "> Sa biographie : </h3>
          <div class="font-weight-light px-5" >{{profil.bio}}</div>
        </div>
    </v-col>
        
  </div>
    <v-divider class="my-5 mx-12"></v-divider>
    <v-container fluid>
    <h1 class="text-center grey--text my-2">Ses messages</h1>
    <template v-if="!isLoading">
      <EventCard v-for="event in arrayPost" :key="event.id" :event="event" />
    </template>
    <p v-else>Loading events</p>
  </v-container>
  </div> 
</template>

<script>
import { mapGetters } from "vuex";
import EventCard from "../components/EventCard";
import ExpBar from "../components/ExpStatus"

export default {
  components: {EventCard, ExpBar},
  data() {
    return {
      isLoading: true,
      arrayPost:[],
    };
  },
  computed:{
    ...mapGetters(["eventList",'profil'])
  },
  methods: {
    presenceOfProfil(){
      if(!this.profil){
        this.$router.push({name: "thread"})
      }
    },
    userPost(){
      this.eventList.forEach(element => {
        if(element.UserId === this.profil.id)
        {
          this.arrayPost.push(element)
        }
      });
    },
    async handleCreated() {
      try {
        await this.presenceOfProfil();
        await this.userPost(); 
      } catch (e) {
        console.log(e);
      }
    }
  },
  created (){
    this.handleCreated().then(() => {
      this.isLoading = false;
    });
    
  }
  }
</script>
<style scoped>
#rounded-card {
  border-radius: 50%;
  overflow: hidden;
}
</style>