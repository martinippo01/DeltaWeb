<template>
  <div id="app">
    <v-app>
      <NavBar select="explore"></NavBar>
      <v-main class="background">
        <v-sheet
          class="mx-auto"
          style="margin-top: 20px; justify-content: center"
          color="secondary"
          min-height="100"
          rounded="xl"
          max-width="1400"
          min-width="100"
        >
          <v-row class="justify-center" style="padding: 10px">
            <h1>EXPLORE</h1>
          </v-row>
          <v-row justify="center">
            <v-text-field
              v-model="searchPattern"
              label="Title"
              class="justify-center"
              style="padding: 20px;margin-left: 20px"
              counter
              dark
              clearable
              solo
              @keypress="filter"
              color="primary"
              append-icon="mdi-cloud-search"
              @click:append="search"
            ></v-text-field>
            <v-btn
              style="padding: 20px; margin-top: 20px; margin-right: 40px"
              height="48"
              width="20"
              filled
              color="background"
              @click="clearSearch"
            >
              <v-icon color="primary">mdi-restart</v-icon>
            </v-btn>
          </v-row>
          <v-container
            color="secondary"
            style="justify-content: center"
            rounded="xl"
          >
            <v-row class="justify-center" style="padding: 10px">
              <RoutineButton
                v-for="routine in routines"
                :key="routine.id"
                style="margin: 10px"
                :routineName="routine.name"
                :routine-id="routine.id"
                directionName="ViewRoutine"
                :exploreMode="true"
                :routine-user-name="routine.user.username"
                :routine-user-id="routine.user.id"
                :routine-user-avatar-url="routine.user.avatarUrl"
              >
              </RoutineButton>
            </v-row>
          </v-container>
          <v-row justify="center" style="margin: 10px">
            <v-btn
              fab
              small
              depressed
              color="primary"
              icon
              :disabled="this.page === this.minPage"
              @click="previousPage"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <p style="color: #cfffb3; padding: 7px 0">
              {{ this.page + 1 }} / {{ this.maxPage + 1 }}
            </p>

            <v-btn
              fab
              small
              depressed
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
import NavBar from "@/components/NavBar";
import RoutineButton from "@/components/Routines/RoutineButton";

import { useRoutinesStore } from "@/store/routinesStore";
import router from "@/router";
import { mapActions, mapState } from "pinia";
import { UserApi, UsersSearch } from "@/api/user";
import { RoutinesApi } from "@/api/routines";
import {useBreadCrumbs} from "@/store/breadCrumbsStore";

export default {
  name: "ExploreView",
  components: { NavBar, RoutineButton },
  data() {
    return {
      routines: [],
      maxPage: 0,
      minPage: 0,
      page: 0,
      searchPattern: "",
    };
  },
  async created() {
    this.cleanAll();
    this.addPage("Explore",false,'/explore');
    this.updatePage(this.page);
  },
  methods: {
    ...mapActions(useBreadCrumbs,['addPage']),
    ...mapActions(useBreadCrumbs,['cleanAll']),


    filter: function (evt) {
      evt = evt ? evt : window.event;
      let expect = evt.key.toString();

      if (expect === "Enter") {
        this.search();
      }
    },
    previousPage() {
      if (this.page > 0) {
        this.updatePage(--this.page);
      }
    },
    nextPage() {
      if (this.page < this.maxPage) {
        this.updatePage(++this.page);
      }
    },
    search() {
      this.page = 0;
      this.updatePage(this.page);
    },
    clearSearch() {
      this.searchPattern = "";
      this.search();
    },
    async updatePage(page) {
      try {
        const res = await RoutinesApi.getAllRoutines(
          page,
          12,
          this.searchPattern
        );
        this.routines = res.content;
        if (page == 0) this.maxPage = Math.floor(res.totalCount / 12);
        console.log(this.routines);
      } catch (error) {
        router.push("/errorPage");
      }
    },
  },
};
</script>

<style scoped>
h1 {
  color: #cfffb3;
  font-family: "Bebas Neue";
}
</style>
