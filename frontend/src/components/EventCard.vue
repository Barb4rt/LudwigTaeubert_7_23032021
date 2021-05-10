<template>
  <div>
    <v-lazy
      v-model="isActive"
      :options="{
        threshold: 0.5,
      }"
      min-height="200"
      transition="fade-transition"
    >
      <div>
        <div class=" ma-2">
          <div class="d-flex align-center justify-space-between">
            <div class="d-inline-flex align-center ">
            <v-btn icon @click="seeProfil(event.UserId)">
              <v-avatar :style="levelColor">
                <v-img :src="profil.profilePicture"></v-img>
              </v-avatar>
            </v-btn>
            <v-btn text @click="seeProfil(event.UserId)">{{
              profil.username
            }}</v-btn>
            <v-chip color="blue" dark class="d-none d-md-flex"
              ><ExpBar id="level" @level-color="PPBordercolor"  :fullDisplay="false" :exp="profil.exp"
            /></v-chip>
            </div>
            <div class="d-inline-flex align-center ">
            
            <div>
              <v-menu transition="slide-x-transition" bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item>
                    <v-list-item-title>Signaler le post</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="isOwner">
                    <v-list-item-title @click.prevent="destroyPost"
                      >Supprimer le post</v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          </div>
          
        </div>
        <v-img
          max-width="50%"
          class="mx-auto"
          v-show="event.attachment"
          :src="event.attachment"
        ></v-img>
        <v-card-text
          class="font-weight-light d-flex flex-column mb-6"
          >{{ event.content }}</v-card-text
        >

        <div class="d-flex pa-2 mb-6 justify-space-between">
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
            <v-icon class="mr-1" @click="expand = !expand"> mdi-comment </v-icon
            ><span>{{ this.event.Comments.length }}</span>
          </div>
        </div>

        <v-expand-transition>
          <div v-if="expand">
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
      <v-btn
                  class="d-md-none d-sm-flex"
                  color="blue"
                  dark
                  @click="sheet = !sheet"
                    fab
                    fixed
                    bottom
                    right
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <div>Ajouter un commentaire</div>
                  
      <v-bottom-sheet v-model="sheet">
        <v-sheet
          class="text-center"
        >
          <v-btn
            class="mt-6"
            text
            color="red"
            @click="sheet = !sheet"
          >
            close
          </v-btn>
          <div class="py-3">
            <v-form
              class=" align-center"
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
                <v-btn class="mb-3" type="submit" :disabled="!formValidity" name="button">Envoyer</v-btn>
                <v-btn
                class="d-flex align-center"
                icon
                type="button"
                name="button"
                @click="getGif(), (gifHidden = !gifHidden)"
              >
                <v-icon>mdi-gif</v-icon></v-btn
              >
            </v-form>
          </div>
          
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
                :rules="commentRules"
              />
                <v-btn class="mb-3" type="submit" :disabled="!formValidity" name="button">Envoyer</v-btn>
                <v-btn
                class="d-flex align-center"
                icon
                type="button"
                name="button"
                @click="getGif(), (gifHidden = !gifHidden)"
              >
                <v-icon>mdi-gif</v-icon></v-btn
              >
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
            <v-virtual-scroll
              :bench="benched"
              :items="this.event.Comments"
              height="300"
              item-height="200"
            >
              <template v-slot:default="{ item }">
                <v-list-item  :key="item.id">
                  <v-list-item-avatar>
                    <v-img :src="item.User.profilePicture"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    
                    <v-list-item-title
                      v-html="item.User.username"
                    ></v-list-item-title>
                    <div id="gifContent"   v-if="item.gifUrl">
                        <v-img id="gif" contain max-height="150" class="rounded-xl"  aspect-ratio="1"  :src="item.gifUrl" ></v-img>
                    </div>
                    <v-list-item-subtitle
                      v-html="item.content"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action @click="destroyComment(item.id)"
                    ><v-icon>mdi-delete</v-icon></v-list-item-action
                  >
                </v-list-item>

                <v-divider></v-divider>
              </template>
            </v-virtual-scroll>
          </div>
        </v-expand-transition>
      </div>
    </v-lazy>

    <v-divider inset class="mx-auto mb-15"></v-divider>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ExpBar from "./ExpStatus";
import axios from "axios";
export default {
  components: { ExpBar },
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
      sheet: false,
      formValidity: false,
      expand: false,
      isHidden: true,
      content: "",
      isActive: false,
      benched: 0,
      gifList: [],
      gifHidden: true,
      gifUrl: null,
      preview: null,
      searchIcon: "mdi-magnify",
      searchGif: "",
      commentRules: [
        (value) => value.length < 150 || "Le nom d'utilisateur doit avoir entre 5 et 12 caractère"
      ],
      levelColor: '' 
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
          gifUrl: this.gifUrl
        })
        .then(() => {
          console.log("message commente");
          this.content = ''
          this.gifUrl =''
          this.preview = null
          this.gifHidden = true
        })
        .catch((err) => {
          this.error = err;
        });
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
    selectedGif(gif) {
      this.preview = gif;
      this.gifUrl = gif;
      this.formValidity = true
    },
    cleanAttachment() {
      this.preview = null;
      this.gifUrl = null;
      this.formValidity = false
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
    destroyComment(comment) {
      console.log(comment);
      this.$store
        .dispatch("DestroyComment", comment)
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
    PPBordercolor(payload){
       this.levelColor = `border: 3px solid ${payload.color}` 
    }
  },
};
</script>

<style  scoped>
.green {
  color: green;
}

#gifContent{
  

}
#gif{
  overflow: hidden;
  }
</style>
