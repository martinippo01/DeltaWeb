<template>
  <div>
    <div id="app">
      <v-app>
        <NavBar select="explore"></NavBar>
        <v-main class="background">
          <!--        _______________________________________________________________________________________-->
          <v-card class="mx-auto sheet" color="secondary" rounded="xl" max-width="1500">
            <v-img :src="this.image"
                   max-height="300"
                   gradient="to top , rgba(30,30,30,0.75), rgba(30,30,30,0.75)"
            >
            <v-row class="d-flex">
              <v-col class="d-flex ml-7">
                <!--              Caso 1 ->  Vista de edicion-->

                <!--              Caso 2 -> Vista normal-->
                <h1>{{ this.routineName }}</h1>
              </v-col>
            </v-row>

            <v-row>
              <!--            Caso 1 -> Vista de edicion-->

              <!--            Caso 2 -> Vista normal-->
              <p
                class="text-justify"
                style="margin: 40px; color: white; margin-bottom: 20px"
              >
                {{ this.routineDetail }}
              </p>
            </v-row>
            </v-img>
          </v-card>

          <!--        _______________________________________________________________________________________-->

          <div class="slider">
            <h1 class="textSlider">WARM UP</h1>
            <v-slide-group class="pa-4" active-class="success" show-arrows dark>
              <v-slide-item
                v-for="card in getWarmUpExercises"
                :key="card.indexId"
              >
                <exerciseCard
                  class="ma-3 position-absolute top-0 start-100 translate-middle"
                  :id="card.indexId"
                  type="warmUp"
                  :exerciseName="card.exercise.name"
                  :edit-mode="false"
                ></exerciseCard>
              </v-slide-item>
            </v-slide-group>
          </div>

          <!--        _______________________________________________________________________________________-->

          <div class="slider">
            <h1 class="textSlider">MAIN SETS</h1>
            <v-slide-group class="pa-4" active-class="success" show-arrows dark>
              <v-slide-item
                v-for="card in getMainSetExercises"
                :key="card.indexId"
              >
                <exerciseCard
                  class="ma-3 position-absolute top-0 start-100 translate-middle"
                  :id="card.indexId"
                  type="mainSet"
                  :exerciseName="card.exercise.name"
                  :edit-mode="false"
                ></exerciseCard>
              </v-slide-item>
            </v-slide-group>
          </div>

          <!--        _______________________________________________________________________________________-->
          <div class="slider">
            <h1 class="textSlider">COOL DOWN</h1>
            <v-slide-group class="pa-4" active-class="success" show-arrows dark>
              <v-slide-item
                v-for="card in getCoolDownExercise"
                :key="card.exercise.id"
              >
                <exerciseCard
                  class="ma-3 position-absolute top-0 start-100 translate-middle"
                  :id="card.exercise.id"
                  type="coolDown"
                  :exerciseName="card.exercise.name"
                  :edit-mode="false"
                ></exerciseCard>
              </v-slide-item>
            </v-slide-group>
          </div>
        </v-main>
      </v-app>

      <!--    ____________________________________________________________________________-->

      <v-snackbar v-model="error" color="error">
        {{ errorText }}
        <template v-slot:action="{ attrs }">
          <v-btn v-bind="attrs" @click="error = false" outlined> Close </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import exerciseCard from "@/components/Routines/exerciseCard";
import NavBar from "@/components/NavBar";

import { mapState, mapActions, storeToRefs } from "pinia";
import { useExerciseStore } from "@/store/exerciseData";
import {useBreadCrumbs} from "@/store/breadCrumbsStore";
import { RoutinesApi } from "@/api/routines";

export default {
  name: "CreateRoutuneView",
  components: { NavBar, exerciseCard },
  data() {
    return {
      error: false,
      errorText: "",
      difficulty: "medium",
      isPublic: true,
      dialogSelectExercise: false,
      dialogCreateExercise: false,
      selectedName: null,
      image:''
    };
  },
  methods: {
    ...mapActions(useExerciseStore, ["getRoutineData"]),
    ...mapActions(useExerciseStore, ["setId"]),
    ...mapActions(useExerciseStore, ["deleteAll"]),
    ...mapActions(useBreadCrumbs, ["addPage"]),
    ...mapActions(useExerciseStore,['setRoutine'])

  },
  computed: {
    ...mapState(useExerciseStore, ["getCoolDownExercise"]),
    ...mapState(useExerciseStore, ["getMainSetExercises"]),
    ...mapState(useExerciseStore, ["getWarmUpExercises"]),
    ...mapState(useExerciseStore, ["createdExercise"]),
    ...mapState(useExerciseStore, ["routineId"]),
    ...mapState(useExerciseStore, ["routineName"]),
    ...mapState(useExerciseStore, ["routineDetail"]),
  },
  async mounted() {
    this.addPage('View Routine',false,'/ViewRoutine')
    const routineID = this.$route.params.id;
    if (routineID != null) {
      this.setId(parseInt(routineID));
      const resp = await RoutinesApi.getRoutine(parseInt(routineID));
      this.image = resp.metadata.img;
      this.setRoutine(resp.name, resp.detail, resp.isPublic, resp.metadata.img);
      this.getRoutineData();
    }else{
      const routineShare = this.$route.query.id;
      console.log(routineShare);
      if (routineShare != null){
        this.setId(parseInt(routineShare));
        const resp = await RoutinesApi.getRoutine(parseInt(routineShare));
        this.image = resp.metadata.img;
        this.setRoutine(resp.name, resp.detail, resp.isPublic, resp.metadata.img);
        this.getRoutineData();
      }
    }
  },
  destroyed() {
    this.deleteAll();
  },
};
</script>

<style scoped>
.temp {
  border: thin solid #cfffb3;
  background-color: #343434;
}
h1,
h4 {
  color: #cfffb3;
  font-family: "Bebas Neue";
}
.textSlider {
  margin-left: 75px;
  margin-top: 20px;
}
.routines-title {
  color: #cfffb3;
}
.slider {
  max-width: 77%;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  border: 2px solid #4b4b4b;
  border-radius: 30px;
  margin-top: 40px;
}
.descripcion {
  margin-left: 40px;
  max-width: 95%;
  font-family: "Roboto";
  color: #d9d9d9;
}
.sheet {
  max-width: 75%;
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  margin-top: 20px;
}
.textField {
  max-width: 350px;
  font-size: 40px;
  font-family: "Bebas Neue";
}
</style>
