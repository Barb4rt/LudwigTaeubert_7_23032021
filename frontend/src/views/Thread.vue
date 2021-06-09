<template>
  <v-col lg="7" class="pa-0 mx-auto">
    <template v-if="!isLoading">
      <AddEvent
        class="d-none d-md-flex mx-auto justify-center flex-column pa-5"
        @post-sending="forceRerender"
        :key="componentKey"
      />
      <v-bottom-sheet class="d-md-none d-sm-flex" fixed v-model="expandAddPost">
        <v-sheet class="text-center py-8 px-2">
          <v-btn
            fab
            dark
            fixed
            bottom
            left
            class="red"
            @click="expandAddPost = false"
            name="button"
            ><v-icon>mdi-minus</v-icon></v-btn
          >
          <AddEvent @post-sending="forceRerender" :key="componentKey" />
        </v-sheet>
      </v-bottom-sheet>
      <v-divider inset class="d-none d-md-flex mx-auto my-4"></v-divider>
      <h1 class="text-center grey--text">Place public</h1>
      <EventCard
        class="elevation-10"
        v-for="event in arrayPost"
        :key="event.id"
        :event="event"
      />
    </template>
    <p v-else>Loading events</p>
    <v-bottom-sheet
      class="d-md-none d-sm-flex"
      fixed
      v-model="expandFilterPanel"
    >
      <v-sheet class="text-center py-8 px-2">
        <Filters />
      </v-sheet>
    </v-bottom-sheet>
    <BottomMobileNav
      @expandPost="expandAddPost = !expandAddPost"
      @expandFilter="expandFilterPanel = !expandFilterPanel"
    />
  </v-col>
</template>

<script>
import EventCard from "../components/EventCard";
import AddEvent from "../components/AddEvent";
import BottomMobileNav from "../components/BottomMobileNav";
import Filters from "../components/Filters.vue";

import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: { EventCard, AddEvent, BottomMobileNav, Filters },
  data() {
    return {
      isLoading: true,
      arrayPost: [],
      arrayComment: this.$store.state.events.Comments,
      show: true,
      overlay: false,
      componentKey: 0,
      expandAddPost: false,
      expandFilterPanel: false,
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
      if (newVal) {
        this.handleCreated().then(() => {
          this.isLoading = false;
          this.arrayPost = this.filteredPost;
        });
      }
      if (!newVal) {
        this.isLoading = false;
        this.arrayPost = this.eventList;
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
    forceRerender() {
      this.componentKey += 1;
    },
  },
};
</script>
