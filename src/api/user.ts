export { UserApi, Credentials, Registration };

import { Api } from "./api";

class Registration {
  constructor(
    _name: string,
    _email: string,
    _password: string,
    _birthday: number
  ) {
    this.username = _name;
    this.password = _password;
    this.email = _email;
  }

  username: string;
  password: string;
  email: string;
}

class Credentials {
  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  username: string;
  password: string;
}
class UserApi {
  static getUrl(slug: string) {
    return `${Api.baseUrl}/users${slug ? `/${slug}` : ""}`;
  }

  /* aca la clave esta en que le agrego al url el slug login debido a que
   * la api me pide ese url para manejar el login! */
  static async login(credentials: Credentials, controller: any) {
    return await Api.post(UserApi.getUrl("login"), false, credentials, controller);
  }

  static async addUser(registration: Registration, controller: any) {
    await Api.post(UserApi.getUrl(""), false, registration, controller);
  }

  static async logout(controller: any) {
    await Api.post(UserApi.getUrl("logout"), true, {}, controller);
  }

  static async get(controller: any) {
    return Api.get(UserApi.getUrl("current"), true, controller);
  }
}