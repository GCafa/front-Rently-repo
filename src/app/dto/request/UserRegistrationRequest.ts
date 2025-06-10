export class UserRegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  repeatPassword: string;

  constructor(
    firstname: string,
    lastname: string,
    email: string,
    username: string,
    password: string,
    repeatPassword: string
  ) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.username = username;
    this.password = password;
    this.repeatPassword = repeatPassword;
  }
}
