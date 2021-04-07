<template>
  <div>
    <h1>Dashboard</h1>
    <template v-if="!isLoading">
      <EventCard
        @deleteEvent="eventId"
        v-for="event in arrayPost"
        :key="event.id"
        :event="event"
      />
      <AddEvent @addEventToArraysPost="pushToArray" />
    </template>
    <p v-else>Loading events</p>
  </div>
</template>

<script>
import EventCard from "../components/EventCard";
import AddEvent from "../components/AddEvent";
import axios from "axios";
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
    this.$store.dispatch("getUsersEvent").then(() => {
      this.isLoading = false;
      this.arrayPost = this.$store.state.events;
    });
  },
  computed: {
    ...mapGetters(["eventList"]),
  },
  methods: {
    ...mapActions(["getUsersEvent"]),
    pushToArray(payload) {
      this.arrayPost.push(payload);
    },
    eventId(payload) {
      axios
        .delete(`http://localhost:8081/api/messages/${payload}`)
        .then((res) => {
          res.status(200);
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
  },
};
</script>
