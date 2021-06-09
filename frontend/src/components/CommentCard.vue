<template>
<v-container class="d-flex flex-column elevation-15 mb-5 rounded-xl  " >
    <ExpBar class="d-none" id="level" @level-color="PPBordercolor"  :fullDisplay="false" :exp="comment.User.exp"
            />
            <div class="d-flex flex-row align-center justify-space-between ">
            <div class="d-flex align-center mb-4" > 
                  <v-avatar :style="borderColor" > 
                    <v-img :src="comment.User.profilePicture"></v-img>
                  </v-avatar>
                  <div class="ml-2">
                    <div class="font-weight-regular" >
                        {{comment.User.username}}
                    </div>
                    <div class="font-weight-light"
                    >
                    {{comment.content}}</div>
                    </div> 
                  </div>
                  <v-btn v-if="isOwner === true" icon  @click="DestroyComment"
                    ><v-icon>mdi-delete</v-icon></v-btn >  
            </div>
                    
                    <div  v-if="comment.gifUrl" >
                        <v-img id="gif" contain max-height="150" aspect-ratio="1"  :src="comment.gifUrl" ></v-img>
                    </div>
                </v-container>
</template>

<script>
import ExpBar from "./ExpStatus"

export default {
    components:{ExpBar},
    name: "CommentCard",
  props: {
    comment: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isOwner: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data(){
      return{
          borderColor : null,
          levelColor:null
      }
  },
  methods : {
       PPBordercolor(payload){
       this.borderColor = `border: 3px solid ${payload.color}`
       this.levelColor = payload.color
    },
    DestroyComment(){
      this.$emit('delete' ,{ id: this.comment.id } )
    }
  }
}
</script>
