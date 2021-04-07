<template>
  <div>
    <h1>Dashboard</h1>
    <template v-if="!isLoading">
      <EventCard
        v-for="event in arrayPost"
        :key="event.id"
        :event="event"
        :isUser="false"
      />
      <AddEvent @addEventToArraysPost="pushToArray" />
    </template>
    <p v-else>Loading events</p>
  </div>
</template>

<script>
import EventCard from "../components/EventCard";
import AddEvent from "../components/AddEvent";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { EventCard, AddEvent },
  data() {
    return {
      isLoading: true,
      arrayPost: this.$store.state.events,
    };
  },
  created() {
    this.$store.dispatch("getAllEvent").then(() => {
      this.isLoading = false;
      this.arrayPost = this.$store.state.events;
    });
  },
  computed: {
    ...mapGetters(["eventList"]),
  },
  methods: {
    ...mapActions(["getAllEvent"]),
    pushToArray(payload) {
      this.arrayPost.push(payload);
    },
  },
};
</script>
