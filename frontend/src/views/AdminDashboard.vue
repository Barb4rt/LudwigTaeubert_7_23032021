<template>
  <v-col lg="7" class="pa-0 mx-auto">
    <v-list subheader>
      <v-subheader>Liste des utilisateur</v-subheader>

      <v-list-item v-for="user in users" :key="user.id">
        <v-list-item-avatar>
          <v-img
            :alt="`${user.username} avatar`"
            :src="user.profilePicture"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="user.username"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-btn v-if="user.id > 1" icon @click="destroyProfil(user.id)">
            <v-icon color="red"> mdi-delete </v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <template v-if="!isLoading">
      <v-divider inset class="d-none d-md-flex mx-auto my-4"></v-divider>
      <v-list subheader>
        <v-subheader>Liste des messages</v-subheader>

        <v-list-item two-line v-for="post in arrayPost" :key="post.id">
          <v-list-item-avatar>
            <v-img
              :alt="`${post.User.username} avatar`"
              :src="post.User.profilePicture"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="post.User.username"></v-list-item-title>
            <v-list-item-subtitle v-text="post.content"
              >Secondary text</v-list-item-subtitle
            >
            <v-img
              max-width="25%"
              class="mx-auto rounded-xl d-flex align-end"
              :alt="`${post.User.username} photo envoyer`"
              v-if="post.attachment"
              :src="post.attachment"
            >
            </v-img>
          </v-list-item-content>

          <v-list-item-icon>
            <v-btn icon @click="destroyPost(post.id)">
              <v-icon color="red"> mdi-delete </v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </template>
    <p v-else>Loading events</p>
    <v-overlay :value="overlay"
      ><v-alert type="success"> Profil mis à jour </v-alert></v-overlay
    >
  </v-col>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: {},
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
    status(newVal) {

      if (newVal === "success") {
        this.handleCreated().then(() => {
          this.isLoading = false;
          this.arrayPost = this.eventList;
        });
      }
    },
    filteredPost(newVal) {
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
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 2000);
    },
  },
  created: function () {
    this.handleCreated().then(() => {
      this.isLoading = false;
      this.arrayPost = this.eventList;
    });
  },
  computed: {
    ...mapGetters(["eventList", "filteredPost", "users"]),
    ...mapState(["status", "filteredPost"]),
  },
  methods: {
    ...mapActions([
      "GetAllPost",
      "FilterPost",
      "GetAllUsers",
      "adminDestroyProfil",
    ]),
    pushToArray(payload) {
      this.arrayPost.push(payload);
    },
    destroyProfil(userId) {
      this.$store
        .dispatch("adminDestroyProfil", userId)
        .then(() => {
          this.overlay = !this.overlay;
        })
        .catch((err) => {
          this.error = err;
        });
    },
    destroyPost(postId) {
      this.$store
        .dispatch("adminDestroyPost", postId)
        .then(() => {
          console.log("message supprimé");
        })
        .catch((err) => {
          this.error = err;
        });
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
