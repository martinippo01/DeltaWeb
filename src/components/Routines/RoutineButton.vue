<template>
  <v-card
    color="secondary"
    class="hover-click"
    rounded="xl"
    width="350"
    height="250"
  >
    <v-img
      class=""
      height="250px"
      :src="this.image"
      @click="toRoutine"
      gradient="to top , rgba(30,30,30,0.5), rgba(30,30,30,0.5)"
    >
      <v-container>
        <v-row class="justify-center">
          <h1 style="justify-self: center; margin-top: 6px">
            {{ this.routineName }}
          </h1>
          <v-btn
            icon
            v-on:click.stop="changeDeleteState"
            fill
            style="position: absolute; top: 10px; right: 10px"
            @click="changeDeleteState"
            v-if="!exploreMode"
          >
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <v-row
        style="position: absolute; margin-top: 150px; margin-left: 20px"
        v-if="exploreMode"
      >
        <v-avatar size="32">
          <v-img
            alt="user"
            :src="this.routineUserAvatarUrl"></v-img>
        </v-avatar>
        <p style="font-family: 'Roboto Light'; color: white; margin-left: 10px; margin-top: 7px">{{ this.routineUserName }}</p>
      </v-row>
      <v-dialog v-model="deleted" persistent width="610">
        <v-sheet color="error" outlined="outlined" width="600" rounded="xl">
          <v-card
            color="background"
            width="600"
            height="120"
            class="box center"
            rounded="xl"
          >
            <v-card-title style="color: #cfffb3; ">Are you sure you want to delete it?</v-card-title>
            <v-card-actions>
              <v-row justify="center">
                <v-btn
                  color="primary"
                  outlined
                  @click="changeDeleteState(false)"
                  style="margin: 7px"
                >
                  <span style="color: #cfffb3">No </span>
                </v-btn>
                <v-btn
                  color="primary"
                  filled
                  @click="deleteMe"
                  style="margin: 7px"
                >
                  <span style="color: #1e1e1e">YES</span>
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-dialog>
    </v-img>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useRoutinesStore } from "@/store/routinesStore";
import { useUserStore } from "@/store/user";
import {RoutinesApi} from "@/api/routines";
import { exerciseApi } from "@/api/exercises";

export default {
  name: "RoutineButton",
  components: {},
  props: {
    routineName: { type: String, required: true },
    routineId: { type: Number, required: true },
    exploreMode: { type: Boolean, required: true },
    directionName:{type:String,required:true},
    routineUserName:{type: String, required: false  },
    routineUserId:{type: Number, required: false},
    routineUserAvatarUrl:{type: String, required: false  },
  },

  data() {
    return {
      items: [
        { title: "Edit", action: this.editMe },
        { title: "Delete", action: this.deleteMe },
      ],
      photo: "",
      name: "",
      deleted: false,
      image:''
    };
  },
  methods: {
    async deleteMe() {
      await this.deleteRoutine(this.routineId);
      await this.setRoutines(this.userId);
    },
    changeDeleteState(state){
      this.deleted = state;
      console.log(this.deleted);
    },
    getProfilePic(){
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    },

    toRoutine() {
      this.$router.push({
        name: `${this.directionName}`,
        params: {
          editMode: false,
          id: this.routineId,
          from: "myRoutine",
        },
      });
    },

    ...mapActions(useRoutinesStore, ["deleteRoutine"]),
    ...mapActions(useRoutinesStore, ["setRoutines"]),
  },
  async created() {
    try {
      const res = await RoutinesApi.getRoutine(this.routineId);
      this.image = res.metadata.img;
      console.log(this.image);
      if (this.image.length <= 0) {
        const images = require.context('../../assets', false, /\.png$/)
        this.image = images('./' + 'logo' + ".png")
      }
    } catch (error) {
      const images = require.context('../../assets/imgs', false, /\.jpg$/)
      this.image = images('./' + 'RoutineDefault' + ".jpg")    }
  },
  computed: {
    ...mapState(useUserStore, ["userId"]),
  },
};
</script>

<style scoped>
h1 {
  font-family: "Bebas Neue";
  color: white;
}
.hover-click {
  cursor: pointer;
}
</style>
