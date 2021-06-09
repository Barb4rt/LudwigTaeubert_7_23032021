<template>
  <div class="main-container d-flex flex-column">
    <GroupomaniaLogo class="logo" />

    <div class="mx-auto text-center">
      <h1 class="mx-auto">Bienvenue</h1>
      <p>Pour utiliser l'application vous devez soit</p>
      <v-row>
        <v-col>
          <v-btn to="/login" color="info"> Se connecter </v-btn>
        </v-col>
        <v-col>
          <v-btn to="/register" color="success"> S'inscrire </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import GroupomaniaLogo from "../components/GroupomaniaLogo.vue";
import { authComputed } from "../store/helper";

export default {
  components: { GroupomaniaLogo },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    ...authComputed,
  },
  mounted() {
    this.show = true; // might need this.$nextTick
  },
};
</script>

<style lang="scss" scoped></style>
