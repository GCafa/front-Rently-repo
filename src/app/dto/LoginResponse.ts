export class LoginResponse {
  token: string;
  jwt: any;

  constructor(token: string) {
    this.token = token;
  }
}
