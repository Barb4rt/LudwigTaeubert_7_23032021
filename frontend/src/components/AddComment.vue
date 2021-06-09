<template>
  <v-sheet>
    <div class="py-3">
      <v-hover v-slot="{ hover }">
        <div>
          <v-img
            contain
            aspect-ratio="1"
            v-if="preview"
            :src="preview"
            class="mx-auto"
            max-height="25vh"
            max-width="75vw"
          >
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
        class="align-center"
        @submit.prevent="commentMessage()"
        enctype="multipart/form-data"
        v-model="formValidity"
      >
        <v-text-field
          class="pa-2 mx-5 my-2"
          label="Que voulez-vous ajouter ?"
          v-model="content"
          type="text"
          name="content"
          :counter="150"
          value
          prepend-icon="mdi-pencil"
          :rules="commentRules"
        />
        <v-btn
          fab
          color="blue"
          dark
          fixed
          bottom
          right
          class="d-md-none d-flex"
          type="submit"
          :disabled="!formValidity"
          name="button"
          ><v-icon>mdi-send</v-icon></v-btn
        >
      </v-form>
      <v-btn
        class="d-flex align-center justify-center mx-auto"
        fab
        type="button"
        name="button"
        @click="expandGif = !expandGif"
      >
        <v-icon>mdi-gif</v-icon></v-btn
      >
      <v-divider v-if="error"></v-divider>

      <p class="text-center red--text mt-2">{{ error }}</p>
    </div>
    <v-bottom-sheet v-model="expandGif">
      <GifSelector v-if="expandGif" @sendGif="selectedGif" />
    </v-bottom-sheet>
  </v-sheet>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import GifSelector from "./GifSelector";
export default {
  components: { GifSelector },
  name: "AddComment",
  props: {
    eventId: {
      type: Number,
    },
  },
  data() {
    return {
      comment: false,
      formValidity: false,
      expandComment: false,
      isHidden: true,
      content: "",
      isActive: false,
      benched: 0,
      expandGif: false,
      gifUrl: null,
      preview: null,
      error: null,
      commentRules: [
        (v) =>
          (v && this.gifUrl === null && v.length <= 150) ||
          "150 Caractères maximum",
      ],
      borderColor: null,
      levelColor: null,
      overlay: false,
    };
  },
  computed: {
    ...mapGetters(["userConnect", "users"]),
    isLiked: function () {
      for (let i = 0; i < this.event.Likes.length; i++) {
        if (this.event.Likes[i].userId === this.userConnect) {
          return "green";
        }
      }
      return "grey";
    },
    tagArray: function () {
      return this.event.tag.split(",");
    },
    isOwner: function () {
      if (this.userConnect.id === this.event.UserId) {
        return true;
      } else {
        return false;
      }
    },
    profil: function () {
      const user = () => {
        for (let index = 0; index < this.users.length; index++) {
          const element = this.users[index];
          if (element.id === this.event.UserId) {
            return element;
          }
        }
      };
      return user();
    },
  },
  methods: {
    ...mapActions([
      "CommentPost",
      "LikePost",
      "DestroyPost",
      "DestroyComment",
      "SeeProfil",
    ]),
    commentMessage() {
      this.$store
        .dispatch("CommentPost", {
          messageId: this.eventId,
          content: this.content,
          gifUrl: this.gifUrl,
        })
        .then(() => {
          console.log("message commente");
          this.content = "";
          this.gifUrl = null;
          this.preview = null;
          this.$emit("post-comment");
        })
        .catch((err) => {
          this.error = err;
        });
    },
    selectedGif(gif) {
      this.preview = gif.url;
      this.gifUrl = gif.url;
      this.formValidity = true;
      this.expandGif = !this.expandGif;
    },
    cleanAttachment() {
      this.preview = null;
      this.gifUrl = null;
      this.formValidity = false;
    },
    destroyComment(payload) {
      this.$store
        .dispatch("DestroyComment", payload.id)
        .then(() => {
          console.log("commentaire supprimer");
        })
        .catch((err) => {
          this.error = err;
        });
    },
  },
};
</script>

<style scoped>
#gif {
  overflow: hidden;
}
</style>
