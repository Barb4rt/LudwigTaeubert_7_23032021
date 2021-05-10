<template >
<div v-if="userConnect">
    <h1 class="text-center my-2">
      Bienvenue {{ userConnect.username }}
      </h1>
    <v-divider class="my-5 mx-12"></v-divider>
    <div class="d-md-flex">
      <v-col cols="d-md-4">
        <v-hover v-slot="{ hover }">
          <v-card  id="rounded-card" :elevation="hover ? 10 : 2">
        <v-img 
        v-if="!url"
        aspect-ratio="1"
         :src="userConnect.profilePicture">
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
      <v-divider class="my-2 d-md-none" ></v-divider>
      <v-col cols="d-sm-10 text-center">
        <div class="d-flex flex-column align-center">
        <div class="font-weight-medium" >Votre niveau de réputation est : </div>
        <ExpBar id="expBar" :exp="userConnect.exp"/>
        </div>
        <v-divider class="my-2 d-md-none" ></v-divider>
        <v-spacer class="my-6 d-sm-none" ></v-spacer>
        <v-form  class="text-center" @submit.prevent="putUser">
          <h2 class=" text-center font-weight-medium"> biographie </h2>
          <v-spacer class="my-4 d-md-none" ></v-spacer>
          <v-textarea
          class="font-weight-light"
          type="text"
          name="content"
          :value="userConnect.bio"
          @change="modifyBio"
          auto-grow
          filled
        ></v-textarea>
          <v-btn type="submit"> submit</v-btn>
        </v-form>
        <v-spacer class="my-6" ></v-spacer>
        <v-divider class="my-2 d-md-none" ></v-divider>
        <v-btn
            color="red"
            class="ma-2 white--text"
            @click="destroyProfil(userConnect.id)"
            ><v-icon left dark> mdi-delete </v-icon>
            supprimer le profil
          </v-btn>
      </v-col>
    <v-overlay :value="overlay"
      ><v-alert type="success"> Profil mis à jour </v-alert></v-overlay
    >
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ExpBar from "../components/ExpStatus"
export default {
  components:{ExpBar},
  data() {
    return {
      hidden: true,
      bio:"",
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
    ...mapGetters(["userConnect"]),
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
    modifyBio(value) {
      console.log(value);
      this.bio = value
    }
  },
};
</script>

<style scoped>
#rounded-card {
  border-radius: 50%;
  overflow: hidden;
}
</style>
