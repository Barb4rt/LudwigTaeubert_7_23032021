<template>
  <v-sheet>
    <v-text-field
      label="Rechercher un gif"
      v-model="searchTerm"
      type="text"
      name="searchTerm"
      value
      :append-icon="searchIcon"
      @click:append="getSearchedGif()"
    />
    <v-slide-group
      v-if="gifList"
      class="pa-4"
      mandatory
      center-active
      show-arrows
    >
      <v-slide-item
        v-for="(gif, index) in gifList"
        :key="index"
        class="d-flex child-flex"
        v-slot="{ toggle }"
      >
        <v-card class="ma-4" height="200" width="200" @click="toggle">
          <v-img
            :src="gif.images.downsized.url"
            :lazy-src="gif.images.downsized.url"
            class="grey lighten-2"
            @click="selectedGif(gif.images.downsized.url)"
          ></v-img>
        </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import gifApi from "./../../api/gifphyApi";

export default {
  name: "GifSelector",
  data() {
    return {
      gifList: null,
      searchTerm: "",
      searchIcon: "mdi-magnify",
    };
  },
  methods: {
    async handleCreated() {
      try {
        await gifApi
          .getGif()
          .then((res) => {
            this.gifList = res.data.data;
          })
          .catch((err) => {
            this.error = err.response.data.error;
          });
      } catch (e) {
        console.log(e);
      }
    },
    selectedGif(gif) {
      this.$emit("sendGif", { url: gif });
    },
    getSearchedGif() {
      gifApi
        .searchGif(this.searchTerm)
        .then((res) => {
          this.gifList = res.data.data;
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
  },
  beforeMount() {
    this.handleCreated();
  },
};
</script>
