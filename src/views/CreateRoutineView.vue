<template>
  <div>
    <div id="app">
      <v-app>
        <NavBar select="myRoutines"></NavBar>
        <v-main class="background">
          <!--        _______________________________________________________________________________________-->
          <v-card class="mx-auto sheet" color="secondary" rounded="xl" max-width="1500">
            <v-img :src="this.image"
                   max-height="400"
                   gradient="to top , rgba(30,30,30,0.75), rgba(30,30,30,0.75)"
            >
              <v-row class="d-flex">
                <v-col class="d-flex ml-7">
                  <h1 style="margin-top: 10px">{{ this.routineName }}</h1>
                </v-col>
                <v-col class="justify-end d-flex" md="2" offset-md="3">
                  <v-btn
                    color="primary"
                    outlined
                    style="margin-top: 10px"
                    class="justify-end mr-7"
                    v-if="editMode"
                    @click="discard"
                  >
                    DISCARD
                  </v-btn>
                  <v-btn
                    color="primary"
                    class=" justify-end mr-7 secondary--text"
                    v-if="editMode"
                    style="margin-top: 10px"
                    @click="save"
                  >
                    SAVE
                  </v-btn>
                  <!--              CASO 2 -> Vista normal-->
                  <v-btn
                    color="primary"
                    class=" justify-end mr-7 "
                    outlined
                    v-if="!editMode"
                    style="margin-top: 10px"
                    @click="share = true"
                  >
                    SHARE ROUTINE
                  </v-btn>
                  <v-btn
                    color="primary"
                    class=" justify-end mr-7 secondary--text"
                    v-if="!editMode"
                    style="margin-top: 10px"
                    @click="editMode = true"
                  >
                    EDIT ROUTINE
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <p
                  class="text-justify"
                  style="margin: 40px; color: white; margin-bottom: 20px"
                >
                  {{ this.routineDetail }}
                </p>
                </v-row>
              <v-row  class="d-flex justify-center align-center">
                  <v-file-input
                    v-if="editMode"
                    color="primary "
                    dark
                    :clearable="false"
                    show-size
                    label="Set Routine Image"
                    outlined
                    rounded="lg"
                    style="
                      align-self: end;
                      font-family: 'Roboto Medium';
                      font-size: x-large;
                      max-width: 250px;
                    "
                    @change="handleImage"
                    v-model="readImg"
                    accept="image/*"
                  />
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
                  :editmode="editMode"
                ></exerciseCard>
              </v-slide-item>
              <v-slide-item v-if="editMode">
                <button
                  @click="
                    addRoutine(0);
                    dialogSelectExercise = true;
                  "
                >
                  <addButtom></addButtom>
                </button>
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
                  :editmode="editMode"
                ></exerciseCard>
              </v-slide-item>
              <v-slide-item v-if="editMode">
                <button
                  @click="
                    addRoutine(1);
                    dialogSelectExercise = true;
                  "
                >
                  <addButtom></addButtom>
                </button>
              </v-slide-item>
            </v-slide-group>
          </div>

          <!--        _______________________________________________________________________________________-->
          <div class="slider">
            <h1 class="textSlider">COOL DOWN</h1>
            <v-slide-group class="pa-4" active-class="success" show-arrows dark>
              <v-slide-item
                v-for="card in getCoolDownExercise"
                :key="card.indexId"
              >
                <exerciseCard
                  class="ma-3 position-absolute top-0 start-100 translate-middle"
                  :id="card.indexId"
                  type="coolDown"
                  :exerciseName="card.exercise.name"
                  :editmode="editMode"
                ></exerciseCard>
              </v-slide-item>
              <v-slide-item v-if="editMode">
                <button
                  @click="
                    addRoutine(2);
                    dialogSelectExercise = true;
                  "
                >
                  <addButtom></addButtom>
                </button>
              </v-slide-item>
            </v-slide-group>
          </div>
        </v-main>
      </v-app>

      <!--    ____________________________________________________________________________-->
      <v-dialog v-model="dialogSelectExercise" persistent max-width="600px">
        <v-card color="background">
          <v-card-title>
            <span class="text-h5" style="color: #cfffb3">Add exercise</span>

            <v-btn
              color="primary"
              style="margin-left: 70%; margin-top: 0px"
              @click="
                dialogSelectExercise = false;
                dialogCreateExercise = true;
              "
            >
              <span style="color: #1e1e1e">Create New</span>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>

              <v-row>
                <v-col>
                  <v-virtual-scroll
                    :items="createdExercise"
                    :item-height="70"
                    height="300"
                  >
                    <template v-slot:default="{ item }">
                      <v-list-item :key="item.name">
                        <v-list-item-content>
                          <v-list-item-title>
                            <span style="color: white">{{ item.name }}</span>
                          </v-list-item-title>
                          <v-list-item-subtitle style="color: darkgray">{{
                            item.detail
                          }}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-btn
                            fab
                            style="margin-right: 15px"
                            small
                            outlined
                            color="primary"
                            @click="deleteExercisesHandler(item)"
                          >
                            <v-icon color="primary"> mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-action>

                        <v-list-item-action>
                          <v-btn
                            fab
                            small
                            outlined
                            color="primary"
                            @click="modifyExercise(item)"
                          >
                            <v-icon color="primary"> mdi-pencil</v-icon>
                          </v-btn>
                        </v-list-item-action>

                        <v-list-item-action>
                          <v-btn
                            fab
                            small
                            depressed
                            color="primary"
                            @click="selectExercise(item)"
                          >
                            <v-icon color="#1e1e1e" v-if="selectedName === item"
                              >mdi-check</v-icon
                            >
                            <v-icon color="#1e1e1e" v-else>mdi-plus</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined @click="discardExerciseHandler()">
              Discard
            </v-btn>
            <v-btn
              color="primary"
              filled
              :disabled="selectedName === null"
              @click="saveExercise"
            >
              <span style="color: #1e1e1e"> Save </span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--    ____________________________________________________________________________-->
      <v-dialog v-model="dialogCreateExercise" persistent max-width="600px">
        <v-card color="background">
          <v-card-title v-if="!dialogCreateExercise">
            <span class="text-h5" style="color: #cfffb3"
              >Create new exercise</span
            >
          </v-card-title>

          <v-card-title v-if="dialogModifyExercise">
            <span class="text-h5" style="color: #cfffb3">Modify exercise</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    dark
                    color="primary"
                    label="Name"
                    v-model="title"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    v-model="detail"
                    label="Description"
                    counter
                    maxlength="120"
                    full-width
                    single-line
                    dark
                    color="primary"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              outlined
              @click="
                dialogCreateExercise = false;
                dialogModifyExercise = false;
                selectedName = null;
              "
            >
              Discard
            </v-btn>
            <v-btn color="primary" filled @click="saveExercise">
              <span style="color: #1e1e1e">Save</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--    ____________________________________________________________________________-->
    </div>
    <v-snackbar v-model="error" color="error">
      {{ errorText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" @click="error = false" outlined> Close </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="exitVerify" persistent width="610">
      <v-sheet color="error" outlined="outlined" width="600" rounded="xl">
        <v-card
          color="background"
          width="600"
          height="120"
          class="box center"
          rounded="xl"
        >
          <v-card-title style="color: #cfffb3"
            >Are you sure you wanna exit?</v-card-title
          >
          <v-card-actions>
            <v-row justify="center">
              <v-btn
                color="primary"
                outlined
                @click="exitAndSaveHandler"
                style="margin: 7px"
              >
                <span style="color: #cfffb3">Exit and Save</span>
              </v-btn>
              <v-btn
                color="primary"
                filled
                @click="stayHandler"
                style="margin: 7px"
              >
                <span style="color: #1e1e1e">Stay</span>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>

    <v-dialog v-model="dialogImgError" persistent width="610">
      <v-sheet color="error" outlined="outlined" width="600" rounded="xl">
        <v-card
            color="background"
            width="600"
            height="120"
            class="box center"
            rounded="xl"
        >
          <v-card-title style="color: #cfffb3">
            Sorry, but maximum size of image is 80Kb
          </v-card-title>
          <v-card-actions>
            <v-btn style="margin-left: auto; margin-right: auto" @click="dialogImgError = false" outlined color="error">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>
    <v-dialog v-model="share" persistent width="620">
      <v-sheet  color="primary" style="margin-left: auto; margin-right: auto" outlined="outlined" width="600" rounded="xl">
        <v-card
          color="background"
          width="800"
          height="120"
          rounded="xl"
          class="box center"
        >
          <v-card-title style="color: #cfffb3">
            Your share link is: http://localhost:8080/viewRoutine?id={{this.getID()}}

          </v-card-title>

          <v-card-actions >

              <v-row justify="center">
                <v-btn
                  color="primary"
                  outlined
                  @click="share = false"
                  style="margin: 7px"
                >
                  <span style="color: #cfffb3">Close</span>
                </v-btn>
                <v-btn
                  color="primary"
                  filled
                  @click="copyToClipboard"
                  style="margin: 7px"
                >
                  <span style="color: #1e1e1e">Copy</span>
                </v-btn>
              </v-row>
          </v-card-actions>
        </v-card>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import exerciseCard from "@/components/Routines/exerciseCard";
import NavBar from "@/components/NavBar";
import router from "@/router";
import addButtom from "@/components/Routines/add";
import { mapState, mapActions, storeToRefs } from "pinia";
import { useExerciseStore } from "@/store/exerciseData";
import {useBreadCrumbs} from "@/store/breadCrumbsStore";
import {RoutinesApi,Routine} from "@/api/routines";

export default {
  name: "CreateRoutuneView",
  components: { NavBar, exerciseCard, addButtom },
  data() {
    return {
      selectedExercise: {},
      pendingRoute: "",
      modifiedExerciseId: 0,
      exitVerify: false,
      error: false,
      errorText: "",
      detail: "",
      title: "",
      difficulty: "medium",
      dialogSelectExercise: false,
      dialogCreateExercise: false,
      dialogModifyExercise: false,
      selectedName: null,
      cycleSelect: 0,
      maxId: 0,
      editMode: false,
      image: "",
      readImg: "",
      dialogImgError: false,
      share:false,
      routineId:0
    };
  },

  methods: {
    ...mapActions(useBreadCrumbs, ["cleanAll"]),
    ...mapActions(useBreadCrumbs, ["addPage"]),
    ...mapActions(useExerciseStore, ["deleteAll"]),
    ...mapActions(useExerciseStore, ["addExercise"]),
    ...mapActions(useExerciseStore, ["uploadExercises"]),
    ...mapActions(useExerciseStore, ["updateExercises"]),
    ...mapActions(useExerciseStore, ["deleteExercises"]),
    ...mapActions(useExerciseStore, ["getCreatedExercises"]),
    ...mapActions(useExerciseStore, ["createRoutine"]),
    ...mapActions(useExerciseStore, ["getRoutineData"]),
    ...mapActions(useExerciseStore, ["addExercisesToRoutine"]),
    ...mapActions(useExerciseStore, ["deleteAll"]),
    ...mapActions(useExerciseStore, ["setId"]),
    ...mapState(useExerciseStore, ["getRoutineId"]),
    ...mapState(useExerciseStore, ["setRoutine"]),


    discardExerciseHandler() {
      this.dialogSelectExercise = false;
      this.selectedName = null;
    },
    discard() {
      this.editMode = false;
      router.push("/myRoutines");
    },
    getID(){
      return localStorage.getItem("ROUTINE-ID");
    },
    async save() {
      this.editMode = false;

          await this.addExercisesToRoutine();

        try {

          await RoutinesApi.updateRoutine(
            new Routine(this.routineName, this.routineDetail, "rookie",this.publicRoutine, {
              img: this.image,
            }),
            parseInt(localStorage.getItem('ROUTINE-ID'))
          );
          router.push("/myRoutines");
        }catch (error){
          this.error = true;
          this.errorText = error.errorText;
        }




    },
    copyToClipboard(){
      const clipboardData =
        event.clipboardData ||
        window.clipboardData ||
        event.originalEvent?.clipboardData ||
        navigator.clipboard;
      clipboardData.writeText(` http://localhost:8080/viewRoutine?id=${this.getID()}`);
      this.share = false;
    },
    addRoutine(type) {
      this.dialogSelectExercise = true;
      this.cycleSelect = type;
    },
    async saveExercise() {
      if (!this.dialogModifyExercise) this.saveNewExercise();
      else this.saveModifiedExercise();
    },
    async saveModifiedExercise() {
      this.dialogCreateExercise = false;
      this.dialogModifyExercise = false;

      try {
        await this.updateExercises(
          {
            name: this.title,
            detail: this.detail,
            type: "exercise",
            metadata: null,
          },
          this.modifiedExerciseId
        );
        this.getCreatedExercises();
      } catch (error) {
        if (error.code === 99) {
          this.error = true;
          this.errorText = "Connection error";
        }
        this.error = true;
        this.errorText = "Couldn't modify exercise";
      }
    },
    async saveNewExercise() {
      this.dialogSelectExercise = false;
      this.dialogSelectExercise = false;
      this.dialogCreateExercise = false;
      this.selectedName = null;
      try {
        await this.uploadExercises(
          {
            name: this.title,
            detail: this.detail,
            type: "exercise",
            metadata: null,
          },
          this.cycleSelect,
          this.maxId
        );
      } catch (error) {
        if (error.code === 99) {
          this.error = true;
          this.errorText = "Connection error";
        } else {
          this.error = true;
          this.errorText = error.errorText;
        }
      }
      this.maxId++;
    },
    handleImage() {

      if(this.readImg.size > 80000) {
        this.dialogImgError = true;
        this.readImg = "";
      } else  {
        this.createBase64Image(this.readImg);
      }
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(fileObject);
      console.log("wrote image");
    },
    selectExercise(item) {
      this.selectedName = item;
      this.title = item.name;
      this.detail = item.detail;
    },
    modifyExercise(item) {
      this.dialogCreateExercise = true;
      this.dialogModifyExercise = true;
      this.title = item.name;
      this.descripcion = item.descripcion;
      this.modifiedExerciseId = item.id;
    },
    async deleteExercisesHandler(item) {
      try {
        this.error = true;
        await this.deleteExercises(item.id);
        this.errorText = "waiting";
      } catch (error) {
        this.error = true;
        this.errorText = "Couldn't delete exercise";
      }
      this.error = false;
      this.getCreatedExercises();
    },
    async exitAndSaveHandler() {
      await this.addExercisesToRoutine();
      this.exitVerify = false;
      this.pendingRoute();
    },
    stayHandler() {
      this.exitVerify = false;
      this.pendingRoute(false);
    },
  },
  computed: {
    ...mapState(useExerciseStore, ["getCoolDownExercise"]),
    ...mapState(useExerciseStore, ["getMainSetExercises"]),
    ...mapState(useExerciseStore, ["getWarmUpExercises"]),
    ...mapState(useExerciseStore, ["createdExercise"]),
    ...mapState(useExerciseStore, ["routineName"]),
    ...mapState(useExerciseStore, ["publicRoutine"]),
    ...mapState(useExerciseStore, ["routineDetail"]),

  },
  async mounted() {
    this.addPage('Edit Routine',true,'/createRoutine')
    this.editMode = this.$route.params.editMode;
    const aux = this.$route.params.from;
    try {
      if (aux === "myRoutinesNew") {
        this.createRoutine();
      } else if (aux === "myRoutine") {
        const routineID = this.$route.params.id;
        this.setId(parseInt(routineID));
        this.getRoutineData();
      } else {
        this.getRoutineData();
      }
    }catch (error){
      if (error.code === 99) {
        this.error = true;
        this.errorText = "Connection error";
      }
      this.error = true;
      this.errorText = error.text;
    }
    try {
      this.getCreatedExercises();
    } catch (error) {
      if (error.code === 99) {
        this.error = true;
        this.errorText = "Connection error";
      }
      this.error = true;
      this.errorText = error.errorText;
    }
    try {
      var id;
      if ((id =localStorage.getItem("ROUTINE-ID"))== null)
        id = 0;
      else
        id = parseInt(id);
      const resp = await RoutinesApi.getRoutine(id);
      this.image = resp.metadata.img;
      this.setRoutine(resp.name,resp.detail,resp.isPublic,resp.metadata.img);
    }catch (error){
      if (error.code === 99) {
        this.error = true;
        this.errorText = "Connection error";
      }
        this.error = true;
        this.errorText = error.text;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.editMode) {
      this.exitVerify = true;
      this.pendingRoute = next;
    } else {
      next();
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
