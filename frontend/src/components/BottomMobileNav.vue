<template>
    <v-bottom-navigation fixed class="d-md-none d-sm-flex" >
      <v-btn
                  @click="expandPost"
                  >
                  <span>Ajouter un post</span>
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
  
      <v-btn @click="expandFilter" >
        <span>Filtrer</span>
  
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </v-bottom-navigation>
</template>

<script>
export default {
    name:"BottomMobileNav",
    methods : {
        expandPost(){
     this.$emit("expandPost")
  },
  expandFilter(){
     this.$emit("expandFilter")
  },
    }
}
</script>
