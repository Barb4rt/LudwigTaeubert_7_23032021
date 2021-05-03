<template>
  <v-card width="400" class="mx-auto mt-5">
    <v-card-title>
      <h1 class="display-1">Login</h1>
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
        <v-card-actions>
          <v-btn to="/register" color="success">Register</v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="info">Login</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>

    <p>{{ error }}</p>
  </v-card>
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
