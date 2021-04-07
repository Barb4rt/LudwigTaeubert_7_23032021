<template>
  <div class="home">
    <img class="logo" src="../assets/images/icon-above-font.png" />
    <h1>Bienvenue sur Groupomania</h1>
    <div v-if="!loggedIn">
      To use this app you'll need to
      <router-link to="/login"> Login </router-link>
      or
      <router-link to="/register"> Register </router-link>
    </div>
  </div>
</template>

<script>
import { authComputed } from "../store/helper";
export default {
  computed: {
    ...authComputed,
  },
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 300px;
}
</style>
