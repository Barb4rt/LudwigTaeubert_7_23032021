<template>
  <v-container fluid>
    <div v-if="onlyProfilePicture === true" class="d-flex align-center">
      <v-avatar :style="levelColor">
        <v-img alt="" :src="profil.profilePicture"></v-img>
      </v-avatar>

      <ExpBar
        id="level"
        @level-color="PPBordercolor"
        class="d-none"
        :exp="profil.exp"
      />
    </div>
    <div v-else>
      <div class="d-flex align-center">
        <v-avatar :style="levelColor">
          <v-img alt="" :src="profil.profilePicture"></v-img>
        </v-avatar>
        <div class="mx-2 d-flex flex-column align-center">
          {{ profil.username }}
          <ExpBar
            id="level"
            @level-color="PPBordercolor"
            class="d-none"
            :exp="profil.exp"
          />
        </div>
      </div>
      <v-list>
        <v-list-item v-for="(link, index) in links" :key="index" :to="link.url">
          <v-list-item-title>{{ link.label }}</v-list-item-title>
        </v-list-item>
        <v-list-item-action>
          <v-list-item>
            <v-btn
              type="button"
              color="red"
              class="ma-2 white--text"
              @click="logout"
            >
              Logout
            </v-btn>
          </v-list-item>
        </v-list-item-action>
      </v-list>
    </div>
  </v-container>
</template>

<script>
import ExpBar from "./ExpStatus";
import {
  mapGetters,
  //  mapActions,
  mapState,
} from "vuex";
import { authComputed } from "../store/helper";
export default {
  name: "UserConnect",
  components: { ExpBar },
  props: {
    profil: {
      type: Object,
      require: true,
      default: () => {
        return {};
      },
    },
    onlyProfilePicture: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      links: [{ label: "Mon tableau de bord", url: "/dashboard/user" }],
      switchLabel: "Light",
      levelColor: "",
    };
  },
  computed: {
    ...authComputed,
    ...mapGetters(["userConnect"]),
    ...mapState(["status"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("Logout");
    },
    toggleTheme() {
      this.$vuetify.theme.themes.dark.anchor = "#41B883";
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.switchLabel = this.switchLabel == "Light" ? "Dark" : "Light";
    },
    PPBordercolor(payload) {
      this.levelColor = `border: 3px solid ${payload.color}`;
    },
  },
};
</script>
