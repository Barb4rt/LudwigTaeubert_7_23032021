<template>
  <v-container fluid class="rounded-xl pa-0 mb-4">
    <v-lazy
      v-model="isActive"
      :options="{
        threshold: 0.5,
      }"
      min-height="200"
      transition="fade-transition"
    >
      <div min-height="200" class="pa-md-5 pa-3">
        <div>
          <div class="d-flex align-center justify-space-between mb-5">
            <div class="d-inline-flex align-center">
              <v-btn icon @click="seeProfil(event.UserId)">
                <v-avatar :style="borderColor">
                  <v-img :src="profil.profilePicture"></v-img>
                </v-avatar>
              </v-btn>
              <v-btn text @click="seeProfil(event.UserId)">{{
                profil.username
              }}</v-btn>
              <v-chip :color="levelColor" dark class="d-none d-md-flex"
                ><ExpBar
                  id="level"
                  @level-color="PPBordercolor"
                  :fullDisplay="false"
                  :exp="profil.exp"
              /></v-chip>
            </div>
            <div class="d-inline-flex align-center">
              <div>
                <v-menu transition="slide-x-transition" bottom right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-list-item-action-text
                        >Signaler le post</v-list-item-action-text
                      >
                    </v-list-item>
                    <v-list-item v-if="isOwner">
                      <v-list-item-action-text @click.prevent="destroyPost"
                        >Supprimer le post</v-list-item-action-text
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </div>
        <v-img
          max-width="100%"
          class="mx-auto rounded-xl d-flex align-end"
          v-if="event.attachment"
          :src="event.attachment"
        >
        </v-img>
        <v-card-text class="font-weight-light">{{ event.content }}</v-card-text>
        <div class="d-flex pa-2 mb-md-6 justify-space-between">
          <v-chip
            v-for="tag in tagArray"
            :key="tag"
            :value="tag"
            class="ma-2"
            color="red"
            outlined
            >{{ tag }}
          </v-chip>
          <div class="d-inline-flex align-center">
            <v-icon
              class="mr-1"
              :style="{ color: isLiked }"
              @click="likeMessage"
            >
              mdi-heart
            </v-icon>
            <span class="subheading mr-2">{{ event.likes }}</span>
            <v-spacer class="mx-auto"></v-spacer>
            <v-icon class="mr-1" @click="expandComment = !expandComment">
              mdi-comment </v-icon
            ><span>{{ this.event.Comments.length }}</span>
          </div>
        </div>

        <v-expand-transition>
          <v-container elevation-20 class="rounded-xl" v-show="expandComment === true">
            <v-divider class="my-2 d-md-none d-sm-flex"></v-divider>
            <v-hover v-slot="{ hover }">
              <div>
                <v-img
                  v-if="preview"
                  :src="preview"
                  class="mx-auto"
                  max-width="50%"
                >
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-btn
                        v-if="hover"
                        fab
                        color="red"
                        @click="cleanAttachment"
                      >
                        <v-icon>mdi-minus-circle</v-icon>
                      </v-btn>
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </div>
            </v-hover>
            <div class="text-center">
              <v-btn class="d-md-none d-sm-flex" @click="comment = !comment">
                <v-icon>mdi-pencil</v-icon
                ><span class="ml-2">Ajouter un commentaire</span>
              </v-btn>

              
              <v-divider class="my-2 d-md-none d-sm-flex"></v-divider>

              <v-bottom-sheet v-model="comment">
                <v-sheet class="text-center">
                  <v-btn
            fab
            dark
            fixed
            bottom
            left
            class="red"
            @click="comment =!comment"
            name="button"
            ><v-icon>mdi-minus</v-icon></v-btn
          >
                  <AddComment :eventId="event.id" :key="componentKey" @post-comment="forceRerender"/>
                </v-sheet>
              </v-bottom-sheet>
            </div>
            <v-form
              class="d-md-flex align-center d-none"
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
                append-icon="mdi-gif"
                @click:append="expandGif = !expandGif"
              />
              <v-btn
                icon
                class="mb-3"
                type="submit"
                :disabled="!formValidity"
                name="button"
                ><v-icon>mdi-send</v-icon></v-btn
              >
              <v-bottom-sheet v-model="expandGif">
                <GifSelector v-if="expandGif" @sendGif="selectedGif"  />
              </v-bottom-sheet>
            </v-form>

            <div hide-on-scroll id="commentList" class="px-2">
              <CommentCard
                v-for="comment in event.Comments"
                :key="comment.id"
                :comment="comment"
                @delete="destroyComment"
                :isOwner="isOwner"
              />
            </div>
          </v-container>
        </v-expand-transition>
      </div>
    </v-lazy>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ExpBar from "./ExpStatus";
import GifSelector from "./GifSelector";
import CommentCard from "./CommentCard";
import AddComment from "./AddComment.vue"
export default {
  components: { ExpBar, GifSelector, CommentCard, AddComment },
  name: "EventCard",
  props: {
    event: {
      type: Object,
      default: () => {
        return {};
      },
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
      componentKey: 0,
      borderColor: null,
      levelColor: null,
      overlay: false,
      error:null
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
    destroyPost() {
      this.$store
        .dispatch("DestroyPost", this.event.id)
        .then(() => {
          console.log("message supprimé");
        })
        .catch((err) => {
          this.error = err;
        });
    },
    commentMessage() {
      this.$store
        .dispatch("CommentPost", {
          messageId: this.event.id,
          content: this.content,
          gifUrl: this.gifUrl,
        })
        .then(() => {
          console.log("message commente");
          this.content = "";
          this.gifUrl = "";
          this.preview = null;
        })
        .catch((err) => {
          this.error = err;
        });
    },
    selectedGif(gif) {
      console.log(gif)
      this.preview = gif.url;
      this.gifUrl = gif.url;
      this.formValidity = true;
      this.expandGif = !this.expandGif
    },
    cleanAttachment() {
      this.preview = null;
      this.gifUrl = null;
      this.formValidity = false;
    },
    likeMessage() {
      let data = {
        messageId: this.event.id,
      };
      this.$store
        .dispatch("LikePost", data)
        .then(() => {
          console.log("mis a jour");
        })
        .catch((err) => {
          this.error = err;
        });
    },
    destroyComment(payload) {
      console.log(payload.id);
      this.$store
        .dispatch("DestroyComment", payload.id)
        .then(() => {
          console.log("commentaire supprimer");
        })
        .catch((err) => {
          this.error = err;
        });
    },
    seeProfil(userId) {
      this.$store.dispatch("SeeProfil", userId).then(() => {
        this.$router.push({ name: "userprofil" });
      });
    },
    PPBordercolor(payload) {
      this.borderColor = `border: 3px solid ${payload.color}`;
      this.levelColor = payload.color;
    },
    forceRerender() {
      this.componentKey += 1;
      this.comment = !this.comment
    },
  },
};
</script>

<style scoped>
.green {
  color: green;
}

#gif {
  overflow: hidden;
}

#commentList {
  max-height: 300px;
  overflow: scroll;
  overflow-x: hidden;
}
</style>
