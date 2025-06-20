export class UserSummary {
  id: number;
  firstname: string;
  lastname: string;

  constructor(id: number, firstname: string, lastname: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}
