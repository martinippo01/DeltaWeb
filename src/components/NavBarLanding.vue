<template>
    <v-app-bar color="background" elevation="0">
      <router-link style="text-decoration: none; color: inherit;" to="/">
        <v-img
          max-height="60"
          max-width="60"
          src="@/assets/Logo.png"
          class="ma-3 position-absolute top-100 start-100 translate-middle"
        ></v-img>
      </router-link>
      <v-spacer></v-spacer>
      <router-link style="text-decoration: none; color: inherit;" to="/explore">
        <v-btn
          class="ma-3 position-absolute top-0 start-100 translate-middle"
          :color="select === 'explore' ? 'primary' : 'topBar'"
          plain
        >
          EXPLORE
        </v-btn>
      </router-link>
      <router-link style="text-decoration: none; color: inherit;" to="/signup">
        <v-btn
          class="ma-3 position-absolute top-0 start-100 translate-middle"
          :color="select === 'singUp' ? 'primary' : 'topBar'"
          plain
        >
          SIGN UP
        </v-btn>
      </router-link>
      <router-link  style="text-decoration: none; color: inherit;" to="/login">
        <v-btn
          class="ma-3 position-absolute top-0 start-100 translate-middle"
          :color="select === 'logIn' ? 'primary' : 'topBar'"
          plain
        >
          LOG IN
        </v-btn>
      </router-link>
    </v-app-bar>
</template>

<script>
export default {
  name: "TopBar",
  props: {
    select: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped></style>
