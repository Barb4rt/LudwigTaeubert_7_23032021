<template>
  <div >
    
    <div class="ma-auto">
      <h1 class="mx-auto">Bienvenue sur Groupomania</h1>
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
  data() {
    return{
show: false
    }   
  },
  computed: {
    ...authComputed,
  },
  mounted() {
    this.show = true; // might need this.$nextTick
  }
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
