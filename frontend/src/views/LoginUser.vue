<template>
  <div class="main-container d-flex justify-center flex-column">
    <v-card max-width="95vw" class="mx-auto rounded-xl">
      <v-card-title>
        <h1 class="display-1 text-center mx-auto">Se connecter</h1>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
          <v-card-actions class="d-flex justify-space-around">
            <v-btn to="/register" color="success">S'inscrire</v-btn>
            <v-btn type="submit" color="info">Se connecter</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
      <v-divider v-if="error"></v-divider>

      <p class="text-center red--text mt-2">{{ error }}</p>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      showPassword: false,
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch("Login", {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "userdashboard" });
        })
        .catch((err) => {
          this.error = err.response.data.error;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
