<template>
    <v-sheet >
      <div class="text-center grey--text my-2 ">Choisir un filtre</div>
      <v-chip-group
        v-model="filter"
        active-class="primary--text"
        column
        @change="filterPost"
      >
        <v-chip v-for="tag in tags" :key="tag" :value="tag">
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </v-sheet>
</template>

<script>
import { mapActions} from "vuex";
export default {
  name: "Filters",
  props: {
    
    },
  data() {     
    return {
        filter: null,
      tags: [
        "Monde professionnel",
        "Développement personnel",
        "Détente",
        "Artistique",
        "Technologie",
        "Bon plans",
        "Histoire",
        "Découvertes",
        "Animaux",
      ],
    };
  },
  methods : {
      ...mapActions(["FilterPost"]),
      filterPost(filter) {
        this.$store.dispatch("FilterPost", filter)
        console.log(filter);
    },
  }
};
</script>


