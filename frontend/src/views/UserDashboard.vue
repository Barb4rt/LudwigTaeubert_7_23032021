<template>
  <v-container v-if="userProfil" fluid>
    <h1 class="text-center">Bienvenue {{ userProfil.username }}</h1>
    <v-divider class="my-5"></v-divider>
    <v-row>
      <v-col cols="4" height="20px">
        <v-hover v-slot="{ hover }">
          <v-card id="rounded-card" :elevation="hover ? 10 : 2" class="d-flex">
            <v-img
              v-if="!url"
              aspect-ratio="1"
              :src="userProfil.profilePicture"
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
      <v-col cols="8">
        <div>Votre niveau de réputation est : </div>
        <ExpBar id="expBar" :exp="userProfil.exp"/>
        <v-form @submit.prevent="putUser">
          <h2> biographie </h2>
          <v-text-field
            :placeholder="userProfil.bio"
            v-model="bio"
            type="text"
            name="content"
            value
          />
          <v-btn type="submit"> submit</v-btn>
          <v-btn
            color="red"
            class="ma-2 white--text"
            @click="destroyProfil(userProfil.id)"
            ><v-icon left dark> mdi-delete </v-icon>
            supprimer le profil
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-overlay :value="overlay"
      ><v-alert type="success"> Profil mis à jour </v-alert></v-overlay
    >
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ExpBar from "../components/ExpStatus"
export default {
  components:{ExpBar},
  data() {
    return {
      hidden: true,
      disableForm: true,
      username: "",
      bio: "",
      profilePicture: null,
      url: null,
      overlay: false,
      isLoading: true,
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
    ...mapGetters(["userProfil"]),
  },
  methods: {
    putUser() {
      let data = new FormData();
      data.append("bio", this.bio);
      data.append("image", this.profilePicture);
      this.$store
        .dispatch("PutUser", data)
        .then(() => {
          this.overlay = !this.overlay;
          console.log("mis a jour");
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
      console.log(userId);
      this.$store
        .dispatch("DestroyProfil", userId)
        .then(() => {
          console.log("utilisateur supprimer");
        })
        .catch((err) => {
          this.error = err;
        });
    },
  },
};
</script>

<style scoped>
#rounded-card {
  border-radius: 50%;
  overflow: hidden;
}
#expBar{
    
}
</style>
