<template>
  <v-app>
    <NavBar select="logIn" />
    <v-main class="background">
      <v-container>
        <v-row class="mt-16">
          <v-col class="d-flex justify-center align-center">
            <v-img src="@/assets/Logo.png" max-height="116" max-width="124" />
          </v-col>
        </v-row>
        <v-row class="mt-15">
          <v-col
            class="d-flex justify-center align-center"
            style="align-items: center"
          >
            <v-sheet
              color="secondary"
              width="500"
              rounded="xl"
              style="align-items: center"
            >
              <v-container>
                <v-row justify="end">
                  <v-text-field
                    class="pt-10 pr-10 pl-10"
                    label="Username"
                    dark="dark"
                    color="primary"
                    v-model="username"
                  />
                </v-row>
                <v-row justify="end">
                  <v-text-field
                    class="pt-5 pr-10 pl-10"
                    label="Password"
                    dark="dark"
                    color="primary"
                    type="password"
                    v-model="password"
                  />
                </v-row>
                <v-row justify="center">
                  <v-checkbox
                    dark
                    color="primary"
                    v-model="rememberMe"
                    label="Remember me"
                  ></v-checkbox>
                </v-row>
                <v-row justify="center">
                  <v-btn
                    @click="loginHandler()"
                    color="primary"
                    plain
                    class="temp"
                  >
                    LOG IN
                  </v-btn>
                </v-row>
                <v-dialog v-model="confirmationEmail" persistent width="620">
                  <v-sheet color="error" outlined="outlined" width="600" rounded="xl">
                    <v-card
                      color="background"
                      width="600"
                      height="190"
                      class="box center"
                      rounded="xl"
                    >
                      <v-app-bar color="background" style="margin-top: 1px"
                                 elevation="0" height="20">
                        <v-spacer></v-spacer>
                        <v-btn
                          @click="confirmationEmail = false"
                          color="white"
                          style="padding-top: 4px; justify-self: end"
                          icon
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-app-bar>
                      <v-card-title style="color: #cfffb3"
                      >You have not confirmed your account!</v-card-title
                      >
                      <v-row class="d-flex justify-center align-center">
                        <v-text-field v-model="email"
                        style="max-width: 300px"
                        >

                        </v-text-field>
                      </v-row>

                      <v-card-actions>

                        <v-row justify="center">

                          <v-btn
                            color="primary"
                            outlined
                            @click="resendCode"
                            style="margin: 7px"
                          >
                            <span style="color: #cfffb3">Resend Code</span>
                          </v-btn>
                        </v-row>
                      </v-card-actions>
                    </v-card>
                  </v-sheet>
                </v-dialog>
                <v-row justify="center" class="mt-5" style="margin-bottom: 5px">
                  <router-link to="/signUp">
                    <a justify="center"> Don't have an account? </a>
                  </router-link>
                </v-row>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <!--    Esto es para el snackbar. Es como un pop up-->
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" @click="snackbar = false" outlined> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import NavBar from "@/components/NavBar";
import { useSecurityStore } from "../store/securityStore.js";
import router from "@/router";
import { Credentials } from "@/api/user";
import {UserApi} from "@/api/user";

export default {
  name: "LogIn",
  components: { NavBar },
  data() {
    return {
      username: "johnDoe1",
      password: "1234",
      snackbar: false,
      snackbarColor: "",
      rememberMe: false,
      snackbarText: "",
      email:"",
      confirmationEmail:false
    };
  },
  methods: {
    loginHandler: async function () {
      const credentials = new Credentials(this.username, this.password);
      const store = useSecurityStore();

      try {
        await store.login(credentials, this.rememberMe);
        router.push("/myRoutines");
      } catch (error) {
        if (error.code === 4) {
          this.snackbarText = "Invalid username/password";
          this.snackbarColor = "error";
          this.snackbar = true;
        }else if(error.code === 8){
          this.confirmationEmail = true;
        }
      }
    },
    resendCode(){
      try {
        UserApi.resendVerification(this.email);
        router.push("/VerifyEmail")
      }catch (error){
        this.snackbarText = "Invalid username/password";
        this.snackbarColor = "error";
        this.snackbar = true;
      }
    }
  },

};
</script>

<style scoped>
.temp {
  border: thin solid #cfffb3;
  background-color: #343434;
}
</style>
