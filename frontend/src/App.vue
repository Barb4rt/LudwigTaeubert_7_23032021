<template>
  <v-app id="app">
    <app-nav />
    <v-main >
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import AppNav from "./components/AppNav";


export default {
  name: "App",

  components: {
    AppNav,
  },
  data: () => ({
  }),
};
</script>
