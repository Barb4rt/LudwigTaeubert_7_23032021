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
            :rules="userRules"
            value
            required
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
            :rules="passwordRules"
            value
            required
          />
          <h2 class="title mb-2">Vos sujets préférer ?</h2>
    <p class="subheader mb-2">(Obligatoire)</p>
    <v-chip-group v-model="value" multiple active-class="primary--text" :rules="tagsRules" column required>
      <v-chip v-for="tag in tags" :key="tag" :value="tag">
        {{ tag }}
      </v-chip>
    </v-chip-group>
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
      userRules: [
        (value) => !!value || "Un nom d'utilisateur est requis",
        (value) => value.length >= 5 && value.length <= 12 || "Le nom d'utilisateur doit avoir entre 5 et 12 caractère"
      ],
      passwordRules: [
        (value) => !!value || "Un mot de passe est requis",
        (value) => value.length >= 4 && value.length <= 8 || "Le mot de passe doit avoir entre 4 et 8 caractère",
        (value) => /^(?=.*\d).{4,8}$/.test(value) || "Le mot de passe doit contenir au moins un chiffre"
      ],
      emailRules: [
        (value) => !!value || "Une adresse Email est requise",
        (value) => value.indexOf("@") !== 0 || "Une adresse Email valide est requise",
        (value) => value.includes("@") || "Une adresse Email valide est requise",
        (value) =>
          value.includes(".") || "Une adresse Email valide est requise",
        (value) =>
          value.indexOf(".") <= value.length - 3 ||
          "Une adresse Email valide est requise",
      ],
      tagsRules: [
        (value) => !!value || "Au moins une préférence doit-être séléctionner",
        (value) => value.length >= 1 && value.length <= 3  || "Maximum 3 préférence sont autorisée",
      ],
      formValidity: false,
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
      value: null,
    };
  },
  methods: {
    register() {
      let data = new FormData();
      data.append("username", this.username);
      data.append("email", this.email);
      data.append("password", this.password);
      data.append("image", this.profilePicture);
      data.append("tags", this.value)
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
    },
  },
};
</script>

<style scoped></style>
