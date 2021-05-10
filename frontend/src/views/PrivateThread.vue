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
    };
  },
  watch: {
    status(newVal, oldVal) {
      console.log(`Updating from ${oldVal} to ${newVal}`);
      if (newVal === "success") {
        this.handleCreated().then(() => {
          this.isLoading = false;
          this.arrayPost = this.filteredPost;
        });
      }
    },
  },
  created: function () {
    this.handleCreated().then(() => {
      this.isLoading = false;
      this.arrayPost = this.filteredPost;
    });
  },
  computed: {
    ...mapGetters(["filteredPost", "userConnect"]),
    ...mapState(["status"]),
  },
  methods: {
      ...mapActions(["FilterPost", "GetAllPost","GetAllUsers"]),
      filterPost(filter) {
        this.$store.dispatch("FilterPost", filter)
    },
    async handleCreated() {
      try {
        await this.GetAllPost();
        await this.GetAllUsers();
        await this.filterPost(this.userConnect.tags.split(','));
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
