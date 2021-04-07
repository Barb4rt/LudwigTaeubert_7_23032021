<template>
  <div>
    <form @submit.prevent="register">
      <label for="username"> Name: </label>
      <input v-model="username" type="text" name="username" value />

      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />

      <label for="password"> Password: </label>
      <input v-model="password" type="password" name="password" value />

      <button type="submit" name="button">Login</button>

      <router-link to="/login"> Already have an account? Login. </router-link>
    </form>
    <p>{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    register() {
      this.$store
        .dispatch("register", {
          username: this.username,
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

<style scoped></style>
