<template>
  <v-container
    fluid
    transition="scroll-y-transition"
    class="mt-5 mb-5 pa-md-4 mx-lg-auto"
    outlined
  >
    <div class="overline mb-4">Ajouter un message</div>
    <v-hover v-slot="{ hover }">
      <div>
        <v-img v-if="preview" :src="preview" class="mx-auto" max-width="50%">
          <v-fade-transition>
            <v-overlay v-if="hover" absolute>
              <v-btn v-if="hover" fab color="red" @click="cleanAttachment">
                <v-icon>mdi-minus-circle</v-icon>
              </v-btn>
            </v-overlay>
          </v-fade-transition>
        </v-img>
      </div>
    </v-hover>

    <h2 class="title mb-2">Ca parle de quoi ?</h2>
    <p class="subheader mb-2">(Obligatoire)</p>
    <v-chip-group v-model="value" mandatory active-class="primary--text" column>
      <v-chip v-for="tag in tags" :key="tag" :value="tag">
        {{ tag }}
      </v-chip>
    </v-chip-group>
    <v-form
      class="d-flex flex-column pa-2 space-between"
      @submit.prevent="addEvent()"
      enctype="multipart/form-data"
    >
      <div class="d-flex">
        <v-text-field
          label="Que voulez-vous partager ?"
          v-model="content"
          type="text"
          name="content"
          value
        />
        <div class="d-flex align-center">
          <v-file-input
            label="Ajouter une image"
            hide-input
            prepend-icon="mdi-camera"
            type="file"
            id="file"
            @change="selectFile"
          />
          <v-btn
            class="d-flex align-center"
            icon
            type="button"
            name="button"
            @click="getGif(), (gifHidden = !gifHidden)"
            ><v-icon>mdi-gif</v-icon></v-btn
          >
        </div>
      </div>
      <div>
        <v-btn type="submit" name="button">Envoyer</v-btn>
      </div>
    </v-form>
    <v-sheet v-show="!gifHidden" class="mx-auto" elevation="0">
      <v-text-field
        label="Rechercher un gif"
        v-model="searchGif"
        type="text"
        name="searchGif"
        value
        :append-icon="searchIcon"
        @click:append="getSearchedGif()"
      />
      <v-slide-group class="pa-4" mandatory show-arrows>
        <v-slide-item
          v-for="(gif, index) in gifList"
          :key="index"
          class="d-flex child-flex"
          v-slot="{ toggle }"
        >
          <v-card class="ma-4" height="200" width="100" @click="toggle">
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
    <p>{{ error }}</p>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      content: "",
      attachment: null,
      preview: null,
      gifUrl: null,
      uploadError: null,
      error: null,
      post: {},
      searchGif: "",
      gifList: [],
      isActive: false,
      searchIcon: "mdi-magnify",
      gifHidden: true,
      tags: [
        "Work",
        "Home Improvement",
        "Vacation",
        "Food",
        "Drawers",
        "Shopping",
        "Art",
        "Tech",
      ],
      value: [],
    };
  },
  methods: {
    addEvent() {
      console.log("fichier detecter");
      let data = new FormData();
      if (!this.attachment) {
        data.append("gif", this.gifUrl);
      } else {
        data.append("image", this.attachment);
      }
      data.append("content", this.content);
      data.append("tag", this.value);
      this.$store
        .dispatch("CreatePost", data)
        .then(() => {
          this.content = ''
          this.attachment = null
          this.preview = null
          this.gifUrl = null

        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
    selectFile(file) {
      this.attachment = file;
      this.preview = URL.createObjectURL(file);
      this.gifUrl = null;
    },
    selectedGif(gif) {
      this.preview = gif;
      this.gifUrl = gif;
      this.attachment = null;
    },
    cleanAttachment() {
      this.attachment = null;
      this.preview = null;
      this.gifUrl = null;
    },
    getGif() {
      axios
        .get(
          `https://api.giphy.com/v1/gifs/trending?api_key=G1mQgUOk1qn3WGJodRRqK1gf1lIXAO3t&limit=24&rating=g`
        )
        .then((res) => {
          console.log(res.data);
          this.gifList = [];
          this.gifList = res.data.data;
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
    getSearchedGif() {
      axios
        .get(
          `https://api.giphy.com/v1/gifs/search?api_key=G1mQgUOk1qn3WGJodRRqK1gf1lIXAO3t&q=${this.searchGif}&limit=48&offset=0&rating=g&lang=fr`
        )
        .then((res) => {
          console.log(res.data);
          this.gifList = res.data.data;
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
  },
};
</script>

<style scoped></style>
