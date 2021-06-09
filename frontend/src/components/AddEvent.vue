<template>
  <v-sheet>
    <v-hover v-slot="{ hover }">
      <div>
        <v-img contain aspect-ratio="1" v-if="preview" :src="preview" class="mx-auto" max-height="25vh"   max-width="75vw">
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
    <v-form
      ref="messageForm"
      class="d-flex flex-column pa-2 mt-2"
      @submit.prevent="addEvent()"
      v-model="formValidity"
      enctype="multipart/form-data"
    >
      <div  class="d-flex flex-column flex-md-row ">
        <v-textarea
        height="50"
          label="Que voulez-vous partager ?"
          v-model="content"
          :counter="150"
          :rules="messageRules"
          type="text"
          name="content"
          auto-grow
          value
        />
        </div>
        
        <div class="d-flex align-baseline justify-end my-2">
          <v-btn icon outlined id="uploadBtn" class="d-flex justify-center align-center">
          <v-file-input
          height="20"
          class="ma-0 pa-0  ml-2"
          icon
            label="Ajouter une image"
            hide-input
            prepend-icon="mdi-image"
            type="file"
            id="file"
            @change="selectFile"
          />
          </v-btn>
          <v-btn
          class="ml-3"
            outlined
            icon
            type="button"
            name="button"
            @click="(gifVisibility = !gifVisibility)"
            ><v-icon >mdi-gif</v-icon></v-btn
          >
        </div>
        <v-divider class="mx-8 my-2"></v-divider>
      <div>Ca parle de quoi ? <span class="text-subtitle-2">(Obligatoire)</span></div>
    
    <v-chip-group v-model="value" mandatory show-arrows active-class="primary--text" class="mb-5">
      <v-chip v-for="tag in tags" :key="tag" :value="tag">
        {{ tag }}
      </v-chip>
    </v-chip-group>
      <div class="d-flex justify-end">
        <v-btn class="d-none d-md-flex" type="submit" :disabled="!formValidity" name="button">Envoyer</v-btn>
         <v-btn fab
         color="blue"
                  dark
                    fixed
                    bottom
                    right class="d-md-none d-flex" type="submit" :disabled="!formValidity" name="button"><v-icon>mdi-send</v-icon></v-btn>
      </div>
    </v-form>
    <v-bottom-sheet v-model="gifVisibility">
      <GifSelector v-if="gifVisibility" @sendGif="selectedGif" />
    </v-bottom-sheet> 
    <p>{{ error }}</p>
  </v-sheet>
</template>

<script>
import GifSelector from "./GifSelector"
export default {
  components: {
    GifSelector
  },
  data() {
    return {
      formValidity: false,
      content: "",
      attachment: null,
      preview: null,
      gifUrl: null,
      uploadError: null,
      error: null,
      post: {},
      isActive: false,
      gifVisibility: false,
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
      value: [],
       messageRules: [
        (value) => !!value || "Un message est requis",
        (value) => value.length <= 150 || "150 Caractères maximum"
      ]
    };
  },
  methods: {
    addEvent() {
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
            this.$emit('post-sending')
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
      console.log(gif.url);
      this.preview = gif.url;
      this.gifUrl = gif.url;
      this.attachment = null;
      this.gifVisibility = false
    },
    cleanAttachment() {
      this.attachment = null;
      this.preview = null;
      this.gifUrl = null;
    },
  },
};
</script>

<style scoped>
</style>
