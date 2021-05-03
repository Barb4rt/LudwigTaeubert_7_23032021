<template>
  <v-container fluid >
    <h1 class="text-center grey--text mb-2">Votre fil d'actualité</h1>
    <template v-if="!isLoading">
      <AddEvent />
      <EventCard v-for="event in arrayPost" :key="event.id" :event="event" />
    </template>
    <p v-else>Loading events</p>
  </v-container>
</template>

<script>
import EventCard from "../components/EventCard";
import AddEvent from "../components/AddEvent";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: { EventCard, AddEvent },
  data() {
    return {
      isLoading: true,
      arrayPost: [],
      arrayComment: this.$store.state.events.Comments,
      show: true,
      overlay: false,
      filter: null,
      tags: [
        "Work",
        "Home Improvement",
        "Vacation",
        "Food",
        "Drawers",
        "Shopping",
        "Art",
        "Tech",
      ],
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
  },
  created: function () {
    this.handleCreated().then(() => {
      this.isLoading = false;
      this.arrayPost = this.eventList;
    });
  },
  computed: {
    ...mapGetters(["eventList", "filteredPost", "userProfil"]),
    ...mapState(["status"]),
  },
  methods: {
    ...mapActions(["GetAllPost", "FilterPost"]),
    pushToArray(payload) {
      this.arrayPost.push(payload);
    },
    filterPost() {
      this.isLoading = true;
      let filter = this.filter;
      console.log(filter);
      if (filter) {
        this.$store.dispatch("FilterPost", filter).then(() => {
          this.isLoading = false;
          this.arrayPost = this.filteredPost;
        });
      } else {
        this.handleCreated().then(() => {
          this.isLoading = false;
          this.arrayPost = this.eventList;
        });
      }
    },
    async handleCreated() {
      try {
        await this.GetAllPost();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
