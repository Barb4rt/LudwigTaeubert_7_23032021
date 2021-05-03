<template>
<v-container v-if="profil" class="d-flex flex-column"  >
  <div class="d-flex my-2">
      <div  id="rounded-card">
        <v-img 
         :src="profil.profilePicture">
        </v-img>
        </div>
        <div class="d-flex flex-column">
          <div>STATUS</div>
          <div>{{profil.username}}</div>
          <div>{{profil.bio}}</div>
        </div>
  </div>
    <v-divider></v-divider>
    <v-container>
    <h1 class="text-center grey--text mb-2">File d'actualité</h1>
    <template v-if="!isLoading">
      <EventCard v-for="event in arrayPost" :key="event.id" :event="event" />
    </template>
    <p v-else>Loading events</p>
  </v-container>
  </v-container> 
</template>

<script>
import { mapGetters } from "vuex";
import EventCard from "../components/EventCard";

export default {
  components: {EventCard},
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
  width: 25%;
  border-radius: 50%;
  overflow: hidden;
}
</style>