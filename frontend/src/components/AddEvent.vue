<template>
  <div>
    <form @submit.prevent="addEvent()" enctype="multipart/form-data">
      <label for="title"> Titre : </label>
      <input v-model="title" type="text" name="title" value />

      <label for="content"> Content: </label>
      <input v-model="content" type="text" name="content" value />
      <label for="attachment"> attachment: </label>
      <input type="file" id="file" ref="file" />
      <button type="submit" name="button">Envoyer</button>
    </form>
    <p>{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "",
      content: "",
      attachment: null,
      uploadError: null,
      error: null,
      post: {},
    };
  },
  methods: {
    addEvent() {
      this.attachment = this.attachment = this.$refs.file.files[0];

      let data = new FormData();
      let attachment = this.attachment;

      console.log(attachment);

      data.append("title", this.title);
      data.append("content", this.content);
      data.append("image", attachment);

      console.log(data.getAll("image"));

      let config = {
        header: {
          "Content-Type": "multipart/form-data",
        },
      };

      axios
        .post("http://localhost:8081/api/messages/new", data, config)
        .then((res) => {
          this.post = res.data;
          this.$emit("addEventToArraysPost", this.post);
          console.log(this.post);
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
  },
  reset() {
    // reset form to initial state
    this.uploadedFiles = [];
    this.uploadError = null;
  },
};
</script>

<style scoped></style>
