<template>
  <v-container class="text-center" v-if="userConnect">
    <h1>Bienvenue {{ userConnect.username }}</h1>
    <v-divider class="my-5 mx-12"></v-divider>
    <div class="d-md-flex">
      <v-col md="4">
        <v-hover v-slot="{ hover }">
          <v-card max-width="500" id="rounded-card" :elevation="hover ? 10 : 2">
            <v-img
              v-if="!url"
              :src="userConnect.profilePicture"
              aspect-ratio="1"
            >
            </v-img>
            <v-img v-else aspect-ratio="1" :src="url"> </v-img>
            <v-fade-transition>
              <v-overlay v-if="hover" absolute>
                <v-file-input
                  v-if="!url"
                  hide-input
                  id="file"
                  @change="selectFile"
                  prepend-icon="mdi-pencil"
                  :clearable="false"
                >
                </v-file-input>
                <v-btn v-else fab color="red" @click="deleteFile">
                  <v-icon>mdi-minus-circle</v-icon>
                </v-btn>
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </v-hover>
      </v-col>
      <v-divider class="my-5 d-md-none"></v-divider>
      <v-col md="8" class="text-center">
        <div class="font-weight-medium">Votre niveau de réputation est :</div>
        <ExpBar id="expBar" :exp="userConnect.exp" />
        <v-spacer class="my-5"></v-spacer>
        <v-divider inset class="my-5 mx-12"></v-divider>
        <v-form class="text-center" @submit.prevent="putUser">
          <h2 class="text-center font-weight-medium mb-5">biographie</h2>
          <v-spacer class="my-5 d-md-none"></v-spacer>
          <v-textarea
            class="font-weight-light"
            type="text"
            name="content"
            :value="userConnect.bio"
            @change="modifyBio"
            auto-grow
            filled
          ></v-textarea>
          <v-row class="d-flex">
            <v-col class="text-center" v-if="modifyTags === false" cols="12">
              <div class="d-flex justify-space-around">
                <h2 class="text-center font-weight-medium mb-5">
                  Vos préférences
                </h2>
                <v-btn color="info" @click="userModifyTags">
                  Modifier mes préférences
                </v-btn>
              </div>
              <v-chip-group>
                <v-chip
                  v-for="tag in userTags"
                  :key="tag"
                  color="success"
                  class="mx-auto"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-col>
            <v-col v-else cols="12">
              <div class="d-flex justify-space-around">
                <h2 class="text-center font-weight-medium mb-5">
                  Vos nouvelles préférences
                </h2>
                <v-btn @click="cancelModifyTag" class="red white--text mt-2"
                  >Annuler</v-btn
                >
              </div>
              <v-chip-group>
                <v-chip
                  v-for="tag in tagValue"
                  :key="tag"
                  color="success"
                  class="mx-auto"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col> </v-col>
          </v-row>
          <v-divider inset class="my-5 mx-12"></v-divider>
          <v-btn type="submit">Mettre à jour mon profil</v-btn>
        </v-form>
        <v-spacer class="my-5"></v-spacer>
        <v-divider class="my-5 d-md-none"></v-divider>
        <v-btn
          color="red"
          class="ma-2 white--text"
          @click="destroyProfil(userConnect.id)"
          ><v-icon left dark> mdi-delete </v-icon>
          supprimer le profil
        </v-btn>
        <v-overlay :value="overlay"
          ><v-alert type="success"> Profil mis à jour </v-alert></v-overlay
        >
      </v-col>
    </div>
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn class="mt-6" text color="red" @click="sheet = !sheet">
          close
        </v-btn>
        <v-chip-group
          v-model="tagValue"
          active-class="success"
          multiple
          max="3"
        >
          <v-chip v-for="tag in tags" :key="tag" :value="tag" class="mx-auto">
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ExpBar from "../components/ExpStatus";
export default {
  components: { ExpBar },
  data() {
    return {
      sheet: false,
      hidden: true,
      modifyTags: false,
      bio: "",
      profilePicture: null,
      url: null,
      overlay: false,
      isLoading: true,
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
      tagValue: null,
    };
  },
  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 2000);
    },
  },
  computed: {
    ...mapGetters(["userConnect"]),
    userTags: function () {
      return this.userConnect.tags.split(",");
    },
  },
  methods: {
    putUser() {
      let tags = this.userTags.toString();
      if (this.tagValue) {
        tags = this.tagValue.toString();
      }
      let data = new FormData();
      data.append("bio", this.bio);
      data.append("image", this.profilePicture);
      data.append("tags", tags);
      this.$store
        .dispatch("PutUser", data)
        .then(() => {
          this.overlay = !this.overlay;
          this.tagValue = null;
          this.modifyTags = false;
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
    selectFile(file) {
      this.url = URL.createObjectURL(file);
      this.profilePicture = file;
    },
    deleteFile() {
      this.profilePicture = null;
      this.url = null;
    },
    ...mapActions(["DestroyProfil"]),
    destroyProfil(userId) {
      this.$store
        .dispatch("DestroyProfil", userId)
        .then(() => {})
        .catch((err) => {
          this.error = err;
        });
    },
    modifyBio(value) {
      this.bio = value;
    },
    userModifyTags() {
      this.tagValue = [];
      this.sheet = !this.sheet;
      this.modifyTags = true;
    },
    cancelModifyTag() {
      this.modifyTags = false;
      this.tagValue = null;
    },
  },
};
</script>

<style scoped>
#rounded-card {
  border-radius: 50%;
  overflow: hidden;
}
</style>
