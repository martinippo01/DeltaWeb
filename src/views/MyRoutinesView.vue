<template>
  <div id="app">
    <v-app>
      <NavBar select="myRoutines" />
      <v-main class="background">
        <v-sheet
          class="mx-auto ma-10px"
          color="secondary"
          min-height="100"
          rounded="xl"
          max-width="1450"
          min-width="100"
        >
          <v-row justify="center" style="padding: 10px">
            <h1>my routines</h1>
          </v-row>

          <v-container
            color="secondary"
            style="justify-content: center"
            rounded="xl"
            elevation="0"
          >
            <v-row class="routines-group">
              <Add
                @click.native="toRoutine(true)"
                style="text-decoration: none; color: inherit; margin: 10px"
              />
              <RoutineButton
                v-for="routine in routines"
                @click.native="toRoutine(false,routine.id)"
                :key="routine.id"
                style="text-decoration: none; color: inherit; margin: 10px"
                :routineName="routine.name"
              ></RoutineButton>
            </v-row>
          </v-container>
          <v-row
            justify="center"
            style="margin: 10px;"
          >
            <v-btn
              fab
              small
              color="primary"
              icon
              :disabled="this.page === this.minPage"
              @click="previousPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <p style="color: #CFFFB3; padding: 7px">{{this.page + 1}} / {{this.maxPage + 1}}</p>

            <v-btn
              fab
              small
              color="primary"
              icon
              :disabled="this.page === this.maxPage"
              @click="nextPage"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-sheet>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import RoutineButton from "@/components/Routines/RoutineButton";
import NavBar from "@/components/NavBar";
import { RoutinesApi, FetchRoutines } from "@/api/routines";
import router from "@/router";
import Add from "@/components/Routines/add.vue";
import { useRoutinesStore } from "@/store/routinesStore";
import { mapActions, mapState } from "pinia";

export default {
  name: "MyRoutines",
  components: { NavBar, RoutineButton, Add },
  async created() {
    try {
      this.resetStore();
      await this.setRoutines();
    } catch (error) {
      router.push("/errorPage");
    }
    console.log(this.routines);
  },
  methods: {
    ...mapActions(useRoutinesStore, ["setRoutines"]),
    ...mapActions(useRoutinesStore, ["nextPage"]),
    ...mapActions(useRoutinesStore, ["previousPage"]),
    ...mapActions(useRoutinesStore, ["resetStore"]),
    toRoutine(mode,id) {
      this.$router.push({
        name: "createRoutine",
        params: {
          editMode: mode,
          id: id
        },
      });
    },
  },
  computed: {
    ...mapState(useRoutinesStore, ["routines"]),
    ...mapState(useRoutinesStore, ["page"]),
    ...mapState(useRoutinesStore, ["minPage"]),
    ...mapState(useRoutinesStore, ["maxPage"]),
  },
};
</script>

<style scoped>
h1 {
  color: #cfffb3;
  font-family: "Bebas Neue";
}
.routines-title {
  color: #cfffb3;
}

.routines-group {
  padding: 20px;
  justify-content: center;
}

.routine-card {
  padding: 10px;
  cursor: pointer;
}
</style>
