<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Signup</h1>
        <v-form
          ref="signUpForm"
          v-model="formValidity"
          @submit.prevent="register"
        >
          <v-text-field
            label="Username"
            v-model="username"
            type="text"
            name="username"
            value
          />
          <v-text-field
            label="Email"
            type="email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            type="password"
            name="v-btnrd"
            value
          />
          <v-file-input
            label="Attach profile picture"
            id="file"
            @change="selectFile"
            required
          ></v-file-input>
          <v-btn
            type="submit"
            color="primary"
            class="mr-4"
            :disabled="!formValidity"
            >Submit</v-btn
          >
          <v-btn color="success" class="mr-4" @click="validateForm"
            >Validate Form</v-btn
          >
          <v-btn color="warning" class="mr-4" @click="resetValidation"
            >Reset Validation</v-btn
          >
          <v-btn color="error" @click="resetForm">Reset</v-btn>

          <router-link to="/login">
            Already have an account? Login.
          </router-link>
        </v-form>
        <p>{{ error }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      profilePicture: null,
      error: null,
      emailRules: [
        (value) => !!value || "Email is required.",
        (value) => value.indexOf("@") !== 0 || "Email should have a username.",
        (value) => value.includes("@") || "Email should include an @ symbol.",
        (value) =>
          value.includes(".") || "Email should include a period symbol.",
        (value) =>
          value.indexOf(".") <= value.length - 3 ||
          "Email should contain a valid domain extension.",
      ],
      formValidity: false,
    };
  },
  methods: {
    register() {
      let data = new FormData();

      data.append("username", this.username);
      data.append("email", this.email);
      data.append("password", this.password);
      data.append("image", this.profilePicture);

      this.$store
        .dispatch("Register", data)
        .then(() => {
          this.$router.push({ name: "userdashboard" });
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
    resetForm() {
      this.$refs.signUpForm.reset();
    },
    resetValidation() {
      this.$refs.signUpForm.resetValidation();
    },
    validateForm() {
      this.$refs.signUpForm.validate();
    },
    selectFile(file) {
      console.log(file);
      this.profilePicture = file;
      console.log(this.profilePicture);
    },
  },
};
</script>

<style scoped></style>
