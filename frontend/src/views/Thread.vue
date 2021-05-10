<template>
  <v-container>
    <h1 class="text-center grey--text mb-2">File d'actualité</h1>
    <template v-if="!isLoading">
      <AddEvent/>
      <EventCard  v-for="event in arrayPost" :key="event.id" :event="event" />
    </template>
    <p v-else>Loading events</p>
  </v-container>
</template>

<script>
import EventCard from "../components/EventCard";
import AddEvent from "../components/AddEvent";

import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: { EventCard, AddEvent},
  data() {
    return {
      isLoading: true,
      arrayPost: [],
      arrayComment: this.$store.state.events.Comments,
      show: true,
      overlay: false,
    };
  },
  watch: {
    status(newVal, oldVal) {
      console.log(`Updating from ${oldVal} to ${newVal}`);
      if (newVal === "success") {
        this.handleCreated().then(() => {
          this.isLoading = false;
          this.arrayPost = this.eventList;
        });
      }
    },
    filteredPost(newVal, oldVal) {
      console.log(`Updating from ${oldVal} to ${newVal}`);
      if (newVal ) {
        this.handleCreated().then(() => {
          this.isLoading = false;
          this.arrayPost = this.filteredPost;
        });
      }
      if(!newVal){
        this.isLoading = false;
          this.arrayPost = this.eventList;
      }
    }
  },
  created: function () {
    this.handleCreated().then(() => {
      this.isLoading = false;
      this.arrayPost = this.eventList;
    });
  },
  computed: {
    ...mapGetters(["eventList", "filteredPost", "userProfil", "users"]),
    ...mapState(["status", "filteredPost"]),
  },
  methods: {
    ...mapActions(["GetAllPost", "FilterPost", "GetAllUsers"]),
    pushToArray(payload) {
      this.arrayPost.push(payload);
    },
    async handleCreated() {
      try {
        await this.GetAllPost();
        await this.GetAllUsers();    
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
